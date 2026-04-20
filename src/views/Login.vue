<script setup>
import { 
  BrainCircuit, 
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
  Star,
  ChevronRight,
  Fingerprint
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
      <div class="relative z-10 flex items-center gap-4 group cursor-pointer animate-fade-in-down" @click="router.push('/')">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow transform group-hover:rotate-12 transition-all duration-700">
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-10 h-10 object-contain" />
        </div>
        <div>
          <h2 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">MentorIA</h2>
          <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1">Intelligence Suite v2.5</p>
        </div>
      </div>

      <!-- Center Vibe -->
      <div class="relative z-10 space-y-8 animate-slide-right">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
            <Sparkles class="w-4 h-4 text-primary animate-pulse" />
            <span class="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">Motor Neuronal Activo</span>
          </div>
          <h1 class="text-6xl font-black text-white leading-[0.9] tracking-tighter">
            Trascendiendo la <br />
            <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">educación convencional</span>
          </h1>
          <p class="text-xl text-white/70 font-bold max-w-md leading-relaxed">
            Diseñamos el futuro del aprendizaje interactivo. Accede a herramientas pedagógicas impulsadas por neuronas digitales.
          </p>
        </div>

        <!-- Metrics -->
        <div class="grid grid-cols-2 gap-8 pt-10">
          <div class="space-y-2 group">
            <p class="text-4xl font-black text-white group-hover:text-primary transition-colors tracking-tighter">12k+</p>
            <p class="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Sesiones Diarias</p>
          </div>
          <div class="space-y-2 group">
            <p class="text-4xl font-black text-white group-hover:text-secondary transition-colors tracking-tighter">99.9%</p>
            <p class="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Precisión IA</p>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white/60">
          <ShieldCheck class="w-4 h-4" />
          <p class="text-[9px] font-black uppercase tracking-widest">Protocolo de Cifrado v4.2</p>
        </div>
        <div class="flex gap-2">
          <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 rounded-full bg-white/10"></div>
        </div>
      </div>
    </section>

    <!-- FORM SECTION -->
    <main class="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-24 relative z-30">
      <!-- Mobile Only Header -->
      <div class="lg:hidden flex flex-col items-center mb-12 animate-fade-in-down">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 shadow-glow">
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-12 h-12 object-contain" />
        </div>
        <h2 class="text-4xl font-black text-white tracking-tighter uppercase mb-1">MentorIA</h2>
        <span class="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Intelligence Suite v2.5</span>
      </div>

      <div class="w-full max-w-[440px]">
        <!-- Auth Card -->
        <div class="bg-transparent space-y-12">
          <header class="text-center lg:text-left animate-fade-in-up">
             <div class="flex items-center justify-center lg:justify-start gap-4 mb-4">
               <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 shadow-glow', isSignup ? 'bg-secondary' : 'bg-primary']">
                 <Fingerprint v-if="isSignup" class="w-6 h-6 text-white" />
                 <LogIn v-else class="w-6 h-6 text-white" />
               </div>
               <h2 class="text-4xl font-black text-white tracking-tighter">{{ isSignup ? 'Comenzar' : 'Entrar' }}</h2>
             </div>
             <p class="text-white/70 font-bold text-lg leading-tight lg:pr-10">
               {{ isSignup ? 'Únete a la red neuronal de docentes más innovadora de Colombia.' : 'Bienvenido de nuevo al ecosistema pedagógico inteligente.' }}
             </p>
          </header>

          <footer class="animate-fade-in-up animation-delay-200">
            <button 
              type="button" 
              @click="handleGoogleLogin"
              class="w-full py-5 bg-white text-bg-deep rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-premium group border-0"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google Workspace
            </button>

            <div class="relative flex items-center py-10">
              <div class="flex-grow border-t border-white/5"></div>
              <span class="flex-shrink mx-6 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">O usa tus credenciales</span>
              <div class="flex-grow border-t border-white/5"></div>
            </div>
          </footer>

          <div v-if="errorMsg" class="p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-2xl text-center animate-shake">
            {{ errorMsg }}
          </div>

          <form @submit.prevent="handleAuth" class="space-y-6 animate-fade-in-up animation-delay-400">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-1">Ecosistema Email</label>
              <div class="relative group">
                <Mail class="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors duration-500" :size="20" />
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="profesor@ejemplo.edu"
                  class="input-field w-full pl-14 h-16 text-[15px] font-bold placeholder:text-white/40 bg-white/2 border-white/5 focus:border-primary/50 focus:bg-white/5 transition-all duration-500 rounded-2xl outline-none"
                  required
                />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-1">Clave de Acceso</label>
              <div class="relative group">
                <Lock class="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors duration-500" :size="20" />
                <input 
                  v-model="password"
                  type="password" 
                  placeholder="••••••••••••"
                  class="input-field w-full pl-14 h-16 text-[15px] font-bold placeholder:text-white/40 bg-white/2 border-white/5 focus:border-primary/50 focus:bg-white/5 transition-all duration-500 rounded-2xl outline-none"
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
          </form>

          <footer class="text-center animate-fade-in-up animation-delay-600">
            <p class="mb-4">
              <span class="text-white/60 text-[11px] font-bold uppercase tracking-widest">{{ isSignup ? '¿Ya posees una suscripción?' : '¿Nuevo en el ecosistema?' }}</span>
              <button @click="toggleMode" class="ml-2 text-primary font-black uppercase text-[11px] tracking-widest hover:text-white transition-colors">
                {{ isSignup ? 'Sincronizar aquí' : 'Generar Acceso' }}
              </button>
            </p>
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
  background-color: #08080C;
}

.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-600 { animation-delay: 0.6s; }

/* Animations */
.animate-slide-right {
  opacity: 0;
  animation: slideRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.animate-fade-in-down {
  opacity: 0;
  animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); filter: blur(10px); }
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
