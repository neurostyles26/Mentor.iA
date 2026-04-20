<script setup>
import { 
  ExternalLink, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-vue-next'

defineProps({
  title: String,
  description: String,
  icon: Object, // Lucide component
  tag: String,
  url: String,
  color: {
    type: String,
    default: 'from-primary/20 to-secondary/20'
  }
})
</script>

<template>
  <a 
    :href="url" 
    target="_blank" 
    class="glass-panel group p-6 flex flex-col justify-between hover:border-primary/40 transition-all duration-700 relative overflow-hidden"
  >
    <!-- Native Ad Badge -->
    <div class="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
       <span class="text-[7px] font-black uppercase tracking-[0.2em] text-white/40">Sponsor</span>
    </div>

    <div>
      <div :class="['w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform border border-white/5', color]">
        <component :is="icon" class="w-7 h-7 text-white" />
      </div>
      <h3 class="text-xl font-black text-white tracking-tight mb-2 group-hover:text-primary transition-colors">{{ title }}</h3>
      <p class="text-[11px] font-bold text-white/50 leading-relaxed">{{ description }}</p>
    </div>

    <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
      <span class="text-[9px] font-black text-primary uppercase tracking-[0.3em] group-hover:translate-x-1 transition-transform">Explorar Herramienta</span>
      <ArrowUpRight class="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
    </div>

    <!-- Animated Shine Effect -->
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
  </a>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}
</style>
