import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [
      { id: 1, name: 'Matemáticas', grade: '6º Grado', progress: 70, color: 'from-blue-500 to-primary', classes: 24 },
      { id: 2, name: 'Ciencias Naturales', grade: '8º Grado', progress: 45, color: 'from-secondary to-green-500', classes: 18 },
      { id: 3, name: 'Historia Universal', grade: '10º Grado', progress: 90, color: 'from-orange-500 to-red-500', classes: 32 },
    ],
    currentCourse: null,
    lessons: [],
    isGenerating: false,
    newCourseDraft: {
      name: '',
      grade: '',
      objectives: '',
      file: null
    }
  }),
  actions: {
    setNewCourseDraft(data) {
      this.newCourseDraft = { ...this.newCourseDraft, ...data }
    },
    async createCourseFromDraft() {
      const newCourse = {
        id: Date.now(),
        name: this.newCourseDraft.name,
        grade: this.newCourseDraft.grade,
        progress: 0,
        color: 'from-purple-500 to-indigo-500',
        classes: 0
      }
      this.courses.unshift(newCourse)
      this.currentCourse = newCourse
      return newCourse
    },
    async generateLessonsForCurrentCourse(prompt) {
      this.isGenerating = true
      // Simulate AI Generation delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedLessons = [
        { id: 1, title: `Introducción a ${this.currentCourse?.name || 'la materia'}`, status: 'ready', type: 'Teoría', content: [] },
        { id: 2, title: 'Conceptos fundamentales', status: 'ready', type: 'Práctica', content: [] },
        { id: 3, title: 'Ejercicios aplicados', status: 'ready', type: 'Interactivo', content: [] },
      ]
      
      this.lessons = generatedLessons
      if (this.currentCourse) {
        this.currentCourse.classes = generatedLessons.length
      }
      this.isGenerating = false
    },
    selectCourse(course) {
      this.currentCourse = course
    }
  }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false
  }),
  actions: {
    async initAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user || null
      
      supabase.auth.onAuthStateChange((_, session) => {
        this.user = session?.user || null
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
