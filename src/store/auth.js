import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const isAuthReady = ref(false)

  const initAuth = async () => {
    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null
    } catch (e) {
      console.error("Auth init error:", e)
    } finally {
      loading.value = false
      isAuthReady.value = true
    }
    
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null
      isAuthReady.value = true
    })
  }

  const login = async (email, password) => {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      loading.value = false
      throw error
    }
    user.value = data.user
    loading.value = false
    return data
  }

  const signup = async (email, password) => {
    loading.value = true
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      loading.value = false
      throw error
    }
    user.value = data.user
    loading.value = false
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })
    if (error) throw error
  }

  return {
    user,
    loading,
    isAuthReady,
    initAuth,
    login,
    signup,
    logout,
    signInWithGoogle
  }
})
