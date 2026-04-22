<script setup>
import { 
  X, 
  Heart, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-vue-next'

import { ref } from 'vue'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const qrImage = '/Mnetoria-qrnequi.jpeg'
const paymentKey = '312 456 7890'
const isCopied = ref(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(paymentKey)
  isCopied.value = true
  setTimeout(() => isCopied.value = false, 2000)
}
</script>

<template>
  <Transition name="modal-premium">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <!-- Backdrop with stronger blur -->
      <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-3xl bg-bg-card rounded-[3rem] border border-white/10 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
        
        <!-- Left Side: Visual/QR -->
        <div class="relative w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary-rgb),0.15),transparent_70%)]"></div>
          </div>

          <div class="relative z-10 group cursor-pointer">
            <div class="relative p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(255,255,255,0.1)] transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2">
              <img 
                :src="qrImage" 
                alt="QR Pago" 
                class="w-56 h-56 md:w-72 md:h-72 object-contain rounded-2xl"
              />
              <!-- Scanning effect line -->
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan"></div>
            </div>
            <!-- Decorative rings -->
            <div class="absolute -inset-4 border border-white/5 rounded-[3rem] animate-pulse-slow"></div>
            <div class="absolute -inset-8 border border-white/5 rounded-[3.5rem] animate-pulse-slow" style="animation-delay: 1s"></div>
          </div>

          <div class="mt-10 text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
              <ShieldCheck class="w-3.5 h-3.5 text-primary" />
              <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Pago Seguro y Directo</span>
            </div>
            <h3 class="text-xl font-black text-white tracking-tight italic">Escanea con tu Wallet</h3>
          </div>
        </div>

        <!-- Right Side: Info & Actions -->
        <div class="relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-8">
          <header class="space-y-4">
            <div class="flex justify-between items-start">
               <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
                <Heart class="w-4 h-4" />
                <span class="text-[9px] font-black uppercase tracking-[0.3em]">Impulsar MentorIA</span>
              </div>
              <button @click="$emit('close')" class="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white lg:hidden">
                <X class="w-5 h-5" />
              </button>
            </div>
            <h2 class="text-4xl font-black text-white tracking-tighter leading-[0.9] italic">
              Trasciende <br />
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">la educación</span>
            </h2>
          </header>

          <p class="text-white/70 font-medium text-sm leading-relaxed">
            MentorIA es una plataforma independiente. Tu apoyo permite mantener la infraestructura y seguir creando herramientas de IA gratuitas para docentes.
          </p>

          <div class="space-y-4">
             <button 
              @click="copyToClipboard"
              class="w-full group relative flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-primary/40 active:scale-[0.98]"
            >
              <div class="flex items-center gap-4 text-left">
                <div class="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <component :is="isCopied ? Check : Copy" class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Copiar número Nequi</p>
                  <p class="text-sm font-black text-white tracking-tight">{{ paymentKey }}</p>
                </div>
              </div>
              <div v-if="isCopied" class="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-fade-in">¡Copiado!</div>
              <ChevronRight v-else class="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
            </button>

            <div class="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
               <Zap class="w-6 h-6 text-primary shrink-0 mt-1" />
               <p class="text-[10px] font-bold text-white/60 leading-relaxed italic">
                 "Cada aporte es una neurona más para nuestra IA. Gracias por ser parte de este ecosistema."
               </p>
            </div>
          </div>

          <button 
            @click="$emit('close')"
            class="hidden lg:block absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/20 hover:text-white"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-premium-enter-active { animation: premiumIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-premium-leave-active { animation: premiumIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) reverse; }

@keyframes premiumIn {
  from { opacity: 0; transform: scale(0.95) translateY(30px); filter: blur(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(320px); opacity: 0; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
