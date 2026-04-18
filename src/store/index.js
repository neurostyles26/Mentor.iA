import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    currentCourse: null,
    lessons: [],
    isGenerating: false,
    generationError: null,
    generatedContent: null,
    tutorResponse: null,
    isAskingTutor: false,
    newCourseDraft: {
      name: '',
      grade: '',
      objectives: '',
      file: null
    },
    lastDiagnosis: null,
    teacherChatHistory: []
  }),
  actions: {
    async askMentorTeacher(question) {
      if (!question) return
      this.isAskingTutor = true
      
      const newMessage = { role: 'user', content: question, timestamp: new Date() }
      this.teacherChatHistory.push(newMessage)

      try {
        const { data, error } = await supabase.functions.invoke('tutor-chat', {
          body: { 
            pregunta: question, 
            contexto: `Eres un Mentor para DOCENTES. Ayúdame a diseñar una clase creativa para mis alumnos usando Gemma 4.` 
          }
        })

        if (error) throw error

        this.teacherChatHistory.push({ 
          role: 'assistant', 
          content: data.text,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Teacher Chat Error:', error)
        let message = 'Lo siento, Gemma 4 tuvo un problema. ¿Podrías intentar de nuevo?'
        
        // Check for specific error details from Supabase Function
        if (error.context) {
          try {
            const errData = await error.context.json()
            if (errData.type === 'AUTH_ERROR' || errData.type === 'INVALID_API_KEY') {
              message = '⚠️ Error de Autenticación: La API Key de Gemma 4 no es válida o falta en el servidor.'
            } else if (errData.type === 'MODEL_NOT_FOUND') {
              message = '⚠️ Error de Modelo: El modelo Gemma 4 no está disponible en esta región actualmente.'
            }
          } catch (e) { /* ignore parse error */ }
        }

        this.teacherChatHistory.push({ 
          role: 'system', 
          content: message,
          timestamp: new Date()
        })
      } finally {
        this.isAskingTutor = false
      }
    },
    clearTeacherChat() {
      this.teacherChatHistory = []
    },
    setNewCourseDraft(data) {
      this.newCourseDraft = { ...this.newCourseDraft, ...data }
    },
    async fetchCourses() {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching courses:', error)
        return
      }
      this.courses = data
    },
    async createCourseFromDraft() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('No authenticated user')

      const { data, error } = await supabase
        .from('courses')
        .insert({
          name: this.newCourseDraft.name,
          grade: this.newCourseDraft.grade,
          teacher_id: session.user.id,
          color: 'from-purple-500 to-indigo-500'
        })
        .select()
        .single()

      if (error) throw error
      
      this.courses.unshift(data)
      this.currentCourse = data
      return data
    },
    async generateLessonsWithAI(topic, extraData = {}) {
      this.isGenerating = true
      this.generationError = null
      this.generatedContent = null
      this.lastDiagnosis = null
      
      const { 
        grade = this.currentCourse?.grade || 'No especificado', 
        subject = this.currentCourse?.name || 'General',
        type = 'lesson' 
      } = extraData

      const prompt = `Materia: ${subject}. Grado: ${grade}. Tema: ${topic}. Tipo: ${type}.`

      try {
        const { data, error } = await supabase.functions.invoke('generate-lessons', {
          body: { prompt, grade, subject, type }
        })

        if (error) {
          const errorMsg = await error.context?.json().then(j => j.error).catch(() => null)
          throw new Error(errorMsg || error.message || 'Error de servidor Gemma 4')
        }

        this.generatedContent = data.text
        
        if (this.currentCourse) {
          const { data: lessonData, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: this.currentCourse.id,
              title: type === 'lesson' ? `Lección de ${topic}` : type === 'workshop' ? `Taller de ${topic}` : `Examen de ${topic}`,
              content: data.text,
              status: 'draft',
              type: 'Gemma 4'
            })
            .select()
            .single()

          if (lessonError) throw lessonError
          
          this.lessons = [lessonData]
          
          await supabase
            .from('courses')
            .update({ classes_count: (this.currentCourse.classes_count || 0) + 1 })
            .eq('id', this.currentCourse.id)
        }
      } catch (error) {
        console.error('Error generating content with Gemma 4:', error)
        
        let userMessage = error.message
        
        // Attempt to parse structured error from Edge Function
        if (error.context) {
          try {
            const errData = await error.context.json()
            if (errData.type === 'AUTH_ERROR' || errData.type === 'INVALID_API_KEY') {
              userMessage = '⚠️ Configuración Incómoda: La API Key de Gemma 4 no es válida o falta en Supabase.'
            } else if (errData.type === 'MODEL_NOT_FOUND') {
              userMessage = '⚠️ Desconexión de Modelo: Gemma 4 no respondió. Intentando con motor de respaldo...'
            } else if (errData.details) {
              userMessage = errData.error + ' - ' + errData.details
            }
          } catch (e) { /* ignore */ }
        } else if (error.message.includes('CONFIG_ERROR')) {
          userMessage = '⚠️ Falta la configuración de Gemma 4. Por favor, asegúrate de tener la GEMINI_API_KEY configurada.'
        }
        
        this.generationError = userMessage
        this.lastDiagnosis = error.message
      } finally {
        this.isGenerating = false
      }
    },
    async fetchLessons(courseId) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      this.lessons = data
    },
    async updateLesson(lessonId, content) {
      const { error } = await supabase
        .from('lessons')
        .update({ content })
        .eq('id', lessonId)
      
      if (error) throw error
      
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) lesson.content = content
    },
    async askTutor(context, question) {
      if (!question) return
      
      this.isAskingTutor = true
      this.tutorResponse = null
      
      try {
        const { data, error } = await supabase.functions.invoke('tutor-chat', {
          body: { contexto: context, pregunta: question }
        })

        if (error) throw error
        this.tutorResponse = data.text
      } catch (error) {
        console.error('Error asking tutor (Gemma 4):', error)
        this.tutorResponse = 'Lo siento, Gemma 4 tuvo un problema al procesar tu duda. ¿Podrías intentar de nuevo?'
      } finally {
        this.isAskingTutor = false
      }
    },
    async uploadMaterial(file) {
      if (!file) return null
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id || 'anonymous'
        
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${userId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('course-assets')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('course-assets')
          .getPublicUrl(filePath)

        this.newCourseDraft.file = publicUrl
        return publicUrl
      } catch (error) {
        console.error('Error uploading file:', error)
        throw error
      }
    },
    selectCourse(course) {
      this.currentCourse = course
    }
  }
})

      this.currentCourse = course
    }
  }
})
