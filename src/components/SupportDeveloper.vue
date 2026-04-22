<script setup>
import { 
  X, 
  Heart, 
  Coffee, 
  Sparkles, 
  Zap, 
  Cpu, 
  Globe,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-vue-next'

import { ref } from 'vue'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const qrImage = '/Mnetoria-qrnequi.jpeg'
const paymentKey = '312 456 7890' // Optional key if they still want to copy it
const isCopied = ref(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(paymentKey)
  isCopied.value = true
  setTimeout(() => isCopied.value = false, 2000)
}
</script>

<template>
  <Transition name="modal-bounce">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-2xl bg-bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden animate-modal-in">
        <!-- Animated Background Decor -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
          <div class="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 rounded-full blur-[100px] animate-pulse"></div>
          <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
        </div>

        <!-- Header -->
        <header class="relative p-10 pb-0 flex justify-between items-start">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary">
              <Heart class="w-4 h-4 animate-pulse" />
              <span class="text-[10px] font-black uppercase tracking-[0.3em]">Impulsar Ecosistema</span>
            </div>
            <h2 class="text-4xl font-black text-white tracking-tighter leading-tight italic">
              Trascendamos <br />
              <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">juntos la educación</span>
            </h2>
          </div>
          <button @click="$emit('close')" class="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
            <X class="w-6 h-6" />
          </button>
        </header>

        <!-- Body -->
        <div class="relative p-10 space-y-10">
          <p class="text-white/90 font-bold text-lg leading-relaxed">
            MentorIA es un proyecto independiente nacido para empoderar a los docentes. Tu apoyo directo permite que las neuronas digitales sigan evolucionando.
          </p>

          <div class="flex flex-col items-center gap-8">
            <div class="relative p-4 bg-white rounded-[2rem] shadow-2xl group">
              <img 
                :src="qrImage" 
                alt="QR Pago Nequi/Bre-B" 
                class="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 border-2 border-primary/20 rounded-[2rem] pointer-events-none group-hover:border-primary/50 transition-colors"></div>
            </div>

            <div class="text-center space-y-4">
              <h3 class="text-2xl font-black text-white tracking-tight italic">Escanea para apoyar</h3>
              <p class="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] max-w-[280px]">
                Usa Nequi o cualquier App con Bre-B para escanear el código y ayudarnos a mantener MentorIA.
              </p>
              
              <button 
                @click="copyToClipboard"
                class="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <template v-if="isCopied">
                  <Check class="w-4 h-4 text-emerald-400" /> ¡Copiado!
                </template>
                <template v-else>
                  <Copy class="w-4 h-4" /> Copiar Número: {{ paymentKey }}
                </template>
              </button>
            </div>
          </div>

          <!-- Bottom Info -->
          <div class="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-center gap-8 group">
            <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0 group-hover:rotate-12 transition-transform">
               <Zap class="w-8 h-8 text-primary shadow-glow" />
            </div>
            <div>
              <p class="text-xs text-white underline mb-1 font-black cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
                Ver Road Map 2026 <ExternalLink class="w-3 h-3" />
              </p>
              <p class="text-[9px] font-black text-white/70 uppercase tracking-widest leading-relaxed">Cada donación acelera el despliegue de nuevos motores neuronales.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="p-6 bg-white/2 border-t border-white/5 flex items-center justify-center gap-4">
           <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full bg-white/10"></div>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-bounce-enter-active { animation: bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-bounce-leave-active { animation: bounceIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) reverse; }

@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

.shadow-glow {
  box-shadow: 0 0 30px -5px var(--color-primary-glow);
}
</style>
