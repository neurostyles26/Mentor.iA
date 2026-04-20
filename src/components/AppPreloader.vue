<script setup>
import { BrainCircuit, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-bg-deep flex flex-col items-center justify-center overflow-hidden">
    <!-- Background Glows -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" style="animation-delay: 2s"></div>
    </div>

    <!-- Central Branding -->
    <div class="relative z-10 flex flex-col items-center gap-8">
      <div class="relative group">
        <!-- Orbiting ring -->
        <div class="absolute inset-[-15px] border-2 border-primary/20 rounded-[2rem] animate-spin-slow"></div>
        <div class="absolute inset-[-15px] border-t-2 border-primary rounded-[2rem] animate-spin-slow shadow-glow"></div>
        
        <div class="w-20 h-20 md:w-24 md:h-24 bg-bg-card border border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-premium relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-12 h-12 md:w-16 md:h-16 object-contain animate-neural-pulse relative z-10" />
        </div>
      </div>

      <div class="text-center space-y-3">
        <h2 class="text-4xl font-black text-white tracking-widest uppercase animate-fade-in-slow">MentorIA</h2>
        <div class="flex items-center justify-center gap-3">
          <div class="flex gap-1.5">
            <div v-for="i in 3" :key="i" 
              class="w-1.5 h-1.5 rounded-full bg-primary/40 animate-loading-dot"
              :style="{ animationDelay: `${(i-1) * 0.2}s` }"
            ></div>
          </div>
          <p class="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">Sincronizando Neuronas</p>
        </div>
      </div>
    </div>

    <!-- Bottom Tech Info -->
    <div class="absolute bottom-12 flex flex-col items-center gap-4 text-white/10 animate-fade-in-up">
      <div class="flex items-center gap-3">
        <Sparkles class="w-4 h-4" />
        <p class="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Suite v2.5</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 6s linear infinite;
}

.animate-neural-pulse {
  animation: neuralPulse 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse 4s ease-in-out infinite;
}

.animate-loading-dot {
  animation: dotPulse 1.4s ease-in-out infinite;
}

.animate-fade-in-slow {
  animation: fadeIn 1.5s ease-out forwards;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes neuralPulse {
  0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0px var(--color-primary)); }
  50% { transform: scale(1.1); filter: brightness(1.5) drop-shadow(0 0 20px var(--color-primary)); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.5); opacity: 1; background-color: var(--color-primary); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
}
</style>
