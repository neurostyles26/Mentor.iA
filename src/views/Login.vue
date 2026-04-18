<script setup>
import { 
  BrainCircuit, 
  Chrome, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const isSignup = ref(false)
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleAuth = async () => {
  errorMsg.value = ''
  try {
    if (isSignup.value) {
      await authStore.signup(email.value, password.value)
      alert("Cuenta creada. Revisa tu correo para verificar.")
    } else {
      await authStore.login(email.value, password.value)
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Auth error:', error)
    errorMsg.value = error.message === 'Invalid login credentials' 
      ? 'Credenciales incorrectas. Verifica tu correo y contraseña.' 
      : error.message
  }
}

const handleGoogleLogin = async () => {
  try {
    errorMsg.value = ''
    await authStore.signInWithGoogle()
  } catch (error) {
    console.error('Google login error:', error)
    errorMsg.value = 'Error al conectar con Google. Inténtalo de nuevo.'
  }
}

const toggleMode = () => {
  isSignup.value = !isSignup.value
  errorMsg.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-bg-deep p-6 font-sans relative overflow-hidden selection:bg-primary/30">
    <!-- Animated Neural Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
      
      <!-- Grid Overlay -->
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <!-- Logo Section -->
      <div class="flex flex-col items-center mb-8 animate-fade-in-down">
        <div class="relative group">
          <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700"></div>
          <div class="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-glow">
            <BrainCircuit class="w-9 h-9 text-primary" />
          </div>
        </div>
        <h1 class="text-4xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-sm">MentorIA</h1>
        <div class="flex items-center gap-2 px-3 py-0.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
          <Sparkles class="w-3 h-3 text-primary animate-pulse" />
          <span class="text-[9px] font-black text-primary/80 uppercase tracking-[0.3em]">AI-Powered Education</span>
        </div>
      </div>

      <!-- Main Card -->
      <div class="glass-panel p-1 rounded-[2.5rem] shadow-2xl relative group overflow-hidden animate-fade-in">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        <div class="p-8 md:p-10 bg-bg-card/40 backdrop-blur-3xl rounded-[2.4rem]">
          <div class="mb-8 overflow-hidden">
            <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <LogIn v-if="!isSignup" class="w-5 h-5 text-primary" />
              <UserPlus v-else class="w-5 h-5 text-secondary" />
              {{ isSignup ? 'Crear Cuenta' : 'Bienvenido' }}
            </h2>
            <p class="text-text-muted text-sm font-medium">
              {{ isSignup ? 'Únete a la revolución educativa con IA.' : 'Accede a tus cursos y herramientas de IA.' }}
            </p>
          </div>

          <div v-if="errorMsg" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center font-bold animate-shake">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleAuth" class="space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
              <div class="relative group">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="18" />
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="profesor@ejemplo.edu"
                  class="input-field w-full pl-12 h-14"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Contraseña</label>
              <div class="relative group">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="18" />
                <input 
                  v-model="password"
                  type="password" 
                  placeholder="••••••••"
                  class="input-field w-full pl-12 h-14"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="w-full py-4 px-6 bg-primary text-white rounded-2xl font-black text-lg shadow-glow hover:bg-secondary hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <template v-if="authStore.loading">
                <Loader2 class="w-6 h-6 animate-spin" />
                <span>Procesando...</span>
              </template>
              <template v-else>
                <span>{{ isSignup ? 'Registrarme' : 'Entrar' }}</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>

            <div class="relative flex items-center py-4">
              <div class="flex-grow border-t border-white/5"></div>
              <span class="flex-shrink mx-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">O continúa con</span>
              <div class="flex-grow border-t border-white/5"></div>
            </div>

            <button 
              type="button" 
              @click="handleGoogleLogin"
              class="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-95 group"
            >
              <div class="w-6 h-6 bg-white rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
                <Chrome class="text-bg-deep" :size="16" />
              </div>
              Google Workspace
            </button>
          </form>

          <div class="mt-8 text-center text-sm font-medium">
            <span class="text-text-muted">{{ isSignup ? '¿Ya tienes cuenta?' : '¿Eres nuevo aquí?' }}</span>
            <button @click="toggleMode" class="ml-2 text-primary font-bold hover:underline">
              {{ isSignup ? 'Inicia sesión' : 'Regístrate gratis' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer Info -->
      <div class="mt-10 flex flex-col items-center gap-4 animate-fade-in animation-delay-1000">
        <div class="flex items-center gap-3 text-white/40">
          <ShieldCheck class="w-4 h-4" />
          <p class="text-[10px] uppercase font-black tracking-widest">Protocolo Seguro v4.2</p>
        </div>
        <div class="flex gap-4">
          <div class="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-accent/40"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.bg-grid-white\/\[0\.02\] {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }
.animation-delay-1000 { animation-delay: 1s; }

.animate-fade-in { animation: fadeIn 1s ease-out; }
.animate-fade-in-down { animation: fadeInDown 0.8s ease-out; }
.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
