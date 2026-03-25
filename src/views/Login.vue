import { BrainCircuit, Chrome, Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
  router.push('/')
}

const handleGoogleLogin = async () => {
  try {
    await authStore.signInWithGoogle()
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error)
  }
}

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6C63FF] via-[#8B8DFF] to-[#00C9A7] p-4 font-sans">
    <div class="max-w-md w-full glass p-8 rounded-[2rem] shadow-premium animate-fade-in">
      <div class="flex flex-col items-center mb-10">
        <div class="p-3 bg-white rounded-2xl shadow-soft mb-4">
          <BrainCircuit class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-3xl font-bold text-dark mb-2 tracking-tight">MentorIA</h1>
        <p class="text-gray-500 font-medium">Aprende. Enseña. Evoluciona.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-semibold text-dark mb-2 ml-1">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="ejemplo@escuela.com"
            class="w-full px-5 py-4 bg-gray-50/50 border-0 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300 outline-none placeholder:text-gray-400"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-dark mb-2 ml-1">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
            class="w-full px-5 py-4 bg-gray-50/50 border-0 rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300 outline-none placeholder:text-gray-400"
            required
          />
        </div>

        <button 
          type="submit" 
          :disabled="authStore.isLoading"
          class="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <Loader2 v-if="authStore.isLoading" class="w-6 h-6 animate-spin" />
          {{ authStore.isLoading ? 'Entrando...' : 'Entrar al aula' }}
        </button>

        <div class="relative flex items-center py-2">
          <div class="flex-grow border-t border-gray-200"></div>
          <span class="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">O también</span>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          type="button" 
          @click="handleGoogleLogin"
          class="w-full py-4 bg-white border border-gray-100 text-dark rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-soft hover:bg-gray-50 transition-all duration-300 active:scale-95"
        >
          <Chrome class="w-5 h-5" />
          Ingresar con Google
        </button>
      </form>
      
      <p class="mt-8 text-center text-sm text-gray-500 font-medium">
        ¿Eres un tutor nuevo? <a href="#" class="text-primary font-bold hover:underline">Comienza aquí</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
