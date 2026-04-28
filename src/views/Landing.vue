<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  ClipboardList, 
  Zap,
  ShieldCheck,
  Menu as MenuIcon,
  X as XIcon,
  Cpu,
  Activity,
  Globe
} from 'lucide-vue-next'

const router = useRouter()
const isMenuOpen = ref(false)
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value

// Neural Network particles
const neurons = ref([])
onMounted(() => {
  for (let i = 0; i < 20; i++) {
    neurons.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#030303] selection:bg-primary/30 overflow-x-hidden w-full font-sans relative text-white">
    
    <!-- Ultra-Premium Neural Background -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Deep Glows -->
      <div class="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[180px] animate-pulse-slow"></div>
      <div class="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px] animate-pulse-slow" style="animation-delay: 3s"></div>
      
      <!-- Interactive Grid -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_100%)]"></div>
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

      <!-- Moving Neurons / Particles -->
      <div v-for="n in neurons" :key="n.id" 
        class="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
        :style="{
          left: n.x + '%',
          top: n.y + '%',
          animation: `float-neuron ${n.duration}s ease-in-out ${n.delay}s infinite alternate`
        }"
      >
        <div class="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div>
      </div>

      <!-- Animated Connections (SVG) -->
      <svg class="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:var(--color-primary);stop-opacity:0" />
            <stop offset="50%" style="stop-color:var(--color-primary);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--color-primary);stop-opacity:0" />
          </linearGradient>
        </defs>
        <path v-for="i in 5" :key="i"
          class="animate-draw-line"
          :d="`M ${Math.random()*100} ${Math.random()*100} Q ${Math.random()*100} ${Math.random()*100} ${Math.random()*100} ${Math.random()*100}`"
          stroke="url(#lineGrad)"
          stroke-width="0.5"
          fill="none"
          :style="{ animationDelay: `${i * 2}s` }"
        />
      </svg>
    </div>

    <!-- Floating Glass Header -->
    <header class="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 animate-fade-in-down">
      <nav class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-6 py-4 md:px-10 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div class="flex items-center gap-4 group cursor-pointer" @click="router.push('/')">
          <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary p-0.5 rounded-2xl transform group-hover:rotate-12 transition-all duration-700 shadow-glow shrink-0">
            <div class="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center overflow-hidden">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-8 h-8 object-contain scale-110 group-hover:scale-125 transition-transform" />
            </div>
          </div>
          <div class="hidden xs:block">
            <span class="text-2xl font-black text-white tracking-tighter uppercase leading-none block">MentorIA</span>
            <p class="text-[8px] font-black text-primary uppercase tracking-[0.4em] mt-1 italic">Neural Intelligence</p>
          </div>
        </div>
        
        <div class="hidden md:flex items-center gap-10">
          <button @click="router.push('/demo')" class="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-primary transition-all relative group">
            Ver Demo
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </button>
          <button @click="router.push('/login')" class="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all">Sincronizar</button>
          <button @click="router.push('/login?signup=true')" class="px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-glow hover:bg-secondary hover:scale-105 transition-all active:scale-95">
            Comenzar Ahora
          </button>
        </div>

        <button @click="toggleMenu" class="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:text-primary transition-all active:scale-90">
          <MenuIcon v-if="!isMenuOpen" class="w-6 h-6" />
          <XIcon v-else class="w-6 h-6" />
        </button>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="container mx-auto px-6 pt-52 pb-32 text-center relative z-10">
      <!-- Neural Badge -->
      <div class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 mb-12 animate-fade-in shadow-inner">
        <Activity class="w-4 h-4 text-primary animate-pulse" />
        <span class="text-[10px] font-black uppercase tracking-[0.4em]">Red Neuronal v4.0 Online</span>
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
      </div>
      
      <div class="max-w-6xl mx-auto space-y-12 mb-24">
        <h1 class="text-5xl md:text-8xl lg:text-[10rem] font-black text-white tracking-[ -0.05em] leading-[0.8] animate-fade-in-up">
          LA IA QUE <br />
          <span class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent italic">ENTIENDE</span> <br />
          TU AULA
        </h1>
        
        <p class="text-xl md:text-3xl text-white/40 max-w-3xl mx-auto font-medium animate-fade-in-up animation-delay-300 leading-tight italic">
          MentorIA fusiona el instinto docente con el poder de redes neuronales profundas para crear educación de impacto.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-center gap-8 mb-32 animate-fade-in-up animation-delay-600">
        <button @click="router.push('/login')" class="px-12 py-7 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_50px_-10px_rgba(var(--color-primary-rgb),0.6)] hover:bg-secondary hover:scale-110 hover:-rotate-1 transition-all active:scale-95 group relative overflow-hidden">
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
          <span class="relative z-10 flex items-center justify-center gap-4">
            Empezar Experiencia <ArrowRight class="w-6 h-6 group-hover:translate-x-3 transition-transform" />
          </span>
        </button>
        <button @click="router.push('/demo')" class="px-12 py-7 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
          Ver Demo Interactiva <Activity class="w-5 h-5 text-primary" />
        </button>
      </div>

      <!-- Innovation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto mt-20">
        <div 
          v-for="(feat, idx) in [
            { t: 'Sinapsis Veloz', d: 'Generación instantánea de lecciones y talleres bajo demanda.', i: Zap },
            { t: 'Memoria Cuántica', d: 'Tu historial pedagógico siempre listo y sincronizado en la nube.', i: ClipboardList },
            { t: 'Visión Pedagógica', d: 'Análisis profundo de documentos con modelos de visión IA.', i: BrainCircuit }
          ]" 
          :key="idx"
          class="premium-card group animate-fade-in-up"
          :style="{ animationDelay: `${900 + idx * 200}ms` }"
        >
          <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 mx-auto md:mx-0 group-hover:bg-primary/20 transition-all border border-white/10 shadow-inner overflow-hidden relative">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <component :is="feat.i" class="text-white group-hover:text-primary w-8 h-8 relative z-10 transition-transform group-hover:scale-125" />
          </div>
          <h3 class="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic md:text-left">{{ feat.t }}</h3>
          <p class="text-lg text-white/40 font-medium leading-tight md:text-left">{{ feat.d }}</p>
          
          <!-- Decorative line -->
          <div class="w-0 h-1 bg-primary mt-8 group-hover:w-20 transition-all duration-700"></div>
        </div>
      </div>
    </main>

    <!-- Mobile Menu Overlay -->
    <Transition name="premium-pop">
      <div v-if="isMenuOpen" 
        class="fixed inset-0 bg-[#030303]/98 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-10 space-y-12 overflow-hidden"
      >
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div class="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/20 rounded-full blur-[200px]"></div>
          <div class="absolute -bottom-1/4 -right-1/4 w-full h-full bg-secondary/20 rounded-full blur-[200px]"></div>
        </div>

        <div class="flex flex-col items-center gap-8 text-center relative z-10">
          <div class="w-24 h-24 bg-gradient-to-br from-primary to-secondary p-0.5 rounded-[2.5rem] shadow-glow">
            <div class="w-full h-full rounded-[2.3rem] bg-[#050505] flex items-center justify-center">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-14 h-14 object-contain" />
            </div>
          </div>
          <h2 class="text-5xl font-black text-white tracking-tighter uppercase leading-none">MentorIA</h2>
          <p class="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">Intelligence Suite</p>
        </div>

        <div class="w-full max-w-sm space-y-6 relative z-10">
           <button @click="router.push('/demo'); isMenuOpen = false" class="w-full py-8 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4">
              <Play class="w-5 h-5 text-primary" /> Ver Demo
           </button>
           <button @click="router.push('/login'); isMenuOpen = false" class="w-full py-8 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Sincronizar Panel
           </button>
           <button @click="router.push('/login?signup=true'); isMenuOpen = false" class="w-full py-8 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-glow hover:bg-secondary transition-all">
              Crear Cuenta
           </button>
        </div>

        <button @click="isMenuOpen = false" class="text-white/20 uppercase font-black text-[9px] tracking-[0.5em] hover:text-white transition-colors relative z-10 mt-12">
          Cerrar Sistema
        </button>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-32 bg-black relative z-20 overflow-hidden">
      <div class="container mx-auto px-6 text-center space-y-12">
        <div class="flex items-center justify-center gap-6 mb-8">
           <div class="w-2 h-2 rounded-full bg-primary animate-ping"></div>
           <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.8em]">Ecosistema MentorIA 2026</p>
        </div>
        <h4 class="text-4xl md:text-6xl font-black text-white/10 tracking-tighter italic uppercase">La Inteligencia al Servicio de la Vocación</h4>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite alternate;
}

@keyframes pulse-slow {
  from { opacity: 0.3; transform: scale(1); }
  to { opacity: 0.6; transform: scale(1.1); }
}

@keyframes float-neuron {
  from { transform: translate(0, 0); opacity: 0.2; }
  to { transform: translate(20px, 20px); opacity: 1; }
}

@keyframes draw-line {
  0% { stroke-dasharray: 0 1000; opacity: 0; }
  50% { opacity: 1; }
  100% { stroke-dasharray: 1000 0; opacity: 0; }
}

.animate-draw-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 8s ease-in-out infinite;
}

.animate-fade-in { animation: fadeIn 1.5s ease-out forwards; }
.animate-fade-in-up { 
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}
.animate-fade-in-down { 
  opacity: 0;
  animation: fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(60px); filter: blur(20px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.premium-card {
  background-color: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 4rem;
  padding: 4rem;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.premium-card:hover {
  border-color: rgba(var(--color-primary-rgb), 0.4);
  transform: translateY(-20px) scale(1.02);
  background-color: rgba(255, 255, 255, 0.04);
}

.shadow-glow {
  box-shadow: 0 0 50px -10px var(--color-primary-glow);
}

.premium-pop-enter-active,
.premium-pop-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-pop-enter-from,
.premium-pop-leave-to {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(20px);
}
</style>

