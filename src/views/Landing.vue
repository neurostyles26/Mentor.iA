<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  ClipboardList, 
  Zap,
  Activity,
  Cpu,
  ShieldCheck,
  Menu as MenuIcon,
  X as XIcon,
  ChevronRight,
  Globe,
  Users
} from 'lucide-vue-next'

const router = useRouter()
const isMenuOpen = ref(false)
const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value

const neurons = ref([])
const connections = ref([])

onMounted(() => {
  // Create Neurons with sparkle properties
  for (let i = 0; i < 40; i++) {
    neurons.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 5
    })
  }
  
  // Create Synapse Connections that will pulse
  for (let i = 0; i < 15; i++) {
    connections.value.push({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 3 + Math.random() * 4
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#010101] selection:bg-primary/30 overflow-hidden w-full font-sans relative text-white h-screen">
    
    <!-- Cinematic Neural Background (Active Synapse) -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[200px] animate-pulse"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary/5 rounded-full blur-[180px]" style="animation-delay: 2s"></div>
      
      <!-- Moving & Sparkling Neurons -->
      <div v-for="n in neurons" :key="`n-${n.id}`" 
        class="absolute bg-white/40 rounded-full animate-sparkle"
        :style="{
          width: n.size + 'px',
          height: n.size + 'px',
          left: n.x + '%',
          top: n.y + '%',
          animationDelay: n.delay + 's',
          animationDuration: n.duration + 's'
        }"
      ></div>

      <!-- Neural Connections (SVG Synapses) -->
      <svg class="absolute inset-0 w-full h-full opacity-30">
        <line v-for="c in connections" :key="`c-${c.id}`"
          :x1="c.x1 + '%'" :y1="c.y1 + '%'"
          :x2="c.x2 + '%'" :y2="c.y2 + '%'"
          stroke="currentColor"
          class="text-primary/40 animate-synapse"
          stroke-width="0.5"
          :style="{
            animationDelay: c.delay + 's',
            animationDuration: c.duration + 's'
          }"
        />
      </svg>
    </div>

    <!-- Premium Floating Header -->
    <header class="fixed top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50">
      <nav class="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] px-8 py-4 flex justify-between items-center ring-1 ring-white/5 shadow-2xl">
        <div class="flex items-center gap-5 group cursor-pointer relative" @click="router.push('/')">
          <!-- Neon Halo Effect -->
          <div class="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <!-- Holographic Icon Container -->
          <div class="w-12 h-12 relative shrink-0">
             <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20"></div>
             <div class="relative w-full h-full bg-black/40 border border-white/10 rounded-2xl p-1 shadow-premium group-hover:border-primary/50 transition-all duration-500 flex items-center justify-center overflow-hidden backdrop-blur-md">
                <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-9 h-9 object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
          </div>
          <div class="hidden xs:flex flex-col">
            <span class="text-lg font-bold text-white tracking-[0.2em] uppercase block leading-none">MentorIA</span>
            <div class="flex items-center gap-2 mt-1">
               <span class="text-[6px] font-black text-primary uppercase tracking-[0.4em]">Neural Suite</span>
               <div class="w-1 h-1 bg-white/20 rounded-full"></div>
               <span class="text-[5px] font-bold text-white/40 uppercase tracking-widest">© 2026 Dev. Edisson Pinza</span>
            </div>
          </div>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <button @click="router.push('/login')" class="px-6 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-[8px] font-bold uppercase tracking-[0.4em] text-white/50 hover:text-white hover:border-primary/50 transition-all shadow-inner">
            Portal Docente
          </button>
          <button @click="router.push('/login?signup=true')" class="px-10 py-3 bg-white text-black rounded-full font-black text-[8px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-glow">
            Comenzar
          </button>
        </div>
      </nav>
    </header>

    <!-- Main Hero Container -->
    <main class="relative z-10 h-screen w-full flex flex-col justify-center items-center px-4 md:px-10 overflow-hidden">
      
      <!-- Neural Brain (Absolute Background) -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
         <img 
           src="/neural-brain.png" 
           alt="Neural Core" 
           class="w-full max-w-lg h-auto animate-float-slow mix-blend-screen grayscale contrast-125"
         />
      </div>

      <!-- Headline & Subheadline Group -->
      <div class="text-center relative z-10 space-y-10 max-w-6xl">
        <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 mb-2 animate-fade-in mx-auto backdrop-blur-sm">
          <Activity class="w-3.5 h-3.5 text-primary animate-pulse" />
          <span class="text-[8px] font-bold uppercase tracking-[0.8em]">Neural Network v2.0 Online</span>
        </div>

        <div class="space-y-4">
          <h2 class="text-sm md:text-base font-light tracking-[1.2em] text-primary/60 uppercase animate-fade-in-up">Inovación Educativa</h2>
          <h1 class="text-5xl md:text-7xl lg:text-[6.5rem] font-extralight tracking-[-0.04em] leading-[0.95] animate-fade-in-up uppercase text-white">
            LA IA QUE <br />
            <span class="font-black italic bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent px-6 animate-gradient-text bg-[length:200%_auto] drop-shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              ENTIENDE
            </span> <br />
            <span class="font-bold tracking-[0.2em] opacity-80 text-4xl md:text-6xl">TU MISIÓN</span>
          </h1>
        </div>

        <div class="relative py-2">
           <div class="absolute inset-0 bg-black/40 blur-2xl rounded-full scale-125"></div>
           <p class="text-base md:text-xl text-white/40 max-w-2xl mx-auto font-medium italic leading-relaxed animate-fade-in-up animation-delay-300 relative z-10">
             "La inteligencia artificial al servicio de la vocación docente."
           </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-8 pt-6 animate-fade-in-up animation-delay-600 relative z-10">
          <button @click="router.push('/login')" class="px-16 py-6 bg-white text-black rounded-full font-bold text-[9px] uppercase tracking-[0.6em] hover:bg-primary hover:text-white transition-all shadow-[0_0_80px_rgba(255,255,255,0.3)] active:scale-95">
            Entrar al Panel
          </button>
          <button @click="router.push('/demo')" class="px-16 py-6 border border-white/20 bg-white/10 backdrop-blur-3xl text-white rounded-full font-bold text-[9px] uppercase tracking-[0.6em] hover:bg-white/20 hover:border-white transition-all active:scale-95 shadow-lg">
            Ver Demo
          </button>
        </div>
      </div>

      <!-- Bottom Features (Ultra Compact) -->
      <div class="absolute bottom-20 left-0 w-full px-10 hidden md:block">
        <div class="flex justify-center gap-16 max-w-7xl mx-auto animate-fade-in-up animation-delay-900">
          <div v-for="(card, i) in [
            { t: 'GENERACIÓN ÉLITE', i: Cpu },
            { t: 'SEGURIDAD TOTAL', i: ShieldCheck },
            { t: 'ANÁLISIS VISIÓN', i: BrainCircuit }
          ]" :key="i" 
          class="group flex items-center gap-4 opacity-70 hover:opacity-100 transition-all duration-700">
            <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]">
               <component :is="card.i" class="w-4 h-4" />
            </div>
            <h3 class="text-[9px] font-black text-white/80 uppercase tracking-[0.4em]">{{ card.t }}</h3>
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Footer -->
    <footer class="fixed bottom-0 left-0 w-full py-4 px-10 border-t border-white/5 bg-black/80 backdrop-blur-3xl z-30 flex justify-between items-center h-14">
       <span class="text-[7px] font-bold text-white/10 uppercase tracking-[0.5em]">MentorIA © 2026</span>
       <div class="flex gap-8">
          <button class="text-[7px] font-bold text-white/10 uppercase tracking-widest hover:text-white transition-colors">Portal</button>
          <button class="text-[7px] font-bold text-white/10 uppercase tracking-widest hover:text-white transition-colors">Legal</button>
       </div>
    </footer>

    <!-- Mobile Menu Overlay (Re-added & Improved) -->
    <Transition name="premium-pop">
      <div v-if="isMenuOpen" 
        class="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-10 space-y-12 overflow-hidden"
      >
        <!-- Background Glows -->
        <div class="absolute inset-0 pointer-events-none opacity-30">
          <div class="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/30 rounded-full blur-[200px]"></div>
          <div class="absolute -bottom-1/4 -right-1/4 w-full h-full bg-secondary/30 rounded-full blur-[200px]"></div>
        </div>

        <!-- Mobile Logo Info -->
        <div class="flex flex-col items-center gap-6 text-center relative z-10">
          <div class="w-20 h-20 bg-gradient-to-br from-primary to-secondary p-0.5 rounded-3xl shadow-glow">
            <div class="w-full h-full rounded-[1.4rem] bg-[#050505] flex items-center justify-center">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-10 h-10 object-contain" />
            </div>
          </div>
          <h2 class="text-4xl font-bold text-white tracking-[0.2em] uppercase leading-none">MentorIA</h2>
          <div class="flex flex-col items-center gap-2">
             <span class="text-[8px] font-black text-primary uppercase tracking-[0.6em]">Neural Suite</span>
             <span class="text-[6px] font-medium text-white/30 uppercase tracking-[0.3em]">© 2026 Dev. Edisson Pinza</span>
          </div>
        </div>

        <!-- Mobile Links -->
        <div class="w-full max-w-xs space-y-5 relative z-10">
           <button @click="router.push('/login'); isMenuOpen = false" class="w-full py-6 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-4">
              Portal Docente
           </button>
           <button @click="router.push('/login?signup=true'); isMenuOpen = false" class="w-full py-6 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest shadow-glow hover:bg-primary hover:text-white transition-all">
              Comenzar Ahora
           </button>
           <button @click="router.push('/demo'); isMenuOpen = false" class="w-full py-6 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              Ver Demo
           </button>
        </div>

        <button @click="isMenuOpen = false" class="text-white/20 uppercase font-bold text-[9px] tracking-[0.6em] hover:text-white transition-colors relative z-10 mt-10">
          Cerrar Menú
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-900 { animation-delay: 0.9s; }

@keyframes sparkle {
  0%, 100% { opacity: 0.1; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.3); filter: blur(1px); }
}

.animate-sparkle {
  animation: sparkle 4s ease-in-out infinite;
}

@keyframes synapse {
  0% { stroke-dasharray: 0 100; opacity: 0; }
  20% { opacity: 0.4; }
  80% { opacity: 0.4; }
  100% { stroke-dasharray: 100 0; opacity: 0; }
}

.animate-synapse {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: synapse 6s linear infinite;
}

@keyframes float-slow {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-40px) rotate(3deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.animate-float-slow {
  animation: float-slow 20s ease-in-out infinite;
}

@keyframes gradient-text {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-text {
  animation: gradient-text 8s ease infinite;
}

.animate-fade-in { animation: fadeIn 2.5s ease-out forwards; }
.animate-fade-in-up { 
  opacity: 0;
  animation: fadeInUp 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(50px); filter: blur(30px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.shadow-glow {
  box-shadow: 0 0 50px -10px var(--color-primary-glow);
}
</style>
