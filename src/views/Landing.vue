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
    <main class="relative z-10 pt-64 pb-32">
      <section class="container mx-auto px-6 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 mb-16 animate-fade-in">
          <Sparkles class="w-3.5 h-3.5 text-primary animate-pulse" />
          <span class="text-[9px] font-black uppercase tracking-[0.5em]">El Futuro de la Educación</span>
        </div>

        <!-- Headline -->
        <div class="max-w-7xl mx-auto mb-20">
          <h1 class="text-6xl md:text-8xl lg:text-[11rem] font-black tracking-[-0.06em] leading-[0.85] animate-fade-in-up">
            LA IA QUE <br />
            <span class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent italic px-4">ENTIENDE</span> <br />
            TU MISION
          </h1>
        </div>

        <!-- Subheadline -->
        <p class="text-xl md:text-3xl text-white/30 max-w-3xl mx-auto font-medium mb-24 animate-fade-in-up animation-delay-300 italic leading-snug">
          Fusionamos el instinto pedagógico con redes neuronales para potenciar cada aula del mundo.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row justify-center gap-8 mb-40 animate-fade-in-up animation-delay-600">
          <button @click="router.push('/login')" class="px-14 py-8 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-primary hover:text-white hover:scale-110 hover:-rotate-1 transition-all active:scale-95 shadow-2xl">
            Entrar al Panel
          </button>
          <button @click="router.push('/demo')" class="px-14 py-8 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95">
            Ver Demo
          </button>
        </div>

        <!-- 3D Centerpiece -->
        <div class="relative w-full max-w-5xl mx-auto mb-40">
           <div class="absolute inset-0 bg-primary/20 blur-[150px] rounded-full scale-75 animate-pulse"></div>
           <img 
             src="/neural-brain.png" 
             alt="Neural Core" 
             class="w-full h-auto relative z-10 animate-float-slow drop-shadow-[0_0_100px_rgba(99,102,241,0.3)]"
           />
        </div>

        <!-- Value Proposition Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div v-for="(card, i) in [
            { t: 'GENERACIÓN ÉLITE', d: 'Clases y talleres creados por IA con precisión pedagógica.', i: Cpu },
            { t: 'SEGURIDAD TOTAL', d: 'Tus datos y archivos protegidos por encriptación neuronal.', i: ShieldCheck },
            { t: 'ANÁLISIS VISIÓN', d: 'Procesa documentos físicos y digitales con ojos de IA.', i: BrainCircuit }
          ]" :key="i" 
          class="bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-700 group text-left">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <component :is="card.i" class="w-7 h-7" />
            </div>
            <h3 class="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic">{{ card.t }}</h3>
            <p class="text-base text-white/30 font-bold leading-relaxed">{{ card.d }}</p>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="mt-60 border-y border-white/5 py-24 bg-white/[0.01]">
         <div class="container mx-auto px-6">
            <p class="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.8em] mb-16">Impulsando Instituciones de Vanguardia</p>
            <div class="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
               <div class="flex items-center gap-3">
                  <Globe class="w-8 h-8" /> <span class="text-xl font-black tracking-tighter">GLOBAL ED</span>
               </div>
               <div class="flex items-center gap-3">
                  <Cpu class="w-8 h-8" /> <span class="text-xl font-black tracking-tighter">TECH ACADEMY</span>
               </div>
               <div class="flex items-center gap-3">
                  <ShieldCheck class="w-8 h-8" /> <span class="text-xl font-black tracking-tighter">SECURE LEARN</span>
               </div>
               <div class="flex items-center gap-3">
                  <Users class="w-8 h-8" /> <span class="text-xl font-black tracking-tighter">UNION DOCENTE</span>
               </div>
            </div>
         </div>
      </section>
    </main>

    <!-- Final CTA -->
    <section class="py-40 relative overflow-hidden">
       <div class="absolute inset-0 bg-primary/5 blur-[200px] rounded-full translate-y-1/2"></div>
       <div class="container mx-auto px-6 text-center relative z-10">
          <h2 class="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-12 italic">¿Listo para elevar <br /> tu aula?</h2>
          <button @click="router.push('/login')" class="px-20 py-10 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-glow hover:scale-110 transition-all">
             Crear Cuenta Gratis
          </button>
       </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 border-t border-white/5 bg-black/50 backdrop-blur-xl">
       <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div class="flex items-center gap-4">
             <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-8 h-8 opacity-50" />
             <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">MentorIA 2026 | Neural Suite</span>
          </div>
          <div class="flex gap-8">
             <button class="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Privacidad</button>
             <button class="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Términos</button>
             <button class="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Contacto</button>
          </div>
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

</style>

