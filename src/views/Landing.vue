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
onMounted(() => {
  for (let i = 0; i < 30; i++) {
    neurons.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#010101] selection:bg-primary/30 overflow-x-hidden w-full font-sans relative text-white">
    
    <!-- Cinematic Neural Background -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[200px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[180px]" style="animation-delay: 2s"></div>
      
      <div class="absolute inset-0 bg-grid-white/[0.01] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]"></div>
      
      <!-- Moving Particles -->
      <div v-for="n in neurons" :key="n.id" 
        class="absolute w-px h-px bg-primary/40 rounded-full"
        :style="{
          left: n.x + '%',
          top: n.y + '%',
          animation: `float-neuron ${n.duration}s ease-in-out ${n.delay}s infinite alternate`
        }"
      ></div>
    </div>

    <!-- Premium Floating Header -->
    <header class="fixed top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50">
      <nav class="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] px-8 py-4 md:px-12 flex justify-between items-center shadow-2xl ring-1 ring-white/5">
        <div class="flex items-center gap-5 group cursor-pointer" @click="router.push('/')">
          <div class="w-11 h-11 bg-gradient-to-br from-primary to-secondary p-0.5 rounded-2xl transform group-hover:rotate-12 transition-all duration-700 shadow-glow shrink-0">
            <div class="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-7 h-7 object-contain" />
            </div>
          </div>
          <div class="hidden xs:block">
            <span class="text-xl font-black text-white tracking-tighter uppercase block leading-none">MentorIA</span>
            <span class="text-[7px] font-black text-primary uppercase tracking-[0.5em] mt-1">Intelligence Suite</span>
          </div>
        </div>
        
        <div class="hidden md:flex items-center gap-12">
          <button @click="router.push('/login')" class="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">Portal Docente</button>
          <button @click="router.push('/login?signup=true')" class="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-glow hover:bg-secondary hover:-translate-y-1 transition-all active:scale-95">
            Comenzar Ahora
          </button>
        </div>

        <button @click="toggleMenu" class="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl text-white">
          <MenuIcon v-if="!isMenuOpen" class="w-5 h-5" />
          <XIcon v-else class="w-5 h-5" />
        </button>
      </nav>
    </header>

    <!-- Main Hero -->
    <main class="relative z-10 h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
      <!-- Badge -->
      <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 mb-8 animate-fade-in relative z-20">
        <Sparkles class="w-3.5 h-3.5 text-primary animate-pulse" />
        <span class="text-[9px] font-black uppercase tracking-[0.5em]">Red Neuronal v2.0 Online</span>
      </div>

      <!-- Content Container (Centered) -->
      <div class="relative w-full max-w-7xl flex flex-col items-center">
        <!-- 3D Centerpiece (Background of text) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
           <div class="absolute w-[80%] h-[80%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
           <img 
             src="/neural-brain.png" 
             alt="Neural Core" 
             class="w-full max-w-2xl h-auto animate-float-slow mix-blend-screen"
           />
        </div>

        <!-- Headline -->
        <div class="text-center mb-8 relative z-10">
          <h1 class="text-5xl md:text-7xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.85] animate-fade-in-up">
            LA IA QUE <br />
            <span class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent italic px-4">ENTIENDE</span> <br />
            TU MISION
          </h1>
        </div>

        <!-- Subheadline -->
        <p class="text-lg md:text-xl text-white/30 max-w-2xl text-center font-medium mb-10 animate-fade-in-up animation-delay-300 italic leading-snug relative z-10">
          Fusionamos el instinto pedagógico con redes neuronales para potenciar cada aula del mundo.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fade-in-up animation-delay-600 relative z-10">
          <button @click="router.push('/login')" class="px-12 py-6 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white hover:scale-110 transition-all active:scale-95 shadow-2xl">
            Entrar al Panel
          </button>
          <button @click="router.push('/demo')" class="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95">
            Ver Demo
          </button>
        </div>

        <!-- Value Proposition Grid (Compact) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl animate-fade-in-up animation-delay-900 relative z-10">
          <div v-for="(card, i) in [
            { t: 'GENERACIÓN ÉLITE', d: 'Clases y talleres con precisión pedagógica.', i: Cpu },
            { t: 'SEGURIDAD TOTAL', d: 'Datos protegidos por encriptación neuronal.', i: ShieldCheck },
            { t: 'ANÁLISIS VISIÓN', d: 'Procesa documentos físicos con ojos de IA.', i: BrainCircuit }
          ]" :key="i" 
          class="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-700 group flex items-center gap-5">
            <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
              <component :is="card.i" class="w-5 h-5" />
            </div>
            <div class="text-left">
              <h3 class="text-[11px] font-black text-white uppercase tracking-wider italic mb-0.5">{{ card.t }}</h3>
              <p class="text-[9px] text-white/30 font-bold leading-tight">{{ card.d }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer (Simplified and compact) -->
    <footer class="fixed bottom-0 left-0 w-full py-6 px-10 border-t border-white/5 bg-black/40 backdrop-blur-xl z-20 flex justify-between items-center">
       <div class="flex items-center gap-4">
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-6 h-6 opacity-40" />
          <span class="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">MentorIA 2026 | Neural Suite</span>
       </div>
       <div class="flex items-center gap-12 grayscale opacity-20 pointer-events-none hidden lg:flex">
          <Globe class="w-4 h-4" />
          <Users class="w-4 h-4" />
          <Activity class="w-4 h-4" />
       </div>
       <div class="flex gap-6">
          <button class="text-[8px] font-black text-white/10 uppercase tracking-widest hover:text-white transition-colors">Portal</button>
          <button class="text-[8px] font-black text-white/10 uppercase tracking-widest hover:text-white transition-colors">Legal</button>
       </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }

@keyframes float-neuron {
  from { transform: translate(0, 0); opacity: 0.1; }
  to { transform: translate(30px, 30px); opacity: 0.6; }
}

@keyframes float-slow {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-40px) rotate(3deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}

.animate-fade-in { animation: fadeIn 2s ease-out forwards; }
.animate-fade-in-up { 
  opacity: 0;
  animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(80px); filter: blur(30px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.shadow-glow {
  box-shadow: 0 0 60px -10px var(--color-primary-glow);
}

.premium-pop-enter-active,
.premium-pop-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-pop-enter-from,
.premium-pop-leave-to {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(30px);
}
</style>

