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
    selectedModel: 'gemini', // 'gemini' or 'openai'
    lastDiagnosis: null
  }),
  actions: {
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
        // Direct fetch strategy (Nuclear Option)
        // This avoids any SDK-specific header logic that might cause 401s
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        const baseUrl = import.meta.env.VITE_SUPABASE_URL
        const url = `${baseUrl}/functions/v1/generate-lessons`

        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token || anonKey

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': anonKey,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            prompt, 
            model: this.selectedModel,
            grade,
            subject,
            type
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP Error ${response.status}: ${errorText || 'Unauthorized'}`)
        }

        const data = await response.json()

        this.generatedContent = data.text
        
        // Persistir la lección en la base de datos
        if (this.currentCourse) {
          const { data: lessonData, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              course_id: this.currentCourse.id,
              title: type === 'lesson' ? `Lección de ${topic}` : type === 'workshop' ? `Taller de ${topic}` : `Examen de ${topic}`,
              content: data.text,
              status: 'draft'
            })
            .select()
            .single()

          if (lessonError) throw lessonError
          
          this.lessons = [lessonData]
          
          // Actualizar contador de clases en el curso
          await supabase
            .from('courses')
            .update({ classes_count: (this.currentCourse.classes_count || 0) + 1 })
            .eq('id', this.currentCourse.id)
        }
      } catch (error) {
        console.error('Error generating content:', error)
        this.generationError = error.message || 'Error desconocido'
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
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        const baseUrl = import.meta.env.VITE_SUPABASE_URL
        const url = `${baseUrl}/functions/v1/tutor-chat`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': anonKey
          },
          body: JSON.stringify({ 
            contexto: context, 
            pregunta: question, 
            model: this.selectedModel 
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error del tutor: ${errorText}`)
        }

        const data = await response.json()
        this.tutorResponse = data.text
      } catch (error) {
        console.error('Error asking tutor:', error)
        this.tutorResponse = 'Lo siento, tuve un problema al procesar tu duda. ¿Podrías intentar de nuevo?'
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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    isAuthReady: false
  }),
  actions: {
    async initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        this.user = session?.user || null
      } catch (e) {
        console.error("Auth init error:", e)
      } finally {
        this.isAuthReady = true
      }
      
      supabase.auth.onAuthStateChange((_, session) => {
        this.user = session?.user || null
        this.isAuthReady = true
      })
    },
    async login(email, password) {
      this.isLoading = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      this.user = data.user
      this.isLoading = false
    },
    async signInWithGoogle() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
