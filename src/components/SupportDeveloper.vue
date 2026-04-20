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
  ExternalLink
} from 'lucide-vue-next'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const donationLinks = [
  { 
    name: 'PayPal', 
    desc: 'Donación global instantánea', 
    icon: Globe, 
    color: 'from-blue-500 to-indigo-600',
    url: 'https://paypal.me/yourusername' // Placeholder
  },
  { 
    name: 'Buy Me a Coffee', 
    desc: 'Apoyo puntual y directo', 
    icon: Coffee, 
    color: 'from-yellow-500 to-orange-600',
    url: 'https://buymeacoffee.com/yourusername' // Placeholder
  },
  { 
    name: 'Patreon', 
    desc: 'Membresía para mecenas', 
    icon: Sparkles, 
    color: 'from-red-500 to-pink-600',
    url: 'https://patreon.com/yourusername' // Placeholder
  }
]
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

          <!-- Donation Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              v-for="link in donationLinks" 
              :key="link.name"
              :href="link.url"
              target="_blank"
              class="group relative p-6 bg-white/2 border border-white/5 rounded-3xl hover:border-primary/40 transition-all duration-500 overflow-hidden text-left"
            >
              <div :class="['w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all', link.color]">
                <component :is="link.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-lg font-black text-white tracking-tight mb-2 flex items-center gap-2">
                {{ link.name }}
                <ChevronRight class="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p class="text-[10px] font-black text-white/70 uppercase tracking-widest leading-relaxed">{{ link.desc }}</p>
            </a>
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
