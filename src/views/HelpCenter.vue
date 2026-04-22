<script setup>
import { 
  LifeBuoy, 
  Search, 
  MessageCircle, 
  Video, 
  BookOpen, 
  ArrowRight,
  Heart,
  Zap,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
const isCopied = ref(false)
const paymentKey = '312 456 7890'
const qrImage = '/Mnetoria-qrnequi.jpeg'

const helpCategories = [
  {
    title: 'Primeros Pasos',
    desc: 'Configuración inicial y creación de tu primera clase magistral.',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Mentor IA',
    desc: 'Optimización de prompts y generación de contenido pedagógico.',
    icon: MessageCircle,
    color: 'from-primary to-blue-600'
  },
  {
    title: 'Exportación',
    desc: 'Gestión de formatos PDF, Excel y presentaciones dinámicas.',
    icon: BookOpen,
    color: 'from-emerald-400 to-teal-600'
  },
  {
    title: 'Video Tutoriales',
    desc: 'Cápsulas de aprendizaje sobre funciones avanzadas.',
    icon: Video,
    color: 'from-purple-500 to-indigo-600'
  }
]

const copyToClipboard = () => {
  navigator.clipboard.writeText(paymentKey)
  isCopied.value = true
  setTimeout(() => isCopied.value = false, 2000)
}
</script>

<template>
  <div class="space-y-16 pb-20 max-w-7xl mx-auto">
    <!-- Sophisticated Header -->
    <div class="relative overflow-hidden rounded-[3.5rem] bg-bg-card border border-white/10 p-10 lg:p-20 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]">
      <!-- Animated Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div class="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] animate-pulse-slow" style="animation-delay: 2s"></div>
      </div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <LifeBuoy class="w-4 h-4" />
            <span class="text-[9px] font-black uppercase tracking-[0.3em]">Centro de Soporte Elite</span>
          </div>
          
          <h1 class="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] italic">
            Potenciamos <br />
            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">tu enseñanza</span>
          </h1>

          <p class="text-white/60 font-medium text-lg leading-relaxed max-w-md">
            Explora nuestra base de conocimientos diseñada para elevar tu productividad pedagógica al siguiente nivel.
          </p>
          
          <div class="flex items-center gap-4 bg-white/5 p-2 pl-6 rounded-3xl border border-white/10 focus-within:border-primary/50 transition-all duration-500 shadow-inner group">
            <Search class="w-6 h-6 text-white/20 group-focus-within:text-primary transition-colors" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar guías o soluciones..."
              class="bg-transparent border-0 outline-none text-sm font-bold w-full text-white placeholder:text-white/20 py-4"
            />
          </div>
        </div>

        <!-- Visual element for header -->
        <div class="hidden lg:flex justify-center items-center relative">
           <div class="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[4rem] border border-white/10 flex items-center justify-center animate-float">
              <LifeBuoy class="w-32 h-32 text-primary opacity-50" />
           </div>
           <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Premium Help Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        v-for="cat in helpCategories" 
        :key="cat.title"
        class="group relative p-10 bg-white/2 border border-white/5 rounded-[3rem] hover:border-primary/40 transition-all duration-700 overflow-hidden"
      >
        <div :class="['w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12', cat.color]">
          <component :is="cat.icon" class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-2xl font-black text-white tracking-tight mb-4">{{ cat.title }}</h3>
        <p class="text-xs font-bold text-white/40 leading-relaxed mb-10 group-hover:text-white/70 transition-colors">{{ cat.desc }}</p>
        <div class="inline-flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform">
          Consultar Guía <ChevronRight class="w-4 h-4" />
        </div>
        
        <!-- Decorative subtle gradient -->
        <div class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>

    <!-- Refined Support Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/10 p-10 lg:p-16">
        <div class="relative z-10">
          <div class="flex items-center gap-5 mb-10">
            <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-glow">
              <Heart class="w-7 h-7" />
            </div>
            <div>
              <h2 class="text-4xl font-black text-white tracking-tight italic">Apoya el Ecosistema</h2>
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Impulsando la Educación con IA</p>
            </div>
          </div>
          
          <p class="text-white/60 font-medium text-lg leading-relaxed mb-12 max-w-2xl">
            MentorIA es un proyecto independiente nacido de la pasión por la pedagogía. Tu aporte directo permite que nuestras neuronas digitales sigan evolucionando para ti.
          </p>

          <div class="flex flex-col md:flex-row items-center gap-16">
            <div class="relative group">
              <div class="relative p-6 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(255,255,255,0.1)] transition-all duration-700 group-hover:scale-105">
                <img 
                  :src="qrImage" 
                  alt="QR Pago" 
                  class="w-64 h-64 md:w-72 md:h-72 object-contain rounded-2xl"
                />
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
              </div>
              <div class="absolute -inset-4 border border-white/5 rounded-[3rem] pointer-events-none"></div>
            </div>

            <div class="space-y-8 text-center md:text-left flex-1">
              <div class="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <ShieldCheck class="w-4 h-4 text-primary" />
                <span class="text-[9px] font-black text-white/50 uppercase tracking-widest">Escaneo Seguro</span>
              </div>
              
              <h3 class="text-3xl font-black text-white tracking-tight italic leading-tight">Usa tu Wallet Preferida <br /> <span class="text-primary opacity-80">Nequi o Bre-B</span></h3>
              
              <div class="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <button 
                  @click="copyToClipboard"
                  class="group flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all active:scale-95"
                >
                  <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                    <component :is="isCopied ? Check : Copy" class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-[8px] font-black text-white/40 uppercase tracking-widest text-left">Copiar Número</p>
                    <p class="text-sm font-black text-white">{{ paymentKey }}</p>
                  </div>
                  <div v-if="isCopied" class="ml-4 text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-fade-in">¡Listo!</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Support & Feedback Card -->
      <div class="bg-bg-card border border-white/10 rounded-[3.5rem] p-12 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <div class="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-primary mb-10 border border-white/10 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <MessageCircle class="w-8 h-8" />
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight italic mb-6">Propuestas <br /> de Mejora</h2>
          <p class="text-sm font-medium text-white/40 leading-relaxed mb-8">
            ¿Tienes una idea para potenciar MentorIA? Escríbenos directamente para implementar tus sugerencias en el ecosistema.
          </p>
          
          <div class="space-y-4 mb-10">
            <div class="flex items-center gap-3 text-white/60">
              <div class="w-2 h-2 bg-primary rounded-full"></div>
              <span class="text-[10px] font-black uppercase tracking-widest">iamentorsoft@gmail.com</span>
            </div>
            <div class="flex items-center gap-3 text-white/60">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span class="text-[10px] font-black uppercase tracking-widest">Soporte WhatsApp Activo</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4 relative z-10">
          <a 
            href="https://wa.me/573124567890?text=Hola%20equipo%20de%20MentorIA,%20tengo%20una%20propuesta%20de%20mejora%20para%20el%20software:" 
            target="_blank"
            class="w-full py-5 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary transition-all active:scale-95"
          >
            WhatsApp Support <ChevronRight class="w-4 h-4" />
          </a>
          
          <a 
            href="mailto:iamentorsoft@gmail.com?subject=Propuesta de Mejora - MentorIA"
            class="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all active:scale-95"
          >
            Enviar Correo <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        <!-- Decorative background text -->
        <div class="absolute -bottom-10 -right-10 text-9xl font-black text-white/[0.02] pointer-events-none select-none tracking-tighter italic">SUGGEST</div>
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(280px); opacity: 0; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Glass effect refinements */
.glass-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
