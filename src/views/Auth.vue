<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { BrainCircuit, Mail, Lock, Loader2, Sparkles } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSignup = ref(route.query.signup === 'true')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    if (isSignup.value) {
      await authStore.signup(email.value, password.value)
      alert('Cuenta creada. Revisa tu correo para verificar.')
    } else {
      await authStore.login(email.value, password.value)
      router.push('/app')
    }
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

const toggleMode = () => {
  isSignup.value = !isSignup.value
  errorMsg.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-bg-deep flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-xl shadow-primary/30">
          <BrainCircuit class="text-white" :size="32" />
        </div>
        <h2 class="text-3xl font-extrabold text-white mb-2">
          {{ isSignup ? 'Únete a MentorIA' : 'Bienvenido de nuevo' }}
        </h2>
        <p class="text-text-muted">
          {{ isSignup ? 'Crea una cuenta para empezar a optimizar tus clases.' : 'Ingresa tus credenciales para continuar.' }}
        </p>
      </div>

      <div class="glass-panel p-8 shadow-2xl">
        <form @submit.prevent="handleAuth" class="space-y-6">
          <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
            {{ errorMsg }}
          </div>

          <div>
            <label class="block text-sm font-medium text-text-muted mb-2">Correo electrónico</label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="email"
                type="email" 
                required
                class="input-field w-full pl-12" 
                placeholder="docente@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-text-muted mb-2">Contraseña</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="password"
                type="password" 
                required
                class="input-field w-full pl-12" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full py-4 text-lg">
            <template v-if="loading">
              <Loader2 class="animate-spin" :size="20" /> Procesando...
            </template>
            <template v-else>
              {{ isSignup ? 'Crear cuenta' : 'Iniciar sesión' }}
            </template>
          </button>
        </form>

        <div class="mt-8 pt-8 border-t border-white/5 space-y-4">
          <button @click="authStore.signInWithGoogle" class="btn-outline w-full py-3 flex items-center justify-center gap-3">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" class="w-5 h-5" alt="Google" />
            Continuar con Google
          </button>
          
          <p class="text-center text-text-muted text-sm">
            {{ isSignup ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?' }}
            <button @click="toggleMode" class="text-primary font-bold hover:underline ml-1">
              {{ isSignup ? 'Inicia sesión' : 'Regístrate gratis' }}
            </button>
          </p>
        </div>
      </div>

      <div class="mt-8 flex justify-center items-center gap-2 text-text-muted text-xs">
        <Sparkles class="text-primary/50" :size="14" />
        <span>Gemma 4 Potenciado para Educación</span>
      </div>
    </div>
  </div>
</template>
