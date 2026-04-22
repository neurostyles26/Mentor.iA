<script setup>
import { 
  LifeBuoy, 
  Search, 
  MessageCircle, 
  Video, 
  BookOpen, 
  ArrowRight,
  Heart,
  Smartphone,
  Zap,
  Globe,
  Copy,
  Check,
  ChevronRight
} from 'lucide-vue-next'
import { ref } from 'vue'

const searchQuery = ref('')
const isCopied = ref(false)
const paymentKey = '312 456 7890'
const qrImage = '/Mnetoria-qrnequi.jpeg'

const helpCategories = [
  {
    title: 'Primeros Pasos',
    desc: 'Aprende a configurar tu entorno y crear tu primera clase.',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Mentor IA',
    desc: 'Domina el arte de los prompts y la generación de contenido.',
    icon: MessageCircle,
    color: 'from-primary to-blue-600'
  },
  {
    title: 'Exportación',
    desc: 'Guía sobre formatos PDF, Excel y presentaciones.',
    icon: BookOpen,
    color: 'from-emerald-400 to-teal-600'
  },
  {
    title: 'Tutoriales Video',
    desc: 'Videos cortos sobre funcionalidades específicas.',
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
  <div class="space-y-12 pb-20">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-[3rem] bg-bg-card border border-white/5 p-12 lg:p-20 shadow-2xl">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary mb-8">
          <LifeBuoy class="w-4 h-4" />
          <span class="text-[10px] font-black uppercase tracking-[0.3em]">Centro de Soporte</span>
        </div>
        <h1 class="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none italic mb-8">
          ¿En qué podemos <br />
          <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">potenciarte hoy?</span>
        </h1>
        
        <div class="flex items-center gap-4 bg-white/5 p-2 pl-6 rounded-3xl border border-white/10 focus-within:border-primary/50 transition-all duration-500 max-w-xl">
          <Search class="w-6 h-6 text-white/30" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Busca guías, tutoriales o ayuda..."
            class="bg-transparent border-0 outline-none text-sm font-bold w-full text-white placeholder:text-white/30 py-4"
          />
          <button class="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-glow">
            Buscar
          </button>
        </div>
      </div>
    </div>

    <!-- Help Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="cat in helpCategories" 
        :key="cat.title"
        class="glass-panel group p-8 hover:border-primary/40 transition-all duration-500 cursor-pointer"
      >
        <div :class="['w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all', cat.color]">
          <component :is="cat.icon" class="w-8 h-8 text-white" />
        </div>
        <h3 class="text-xl font-black text-white tracking-tight mb-4">{{ cat.title }}</h3>
        <p class="text-xs font-bold text-white/60 leading-relaxed mb-8">{{ cat.desc }}</p>
        <div class="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
          Explorar Guía <ArrowRight class="w-3 h-3" />
        </div>
      </div>
    </div>

    <!-- Support Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-white/5 p-12">
        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-glow">
              <Heart class="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 class="text-3xl font-black text-white tracking-tight italic">Apoya el Proyecto</h2>
              <p class="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Impulsando la Educación con IA</p>
            </div>
          </div>
          
          <p class="text-white/80 font-bold text-lg leading-relaxed mb-12 max-w-2xl">
            MentorIA es un proyecto independiente. Tu apoyo nos permite mantener los servidores activos y seguir desarrollando herramientas gratuitas para docentes.
          </p>

          <div class="flex flex-col md:flex-row items-center gap-12">
            <div class="relative p-6 bg-white rounded-[2.5rem] shadow-2xl group shrink-0">
              <img 
                :src="qrImage" 
                alt="QR Pago Nequi/Bre-B" 
                class="w-64 h-64 md:w-72 md:h-72 object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 border-2 border-primary/20 rounded-[2.5rem] pointer-events-none"></div>
            </div>

            <div class="space-y-6 text-center md:text-left">
              <h3 class="text-3xl font-black text-white tracking-tight italic">Escanéa y Apoya</h3>
              <p class="text-white/60 font-bold text-lg leading-relaxed max-w-md">
                Usa tu aplicación de Nequi o cualquier entidad bancaria con Bre-B para escanear este código. Tu aporte directo permite que MentorIA siga siendo libre para todos los docentes.
              </p>
              
              <div class="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <button 
                  @click="copyToClipboard"
                  class="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <template v-if="isCopied">
                    <Check class="w-4 h-4 text-emerald-400 inline mr-2" /> ¡Copiado!
                  </template>
                  <template v-else>
                    <Copy class="w-4 h-4 inline mr-2" /> Número: {{ paymentKey }}
                  </template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-bg-card border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between group">
        <div>
          <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8 border border-secondary/20">
            <MessageCircle class="w-8 h-8" />
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight italic mb-4">¿Necesitas charla técnica?</h2>
          <p class="text-xs font-bold text-white/60 leading-relaxed">
            Nuestro equipo de soporte está disponible para ayudarte con implementaciones personalizadas o errores específicos.
          </p>
        </div>
        
        <button class="mt-12 w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all group-hover:border-secondary/40">
          Contactar Soporte <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2.5rem;
}

.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}
</style>
