<script setup>
import { BrainCircuit, Chrome, Loader2, Sparkles, ShieldCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleGoogleLogin = async () => {
  try {
    await authStore.signInWithGoogle()
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-6 font-sans relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute top-0 -left-64 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-0 -right-64 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>

    <div class="max-w-md w-full relative z-10 animate-slide-up">
      <!-- Logo & Welcome -->
      <div class="flex flex-col items-center mb-12">
        <div class="w-20 h-20 bg-white rounded-[2rem] shadow-premium flex items-center justify-center mb-6 border border-gray-50 transform hover:rotate-12 transition-transform duration-500">
          <BrainCircuit class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-4xl font-black text-dark tracking-tighter mb-2">MentorIA</h1>
        <div class="flex items-center gap-2 px-4 py-1 bg-primary/5 rounded-full">
          <Sparkles class="w-3 h-3 text-primary" />
          <span class="text-[10px] font-black text-primary uppercase tracking-[0.2em]">SaaS Educativo v1.0</span>
        </div>
      </div>

      <!-- Login Card -->
      <div class="glass p-10 rounded-[3rem] shadow-premium border border-white relative group">
        <div class="absolute -top-4 -right-4 bg-secondary text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-soft translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Acceso Docente
        </div>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Institucional</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="profesor@ejemplo.edu"
              class="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all duration-300 outline-none font-bold placeholder:text-gray-300 shadow-inner"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="••••••••"
              class="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:border-primary focus:bg-white transition-all duration-300 outline-none font-bold placeholder:text-gray-300 shadow-inner"
              required
            />
          </div>

          <button 
            type="submit" 
            :disabled="authStore.isLoading"
            class="w-full py-5 bg-dark text-white rounded-[1.5rem] font-black text-lg shadow-premium hover:bg-primary hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Loader2 v-if="authStore.isLoading" class="w-6 h-6 animate-spin" />
            {{ authStore.isLoading ? 'Autenticando...' : 'Entrar al Campus' }}
          </button>

          <div class="relative flex items-center py-4">
            <div class="flex-grow border-t border-gray-100"></div>
            <span class="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">O continúa con</span>
            <div class="flex-grow border-t border-gray-100"></div>
          </div>

          <button 
            type="button" 
            @click="handleGoogleLogin"
            class="w-full py-5 bg-white border-2 border-gray-50 text-dark rounded-[1.5rem] font-bold flex items-center justify-center gap-4 shadow-soft hover:bg-gray-50 transition-all active:scale-95"
          >
            <Chrome class="w-6 h-6" />
            Google Workspace
          </button>
        </form>
      </div>
      
      <div class="mt-12 flex items-center justify-center gap-3 text-gray-400">
        <ShieldCheck class="w-5 h-5" />
        <p class="text-xs font-bold uppercase tracking-widest">Conexión Segura vía Supabase</p>
      </div>
    </div>
  </div>
</template>
