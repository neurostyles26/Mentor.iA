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

    <!-- Main Hero Container -->
    <main class="relative z-10 h-screen w-full flex flex-col overflow-hidden px-4 md:px-10">
      
      <!-- Top Spacer for Header -->
      <div class="h-24 shrink-0"></div>

      <!-- Center Content: Hero -->
      <div class="flex-1 flex flex-col justify-center items-center relative min-h-0">
        
        <!-- Neural Brain (Absolute Background) -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-40">
           <div class="absolute w-[80%] h-[80%] bg-primary/10 blur-[100px] rounded-full animate-pulse"></div>
           <img 
             src="/neural-brain.png" 
             alt="Neural Core" 
             class="w-full max-w-xl h-auto animate-float-slow mix-blend-screen opacity-60"
           />
        </div>

        <!-- Headline & Subheadline Group -->
        <div class="text-center relative z-10 space-y-6 max-w-5xl">
          <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 mb-4 animate-fade-in mx-auto backdrop-blur-md">
            <Sparkles class="w-3.5 h-3.5 text-primary animate-pulse" />
            <span class="text-[9px] font-black uppercase tracking-[0.6em]">Ecosistema v2.0 Online</span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-[6.5rem] font-light tracking-[-0.04em] leading-[0.9] animate-fade-in-up uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            LA IA QUE <br />
            <span class="font-black italic bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent px-4 animate-gradient-text bg-[length:200%_auto]">
              ENTIENDE
            </span> <br />
            <span class="font-extrabold tracking-tighter">TU MISION</span>
          </h1>

          <div class="relative py-4">
             <div class="absolute inset-0 bg-black/20 blur-xl rounded-full scale-110"></div>
             <p class="text-base md:text-xl text-white/50 max-w-2xl mx-auto font-medium italic leading-relaxed animate-fade-in-up animation-delay-300 relative z-10 px-4">
               "Fusionamos el instinto pedagógico con redes neuronales para potenciar cada aula del mundo."
             </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-6 pt-6 animate-fade-in-up animation-delay-600 relative z-10">
            <button @click="router.push('/login')" class="px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95">
              Entrar al Panel
            </button>
            <button @click="router.push('/demo')" class="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 backdrop-blur-2xl transition-all hover:scale-105 active:scale-95">
              Ver Demo
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Content: Features Grid -->
      <div class="h-auto shrink-0 pb-24 relative z-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-6xl mx-auto animate-fade-in-up animation-delay-900">
          <div v-for="(card, i) in [
            { t: 'GENERACIÓN ÉLITE', d: 'Clases con precisión pedagógica.', i: Cpu },
            { t: 'SEGURIDAD TOTAL', d: 'Datos protegidos por encriptación.', i: ShieldCheck },
            { t: 'ANÁLISIS VISIÓN', d: 'Procesa documentos con ojos de IA.', i: BrainCircuit }
          ]" :key="i" 
          class="bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.06] hover:border-primary/20 transition-all group flex items-center gap-4">
            <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
              <component :is="card.i" class="w-4 h-4" />
            </div>
            <div class="text-left overflow-hidden">
              <h3 class="text-[10px] font-black text-white uppercase tracking-wider italic mb-0.5 truncate">{{ card.t }}</h3>
              <p class="text-[8px] text-white/20 font-bold leading-tight truncate md:whitespace-normal">{{ card.d }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Footer -->
    <footer class="fixed bottom-0 left-0 w-full py-4 px-8 border-t border-white/5 bg-black/60 backdrop-blur-2xl z-30 flex justify-between items-center h-16">
       <div class="flex items-center gap-3">
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-5 h-5 opacity-40" />
          <span class="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">MentorIA 2026 | Neural Suite</span>
       </div>
       <div class="hidden lg:flex items-center gap-8 grayscale opacity-10">
          <Globe class="w-3.5 h-3.5" /> <Users class="w-3.5 h-3.5" /> <Activity class="w-3.5 h-3.5" />
       </div>
       <div class="flex gap-4">
          <button class="text-[7px] font-black text-white/10 uppercase tracking-widest hover:text-white transition-colors">Portal</button>
          <button class="text-[7px] font-black text-white/10 uppercase tracking-widest hover:text-white transition-colors">Legal</button>
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

