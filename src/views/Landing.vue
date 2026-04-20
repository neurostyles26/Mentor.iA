<script setup>
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  ClipboardList, 
  Zap,
  Globe,
  Rocket,
  ShieldCheck,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-bg-deep selection:bg-primary/30 overflow-x-hidden font-sans">
    <!-- Animated background layers -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 3s"></div>
      <div class="absolute inset-0 bg-grid-white/[0.01] bg-[size:60px_60px]"></div>
    </div>

    <!-- Nav -->
    <nav class="container mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-10 flex justify-between items-center relative z-20 animate-fade-in-down">
      <div class="flex items-center gap-3 md:gap-4 group cursor-pointer" @click="router.push('/')">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-glow transform group-hover:rotate-12 transition-all duration-500 shrink-0">
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-6 h-6 md:w-8 md:h-8 object-contain" />
        </div>
        <div class="overflow-hidden">
          <span class="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none block">MentorIA</span>
          <p class="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mt-0.5 md:mt-1 truncate">Intelligence Suite v2.5</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3 sm:gap-8">
        <button @click="router.push('/login')" class="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors hidden xs:block">Sincronizar Panel</button>
        <button @click="router.push('/login?signup=true')" class="px-4 py-2.5 md:px-8 md:py-3 bg-white text-bg-deep rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-premium hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 whitespace-nowrap">
          Crear Cuenta
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <main class="container mx-auto px-4 md:px-6 lg:px-12 pt-10 md:pt-16 pb-20 md:pb-32 text-center relative z-10">
      <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary mb-8 md:mb-10 animate-fade-in shadow-glow">
        <Sparkles class="w-3.5 h-3.5 animate-pulse" />
        <span class="text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">Motor Neuronal Avanzado Activo</span>
      </div>
      
      <div class="max-w-5xl mx-auto space-y-6 md:space-y-8 mb-12 md:mb-20">
        <h1 class="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-fade-in-up">
          El Aula del Futuro <br />
          <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">se diseña hoy</span>
        </h1>
        
        <p class="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto font-bold animate-fade-in-up animation-delay-300 leading-relaxed px-2">
          MentorIA es la red neuronal de apoyo para docentes que transforma ideas en piezas pedagógicas de clase mundial.
        </p>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-20 md:mb-32 animate-fade-in-up animation-delay-600">
        <button @click="router.push('/login')" class="px-8 py-5 md:px-12 md:py-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all active:scale-95 group relative overflow-hidden">
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
          <span class="relative z-10 flex items-center justify-center gap-3 md:gap-4">
            Empezar <span class="hidden xs:inline">Experiencia</span> IA <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
        </button>
        <button class="px-8 py-5 md:px-12 md:py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all hover:-translate-y-2 active:scale-95">
          Ver Demo
        </button>
      </div>

      <!-- Features Grid with animations -->
      <div class="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div class="feature-card animate-fade-in-up animation-delay-900 group">
          <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:scale-110 group-hover:rotate-6 transition-all border border-primary/20 shadow-glow">
            <Zap class="text-primary w-8 h-8" />
          </div>
          <h3 class="text-2xl font-black text-white mb-4 tracking-tight uppercase italic lg:text-left">Generación Veloz</h3>
          <p class="text-white/60 font-bold leading-relaxed lg:text-left">Crea lecciones, talleres y exámenes en segundos optimizados con IA Cuántica.</p>
        </div>

        <div class="feature-card animate-fade-in-up animation-delay-1100 group">
          <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:scale-110 group-hover:-rotate-6 transition-all border border-secondary/20 shadow-glow">
            <ClipboardList class="text-secondary w-8 h-8" />
          </div>
          <h3 class="text-2xl font-black text-white mb-4 tracking-tight uppercase italic lg:text-left">Organización IA</h3>
          <p class="text-white/60 font-bold leading-relaxed lg:text-left">Sincroniza tus ideas directamente en un ecosistema persistente y estructurado.</p>
        </div>

        <div class="feature-card animate-fade-in-up animation-delay-1300 group">
          <div class="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:scale-110 group-hover:rotate-12 transition-all border border-accent/20 shadow-glow">
            <ShieldCheck class="text-accent w-8 h-8" />
          </div>
          <h3 class="text-2xl font-black text-white mb-4 tracking-tight uppercase italic lg:text-left">Sello Pedagógico</h3>
          <p class="text-white/60 font-bold leading-relaxed lg:text-left">Alineado con los Derechos Básicos de Aprendizaje (DBA) de Colombia.</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-20 bg-black/20 relative z-20">
      <div class="container mx-auto px-6 text-center space-y-8 leading-none">
        <div class="flex items-center justify-center gap-3 mb-4">
           <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
           <p class="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Ecosistema MentorIA 2026</p>
        </div>
        <p class="text-white/40 font-black uppercase text-[10px] tracking-widest">Diseñado para docentes, impulsado por neuronas digitales</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-900 { animation-delay: 0.9s; }
.animation-delay-1100 { animation-delay: 1.1s; }
.animation-delay-1300 { animation-delay: 1.3s; }

.animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in-up { 
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}
.animate-fade-in-down { 
  opacity: 0;
  animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.feature-card {
  @apply glass-panel p-10 bg-white/2 border-white/5 hover:border-primary/40 transition-all duration-700;
}

.shadow-glow {
  box-shadow: 0 0 40px -10px var(--color-primary-glow);
}
</style>
