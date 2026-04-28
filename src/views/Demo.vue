<script setup>
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  BrainCircuit, 
  MessageCircle, 
  FileDown, 
  MonitorSmartphone,
  Check,
  ArrowLeft,
  ArrowRight,
  Zap,
  Play
} from 'lucide-vue-next'

const router = useRouter()

const inductionSteps = [
  {
    title: 'Arquitecto de Clases',
    icon: Sparkles,
    color: 'bg-primary/20 text-primary',
    desc: 'Crea lecciones, talleres y exámenes de nivel profesional en segundos. Define el grado y la materia, y deja que la IA redacte todo el contenido pedagógico estructurado.',
    features: ['Lecciones magistrales', 'Talleres creativos', 'Evaluaciones dinámicas']
  },
  {
    title: 'Laboratorio Docente',
    icon: BrainCircuit,
    color: 'bg-emerald-500/20 text-emerald-400',
    desc: 'Sube tus propios archivos (PDF, Word, Excel). La IA los analizará para crear resúmenes, extraer preguntas o incluso calificar listas de notas automáticamente.',
    features: ['Análisis de PDF/Word', 'Gestión de Notas Excel', 'Extracción de conceptos']
  },
  {
    title: 'Mentor IA & Voz',
    icon: MessageCircle,
    color: 'bg-purple-500/20 text-purple-400',
    desc: 'Tu asistente personal 24/7. Resuelve dudas metodológicas o administrativas mediante chat o dictado por voz con respuestas instantáneas optimizadas.',
    features: ['Asistente de Voz Neural', 'Soporte Pedagógico', 'Memoria de Contexto']
  },
  {
    title: 'Exportación Elite',
    icon: FileDown,
    color: 'bg-orange-500/20 text-orange-400',
    desc: 'Convierte tus creaciones en documentos listos para entregar. Exporta a PDF con diseño institucional, Excel de datos o diapositivas de PowerPoint.',
    features: ['PDF Profesional', 'PowerPoint Automático', 'Excel Estructurado']
  },
  {
    title: 'Instalación PWA',
    icon: MonitorSmartphone,
    color: 'bg-blue-500/20 text-blue-400',
    desc: 'Lleva MentorIA en tu celular como una App nativa. Usa el botón "Descargar App" en el menú o añade a pantalla de inicio desde tu navegador.',
    features: ['Acceso sin navegador', 'Icono en escritorio', 'Mayor fluidez']
  }
]
</script>

<template>
  <div class="min-h-screen bg-bg-deep selection:bg-primary/30 overflow-x-hidden w-full font-sans relative">
    <!-- Background layers -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 3s"></div>
      <div class="absolute inset-0 bg-grid-white/[0.01] bg-[size:60px_60px]"></div>
    </div>

    <!-- Nav -->
    <nav class="container mx-auto px-6 py-10 flex justify-between items-center relative z-20">
      <button 
        @click="router.push('/')" 
        class="flex items-center gap-3 text-white/50 hover:text-white transition-all group"
      >
        <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
          <ArrowLeft class="w-5 h-5" />
        </div>
        <span class="text-[10px] font-black uppercase tracking-[0.3em]">Volver al Inicio</span>
      </button>

      <div class="flex items-center gap-4">
        <button 
          @click="router.push('/login')" 
          class="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:bg-secondary transition-all"
        >
          Probar Ahora
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-6 pt-10 pb-32 relative z-10">
      <!-- Header -->
      <div class="max-w-4xl mx-auto text-center space-y-10 mb-32">
        <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary">
          <Play class="w-4 h-4 fill-current" />
          <span class="text-[10px] font-black uppercase tracking-[0.4em]">Inmersión Interactiva MentorIA</span>
        </div>
        
        <h1 class="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] italic">
          Descubre el <br />
          <span class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">Efecto Mentor</span>
        </h1>

        <p class="text-white/40 font-bold text-xl md:text-2xl leading-relaxed italic max-w-2xl mx-auto">
          Un ecosistema diseñado para docentes que quieren liderar la educación del mañana. Aquí te mostramos cómo funciona.
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div 
          v-for="(step, index) in inductionSteps" 
          :key="index"
          class="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[3.5rem] hover:border-primary/30 transition-all duration-700 hover:translate-y-[-10px] overflow-hidden"
        >
          <div class="absolute -right-10 -top-10 text-[12rem] font-black text-white/[0.02] italic select-none">{{ index + 1 }}</div>
          
          <div class="relative z-10 space-y-8">
            <div :class="['w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-12', step.color]">
              <component :is="step.icon" class="w-10 h-10" />
            </div>

            <div class="space-y-4">
              <h3 class="text-3xl font-black text-white tracking-tight italic">{{ step.title }}</h3>
              <p class="text-lg text-white/40 leading-relaxed font-medium italic">{{ step.desc }}</p>
            </div>

            <ul class="space-y-4 pt-8 border-t border-white/5">
              <li v-for="feat in step.features" :key="feat" class="flex items-center gap-4 text-xs font-black text-white/60 uppercase tracking-widest">
                <div class="w-1.5 h-1.5 bg-primary rounded-full shadow-glow"></div>
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CTA Footer -->
      <div class="mt-40 text-center space-y-12 bg-gradient-to-b from-transparent to-primary/10 p-20 rounded-[4rem] border border-white/5">
        <div class="space-y-4">
          <h2 class="text-5xl font-black text-white tracking-tighter italic uppercase">¿Listo para transformar tu aula?</h2>
          <p class="text-white/40 font-bold tracking-widest uppercase text-xs">Únete a cientos de docentes que ya usan MentorIA</p>
        </div>

        <button 
          @click="router.push('/login?signup=true')" 
          class="px-16 py-8 bg-white text-bg-deep rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-glow hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95 group"
        >
          <span class="flex items-center gap-4">
            Crear mi cuenta gratis <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-20 bg-black/20 relative z-20">
      <div class="container mx-auto px-6 text-center">
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">MentorIA Intelligence Suite 2026</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 50px -10px var(--color-primary-glow);
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}
</style>
