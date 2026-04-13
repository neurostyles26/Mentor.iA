<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, ArrowRight, BrainCircuit, ClipboardList, Zap } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-bg-deep selection:bg-primary/30">
    <!-- Nav -->
    <nav class="container mx-auto px-6 py-8 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <BrainCircuit class="text-white" :size="24" />
        </div>
        <span class="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">MentorIA</span>
      </div>
      
      <div class="flex gap-4">
        <button @click="router.push('/auth')" class="text-text-muted hover:text-white transition-colors">Entrar</button>
        <button @click="router.push('/auth?signup=true')" class="btn-primary">Crear cuenta</button>
      </div>
    </nav>

    <!-- Hero -->
    <main class="container mx-auto px-6 pt-20 pb-32 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
        <Sparkles :size="14" />
        <span class="text-sm font-medium">Gemma 4 Potenciado</span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
        Tu asistente inteligente para <br />
        <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">una enseñanza sin límites</span>
      </h1>
      
      <p class="text-xl text-text-muted max-w-2xl mx-auto mb-12">
        MentorIA ayuda a docentes colombianos a generar contenido educativo de alta calidad en segundos. 
        Chatea con la IA, guarda fragmentos y organiza tu material.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-24">
        <button @click="router.push('/auth')" class="btn-primary px-8 py-4 text-lg">
          Empezar ahora <ArrowRight :size="20" />
        </button>
        <button class="btn-outline px-8 py-4 text-lg">
          Ver demostración
        </button>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="glass-panel p-8 text-left hover:border-primary/30 transition-all duration-300 group">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Zap class="text-primary" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Generación Veloz</h3>
          <p class="text-text-muted leading-relaxed">Exámenes, planes de clase y actividades listos en segundos con la potencia de Gemma 4.</p>
        </div>

        <div class="glass-panel p-8 text-left hover:border-secondary/30 transition-all duration-300 group">
          <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ClipboardList class="text-secondary" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Portapapeles Inteligente</h3>
          <p class="text-text-muted leading-relaxed">Guarda las mejores respuestas directamente en tu panel personal para usarlas luego.</p>
        </div>

        <div class="glass-panel p-8 text-left hover:border-accent/30 transition-all duration-300 group">
          <div class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BrainCircuit class="text-accent" />
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Contexto Local</h3>
          <p class="text-text-muted leading-relaxed">Entrenado para alinearse con los Derechos Básicos de Aprendizaje (DBA) de Colombia.</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-12 text-center text-text-muted text-sm">
      <p>© 2026 MentorIA. Hecho para docentes, potenciado por IA.</p>
    </footer>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
