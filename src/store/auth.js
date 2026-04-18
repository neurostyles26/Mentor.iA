import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  const displayName = computed(() => {
    if (!user.value) return 'Invitado'
    
    // 1. Try metadata (from Google or Manual Signup)
    const meta = user.value.user_metadata
    if (meta?.full_name) return meta.full_name
    if (meta?.display_name) return meta.display_name
    if (meta?.name) return meta.name
    
    // 2. Fallback to parsing email (e.g., pepito.peres@gmail.com -> Pepito Peres)
    const email = user.value.email
    if (email) {
      const namePart = email.split('@')[0]
      return namePart
        .split(/[._-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    
    return 'Usuario MentorIA'
  })

  return {
    user,
    displayName,
    loading,
    isAuthReady,
    initAuth,
    login,
    signup,
    logout,
    signInWithGoogle
  }
})
