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
  Zap as ZapIcon
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

    <!-- Premium Support & Feedback Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
      <!-- QR Donation Card (Larger) -->
      <div class="lg:col-span-3 relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 p-10 lg:p-16 flex flex-col items-center justify-center text-center group">
        <div class="relative z-10 w-full">
          <div class="flex flex-col items-center gap-6 mb-12">
            <div class="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-glow animate-pulse-slow">
              <Heart class="w-10 h-10" />
            </div>
            <div>
              <h2 class="text-5xl font-black text-white tracking-tighter italic">Apoya el Ecosistema</h2>
              <p class="text-xs font-black text-primary uppercase tracking-[0.5em] mt-2">Impulsando la Educación con IA</p>
            </div>
          </div>
          
          <div class="flex flex-col items-center gap-10">
            <div class="relative group/qr">
              <div class="relative p-8 bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(255,255,255,0.15)] transition-all duration-700 group-hover/qr:scale-110">
                <img 
                  :src="qrImage" 
                  alt="QR Pago" 
                  class="w-72 h-72 md:w-96 md:h-96 object-contain rounded-3xl"
                />
                <!-- Scanning effect -->
                <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-glow"></div>
              </div>
              <!-- Decorative elements around QR -->
              <div class="absolute -inset-8 border border-white/5 rounded-[4rem] pointer-events-none animate-pulse-slow"></div>
              <div class="absolute -inset-16 border border-white/5 rounded-[5rem] pointer-events-none animate-pulse-slow" style="animation-delay: 1s"></div>
            </div>

            <div class="space-y-6">
              <div class="inline-flex items-center gap-4 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                <ShieldCheck class="w-5 h-5 text-primary" />
                <span class="text-xs font-black text-white/70 uppercase tracking-widest">Escaneo Seguro Nequi / Bre-B</span>
              </div>
              <h3 class="text-3xl font-black text-white tracking-tight italic">Usa tu Wallet Preferida</h3>
              
              <!-- New Copy Button for the number -->
              <div class="flex justify-center mt-4">
                <button 
                  @click="copyToClipboard"
                  class="group flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all active:scale-95"
                >
                  <div class="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                    <component :is="isCopied ? Check : Copy" class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-[8px] font-black text-white/40 uppercase tracking-widest text-left">Copiar Número</p>
                    <p class="text-lg font-black text-white tracking-widest">{{ paymentKey }}</p>
                  </div>
                  <div v-if="isCopied" class="ml-4 text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-fade-in">¡Listo!</div>
                </button>
              </div>

              <p class="text-white/40 font-medium text-lg max-w-md mx-auto italic">
                Tu aporte directo permite que nuestras neuronas digitales sigan evolucionando para ti de forma independiente.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Background decorative text -->
        <div class="absolute top-10 right-10 text-9xl font-black text-white/[0.03] pointer-events-none select-none tracking-tighter italic">DONATE</div>
      </div>

      <!-- Feedback Card -->
      <div class="lg:col-span-2 bg-bg-card border border-white/10 rounded-[3.5rem] p-12 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
        <div class="relative z-10">
          <div class="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-primary mb-10 border border-white/10 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <MessageCircle class="w-8 h-8" />
          </div>
          <h2 class="text-4xl font-black text-white tracking-tight italic mb-6">Propuestas <br /> de Mejora</h2>
          <p class="text-sm font-medium text-white/40 leading-relaxed mb-8">
            ¿Tienes una idea para potenciar MentorIA? Escríbenos directamente para implementar tus sugerencias en el ecosistema.
          </p>
          
          <div class="space-y-6 mb-10">
            <div class="flex items-center gap-3 text-white/60">
              <div class="w-2.5 h-2.5 bg-primary rounded-full shadow-glow"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">iamentorsoft@gmail.com</span>
            </div>
            <div class="flex items-center gap-3 text-white/60">
              <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-glow"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.2em]">Soporte WhatsApp Activo</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4 relative z-10">
          <a 
            href="https://wa.me/573015997188?text=Hola%20equipo%20de%20MentorIA,%20tengo%20una%20propuesta%20de%20mejora%20para%20el%20software:" 
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
        <div class="absolute -bottom-10 -right-10 text-8xl font-black text-white/[0.02] pointer-events-none select-none tracking-tighter italic uppercase">Suggest</div>
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
