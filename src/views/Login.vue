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
  LogIn,
  Zap,
  Cpu,
  Star
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { ref, onMounted } from 'vue'

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
  <div class="min-h-screen flex bg-bg-deep font-sans overflow-hidden selection:bg-primary/30">
    <!-- IMERSIVE LEFT SECTION (Desktop Only) -->
    <section class="hidden lg:flex flex-col justify-between w-[45%] bg-bg-card p-16 relative overflow-hidden border-r border-white/5 shadow-2xl z-20">
      <!-- Background Effects -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div class="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[150px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <!-- Top Brand -->
      <div class="relative z-10 flex items-center gap-4 group cursor-pointer" @click="router.push('/')">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow transform group-hover:rotate-12 transition-all duration-700">
          <BrainCircuit class="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">MentorIA</h2>
          <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1">Intelligence Suite v2.5</p>
        </div>
      </div>

      <!-- Center Vibe -->
      <div class="relative z-10 space-y-8 animate-slide-right">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Sparkles class="w-4 h-4 text-emerald-400" />
            <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Quantum Learning Engine</span>
          </div>
          <h1 class="text-6xl font-black text-white leading-none tracking-tighter">
            Trascendiendo la <br />
            <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">educación convencional</span>
          </h1>
          <p class="text-xl text-white/40 font-bold max-w-md leading-relaxed">
            Diseñamos el futuro del aprendizaje interactivo. Accede a herramientas pedagógicas impulsadas por neuronas digitales.
          </p>
        </div>

        <!-- Metrics -->
        <div class="grid grid-cols-2 gap-8 pt-10">
          <div class="space-y-2 group">
            <p class="text-4xl font-black text-white group-hover:text-primary transition-colors tracking-tighter">12k+</p>
            <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Sesiones Diarias</p>
          </div>
          <div class="space-y-2 group">
            <p class="text-4xl font-black text-white group-hover:text-secondary transition-colors tracking-tighter">99.9%</p>
            <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Precisión IA</p>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white/30">
          <ShieldCheck class="w-4 h-4" />
          <p class="text-[9px] font-black uppercase tracking-widest">Protocolo de Cifrado v4.2</p>
        </div>
        <div class="flex gap-2">
          <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-white/10"></div>
        </div>
      </div>
    </section>

    <!-- FORM SECTION -->
    <main class="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative z-30">
      <!-- Mobile Only Header -->
      <div class="lg:hidden flex flex-col items-center mb-12 animate-fade-in">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 shadow-glow">
          <BrainCircuit class="w-10 h-10 text-primary" />
        </div>
        <h2 class="text-4xl font-black text-white tracking-tighter uppercase mb-1">MentorIA</h2>
        <span class="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Intelligence Suite v2.5</span>
      </div>

      <div class="w-full max-w-[440px] animate-fade-in-up">
        <!-- Auth Card -->
        <div class="bg-transparent">
          <header class="mb-10 text-center lg:text-left transition-all duration-500">
             <div class="flex items-center justify-center lg:justify-start gap-4 mb-4">
               <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-glow', isSignup ? 'bg-secondary' : 'bg-primary']">
                 <UserPlus v-if="isSignup" class="w-6 h-6 text-white" />
                 <LogIn v-else class="w-6 h-6 text-white" />
               </div>
               <h2 class="text-4xl font-black text-white tracking-tighter">{{ isSignup ? 'Comenzar' : 'Entrar' }}</h2>
             </div>
             <p class="text-white/40 font-bold text-lg leading-tight lg:pr-10">
               {{ isSignup ? 'Únete a la red neuronal de docentes más innovadora de Colombia.' : 'Bienvenido de nuevo al ecosistema pedagógico inteligente.' }}
             </p>
          </header>

          <div v-if="errorMsg" class="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-2xl text-center animate-shake">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleAuth" class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Ecosistema Email</label>
              <div class="relative group">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors duration-500" :size="20" />
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="profesor@ejemplo.edu"
                  class="input-field w-full pl-14 h-16 text-[15px] font-bold placeholder:text-white/10 bg-white/2 border-white/5 focus:border-primary/50 focus:bg-white/5 transition-all duration-500"
                  required
                />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Clave de Acceso</label>
              <div class="relative group">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors duration-500" :size="20" />
                <input 
                  v-model="password"
                  type="password" 
                  placeholder="••••••••••••"
                  class="input-field w-full pl-14 h-16 text-[15px] font-bold placeholder:text-white/10 bg-white/2 border-white/5 focus:border-primary/50 focus:bg-white/5 transition-all duration-500"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="authStore.loading"
              class="w-full py-6 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:bg-secondary hover:-translate-y-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 relative overflow-hidden group flex items-center justify-center gap-4"
            >
              <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              <template v-if="authStore.loading">
                <Loader2 class="w-5 h-5 animate-spin" />
                <span>Transmitiendo...</span>
              </template>
              <template v-else>
                <span>{{ isSignup ? 'Registrar Cuenta' : 'Sincronizar Panel' }}</span>
                <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </template>
            </button>

            <div class="relative flex items-center py-6">
              <div class="flex-grow border-t border-white/5"></div>
              <span class="flex-shrink mx-6 text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">Puerta de Enlace</span>
              <div class="flex-grow border-t border-white/5"></div>
            </div>

            <button 
              type="button" 
              @click="handleGoogleLogin"
              class="w-full py-5 bg-white/2 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-white/5 hover:border-white/20 transition-all active:scale-95 group"
            >
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-glow">
                <Chrome class="text-bg-deep" :size="20" />
              </div>
              Google Workspace
            </button>
          </form>

          <footer class="mt-12 text-center transition-all duration-700">
            <span class="text-white/30 text-[11px] font-bold uppercase tracking-widest">{{ isSignup ? '¿Ya posees una suscripción?' : '¿Nuevo en el ecosistema?' }}</span>
            <button @click="toggleMode" class="ml-2 text-primary font-black uppercase text-[11px] tracking-widest hover:text-secondary hover:underline underline-offset-8 transition-colors">
              {{ isSignup ? 'Sincronizar aquí' : 'Generar Acceso' }}
            </button>
          </footer>
        </div>
      </div>
    </main>

    <!-- Global Floating Background Elements -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[10%] right-[10%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-blob"></div>
      <div class="absolute bottom-[20%] left-[20%] w-80 h-80 bg-secondary/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.bg-bg-card {
  background-color: #0B0B0F;
}

.input-field {
  outline: none;
}

/* Animations */
.animate-slide-right {
  animation: slideRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

.animation-delay-2000 { animation-delay: 2s; }

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
</style>
