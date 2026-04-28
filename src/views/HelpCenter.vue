<script setup>
import { 
  LifeBuoy, 
  Search, 
  MessageCircle, 
  Video, 
  BookOpen, 
  ArrowRight,
  Zap,
  ChevronRight,
  Heart,
  ShieldCheck,
  Copy,
  Check,
  BrainCircuit,
  Sparkles,
  LayoutDashboard,
  Calendar,
  FileDown,
  MonitorSmartphone
} from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
const qrImage = '/Mnetoria-qrnequi.jpeg'
const paymentKey = '0092004175'
const isCopied = ref(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(paymentKey)
  isCopied.value = true
  setTimeout(() => isCopied.value = false, 2000)
}

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
  <div class="space-y-20 pb-24 max-w-7xl mx-auto px-4">
    <!-- Sophisticated Header -->
    <div class="relative overflow-hidden rounded-[4rem] bg-bg-card border border-white/10 p-12 lg:p-24 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div class="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] animate-pulse-slow" style="animation-delay: 2s"></div>
      </div>

      <div class="relative z-10 space-y-10 text-center max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary">
          <LifeBuoy class="w-5 h-5" />
          <span class="text-[10px] font-black uppercase tracking-[0.4em]">Inducción Maestra MentorIA</span>
        </div>
        
        <h1 class="text-6xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8] italic">
          Domina tu <br />
          <span class="bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">Ecosistema IA</span>
        </h1>

        <p class="text-white/40 font-bold text-xl lg:text-2xl leading-relaxed italic">
          Bienvenido a la nueva era docente. Aquí aprenderás a utilizar cada neurona digital de MentorIA para transformar tu aula.
        </p>
      </div>
    </div>

    <!-- Induction Steps Section -->
    <section class="space-y-12">
      <div class="flex flex-col items-center text-center gap-4 mb-16">
        <h2 class="text-4xl font-black text-white uppercase tracking-tighter italic">Guía de Inmersión</h2>
        <div class="w-24 h-1.5 bg-primary rounded-full shadow-glow"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(step, index) in inductionSteps" 
          :key="index"
          class="group relative bg-bg-card border border-white/5 p-8 rounded-[3rem] hover:border-primary/30 transition-all duration-700 hover:translate-y-[-10px] overflow-hidden"
        >
          <div class="absolute -right-8 -top-8 text-8xl font-black text-white/[0.02] italic">{{ index + 1 }}</div>
          
          <div class="relative z-10 space-y-6">
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12', step.color]">
              <component :is="step.icon" class="w-8 h-8" />
            </div>

            <h3 class="text-2xl font-black text-white tracking-tight italic">{{ step.title }}</h3>
            <p class="text-sm text-white/40 leading-relaxed font-medium">{{ step.desc }}</p>

            <ul class="space-y-3 pt-4 border-t border-white/5">
              <li v-for="feat in step.features" :key="feat" class="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-widest">
                <Check class="w-3 h-3 text-primary" />
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Support & Feedback Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
      <!-- QR Donation Card -->
      <div class="lg:col-span-3 relative overflow-hidden rounded-[4rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 p-12 lg:p-20 flex flex-col items-center justify-center text-center group shadow-2xl">
        <div class="relative z-10 w-full flex flex-col items-center gap-12">
          <div class="space-y-4">
            <div class="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-glow animate-pulse-slow mx-auto">
              <Heart class="w-10 h-10" />
            </div>
            <h2 class="text-5xl font-black text-white tracking-tighter italic">Apoya el Proyecto</h2>
            <p class="text-xs font-black text-primary uppercase tracking-[0.5em]">Evolución Independiente</p>
          </div>
          
          <div class="relative group/qr p-10 bg-white rounded-[4rem] shadow-glow transition-all duration-700 group-hover/qr:scale-105">
            <img :src="qrImage" alt="QR Pago" class="w-80 h-80 md:w-96 md:h-96 object-contain rounded-3xl" />
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-glow"></div>
          </div>

          <div class="space-y-8">
            <div class="inline-flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full">
              <ShieldCheck class="w-5 h-5 text-primary" />
              <span class="text-xs font-black text-white/70 uppercase tracking-widest">Pago Seguro Nequi / Bre-B</span>
            </div>
            
            <button 
              @click="copyToClipboard"
              class="flex items-center gap-6 px-10 py-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-primary/40 transition-all active:scale-95 group mx-auto"
            >
              <div class="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                <component :is="isCopied ? Check : Copy" class="w-5 h-5" />
              </div>
              <div class="text-left">
                <p class="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Copiar Número</p>
                <p class="text-2xl font-black text-white tracking-[0.2em]">{{ paymentKey }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Feedback Card -->
      <div class="lg:col-span-2 bg-bg-card border border-white/10 rounded-[4rem] p-16 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <div class="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-primary mb-12 border border-white/10 transition-transform group-hover:rotate-12">
            <MessageCircle class="w-10 h-10" />
          </div>
          <h2 class="text-4xl font-black text-white tracking-tight italic mb-8 uppercase">Propuestas <br /> y Soporte</h2>
          <p class="text-lg font-medium text-white/40 leading-relaxed mb-12 italic">
            ¿MentorIA puede ser aún mejor? Escríbenos directamente para implementar tus ideas en el ecosistema.
          </p>
          
          <div class="space-y-8 mb-16">
            <div class="flex items-center gap-4 text-white/60 group/mail cursor-pointer">
              <div class="w-3 h-3 bg-primary rounded-full shadow-glow animate-pulse"></div>
              <span class="text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">iamentorsoft@gmail.com</span>
            </div>
            <div class="flex items-center gap-4 text-white/60">
              <div class="w-3 h-3 bg-emerald-500 rounded-full shadow-glow"></div>
              <span class="text-[11px] font-black uppercase tracking-[0.3em]">WhatsApp Support 24/7</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-6 relative z-10">
          <a 
            href="https://wa.me/573015997188?text=Hola%20equipo%20de%20MentorIA,%20tengo%20una%20propuesta%20de%20mejora:" 
            target="_blank"
            class="w-full py-6 bg-primary text-white rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all active:scale-95"
          >
            WhatsApp <ChevronRight class="w-5 h-5" />
          </a>
          
          <a 
            href="mailto:iamentorsoft@gmail.com?subject=Propuesta de Mejora - MentorIA"
            class="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all"
          >
            Email <ArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulseSlow 5s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(350px); opacity: 0; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

.shadow-glow {
  box-shadow: 0 0 40px -10px var(--color-primary-glow);
}

.bg-bg-card {
  background: rgba(15, 15, 15, 0.6);
  backdrop-filter: blur(20px);
}
</style>

