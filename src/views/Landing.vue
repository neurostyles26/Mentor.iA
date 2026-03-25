<script setup>
import { useRouter } from 'vue-router'
import { 
  BrainCircuit, 
  Sparkles, 
  BookOpen, 
  Users, 
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-vue-next'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary/30">
    <!-- Navigation Bar -->
    <nav class="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100 px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/')">
        <div class="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
          <BrainCircuit class="w-7 h-7 text-primary" />
        </div>
        <span class="text-2xl font-black text-dark tracking-tighter uppercase">MentorIA</span>
      </div>
      
      <div class="hidden md:flex items-center gap-10">
        <a href="#features" class="text-sm font-bold text-gray-400 hover:text-dark transition-colors uppercase tracking-widest">Características</a>
        <a href="#vision" class="text-sm font-bold text-gray-400 hover:text-dark transition-colors uppercase tracking-widest">Visión</a>
        <button 
          @click="navigateToLogin"
          class="px-8 py-3 bg-dark text-white rounded-2xl font-bold text-sm shadow-premium hover:bg-primary transition-all active:scale-95"
        >
          Acceso Docente
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-32 px-8 overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div class="max-w-6xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-gray-100 shadow-soft mb-8 animate-fade-in">
          <Sparkles class="w-4 h-4 text-primary" />
          <span class="text-xs font-black text-dark uppercase tracking-widest">La Evolución del Aula ya está aquí</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-dark leading-tight tracking-tighter mb-10 max-w-5xl mx-auto">
          El Co-piloto de <span class="text-primary italic">IA</span> diseñado para <span class="text-secondary border-b-8 border-secondary/20">Docentes</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12">
          Libera tu potencial pedagógico. Prepara clases en segundos, genera contenidos de alto impacto y personaliza el aprendizaje para cada estudiante.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            @click="navigateToLogin"
            class="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black text-xl shadow-premium hover:shadow-primary/40 hover:-translate-y-2 transition-all active:scale-95 group"
          >
            Empezar a innovar gratis
            <ArrowRight class="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
          <button class="w-full sm:w-auto px-12 py-6 bg-white border-2 border-gray-100 text-dark rounded-[2.5rem] font-black text-xl hover:bg-gray-50 transition-all active:scale-95">
            Ver Demo
          </button>
        </div>
      </div>
    </section>

    <!-- App Preview Mockup -->
    <section class="px-8 pb-32">
      <div class="max-w-6xl mx-auto">
        <div class="glass p-4 rounded-[4rem] shadow-premium border border-white/40 group overflow-hidden">
           <div class="bg-dark rounded-[3rem] aspect-video overflow-hidden relative shadow-inner">
              <!-- Simulated Dashboard Background -->
              <div class="absolute inset-0 bg-gradient-to-br from-dark to-gray-900 opacity-60"></div>
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent"></div>
              
              <!-- App Interface Elements Overlay -->
              <div class="absolute inset-0 flex items-center justify-center">
                 <div class="w-3/4 h-3/4 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 p-10 flex flex-col gap-8 group-hover:scale-[1.02] transition-transform duration-700">
                    <div class="flex items-center justify-between border-b border-white/10 pb-6">
                       <div class="flex gap-4">
                          <div class="w-4 h-4 rounded-full bg-red-400"></div>
                          <div class="w-4 h-4 rounded-full bg-yellow-400"></div>
                          <div class="w-4 h-4 rounded-full bg-green-400"></div>
                       </div>
                       <div class="px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-white/10">Generador de Syllabus IA</div>
                    </div>
                    <div class="space-y-4">
                       <div class="h-6 w-full bg-white/10 rounded-full"></div>
                       <div class="h-6 w-3/4 bg-white/10 rounded-full"></div>
                       <div class="h-6 w-1/2 bg-primary/40 rounded-full"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-6 mt-4">
                       <div class="h-32 bg-white/5 rounded-3xl border border-white/5"></div>
                       <div class="h-32 bg-white/5 rounded-3xl border border-white/5"></div>
                    </div>
                 </div>
              </div>
              
              <!-- Floating Sparkles -->
              <Sparkles class="absolute top-20 right-20 w-16 h-16 text-primary animate-pulse blur-[1px]" />
           </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-32 px-8 bg-white overflow-hidden relative">
      <div class="max-w-6xl mx-auto">
        <div class="mb-24 text-center">
          <h2 class="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight">Potencia tus habilidades educativas</h2>
          <p class="text-gray-500 font-semibold text-lg max-w-2xl mx-auto">Nuestras herramientas de IA están diseñadas específicamente para cubrir el flujo de trabajo real de un docente.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="premium-card p-12 group hover:bg-dark hover:text-white transition-all duration-500">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
              <BookOpen class="w-8 h-8 text-primary group-hover:text-white" />
            </div>
            <h3 class="text-2xl font-black mb-4">Syllabus Inteligente</h3>
            <p class="text-gray-500 group-hover:text-gray-400 font-medium leading-relaxed mb-8">
              Sube tus archivos PDF o describe tu objetivo y nuestra IA estructurará el curso completo en segundos.
            </p>
            <div class="h-1.5 w-12 bg-primary rounded-full group-hover:w-full transition-all duration-700"></div>
          </div>

          <!-- Feature 2 -->
          <div class="premium-card p-12 group hover:bg-secondary hover:text-white transition-all duration-500">
            <div class="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white transition-colors">
              <Users class="w-8 h-8 text-secondary group-hover:text-secondary" />
            </div>
            <h3 class="text-2xl font-black mb-4">Aprendizaje Adaptativo</h3>
            <p class="text-gray-500 group-hover:text-white/80 font-medium leading-relaxed mb-8">
              Cada estudiante recibe explicaciones personalizadas a través de nuestro IA Tutor de apoyo continuo.
            </p>
            <div class="h-1.5 w-12 bg-secondary rounded-full group-hover:w-full transition-all duration-700"></div>
          </div>

          <!-- Feature 3 -->
          <div class="premium-card p-12 group hover:bg-primary hover:text-white transition-all duration-500">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white transition-colors">
              <Zap class="w-8 h-8 text-primary group-hover:text-primary" />
            </div>
            <h3 class="text-2xl font-black mb-4">Editor Dinámico</h3>
            <p class="text-gray-500 group-hover:text-white/80 font-medium leading-relaxed mb-8">
              Notion-style blocks con funciones de optimización IA: texto, imágenes generadas y quizzes automáticos.
            </p>
            <div class="h-1.5 w-12 bg-primary rounded-full group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-32 px-8 bg-dark text-white relative overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary opacity-10 blur-[150px]"></div>
      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-16 text-center">
          <div>
            <p class="text-6xl font-black text-primary mb-2">95%</p>
            <p class="text-sm font-bold uppercase tracking-widest text-gray-400">Eficiencia Aumentada</p>
          </div>
          <div>
            <p class="text-6xl font-black text-secondary mb-2">+10k</p>
            <p class="text-sm font-bold uppercase tracking-widest text-gray-400">Clases Generadas</p>
          </div>
          <div>
            <p class="text-6xl font-black text-white mb-2">24/7</p>
            <p class="text-sm font-bold uppercase tracking-widest text-gray-400">Soporte IA Tutor</p>
          </div>
          <div>
            <p class="text-6xl font-black text-primary/80 mb-2">100%</p>
            <p class="text-sm font-bold uppercase tracking-widest text-gray-400">Enfocado al Docente</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section id="vision" class="py-40 px-8">
      <div class="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div class="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10">
           <Lightbulb class="w-12 h-12 text-primary" />
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-dark tracking-tighter mb-10 leading-tight">
          Nuestra misión es devolverte el tiempo para lo que más importa: <span class="italic text-primary">Inspirar.</span>
        </h2>
        <p class="text-xl text-gray-500 font-medium leading-relaxed mb-16">
          MentorIA no sustituye al profesor; lo empodera. Eliminamos la carga administrativa y técnica para que puedas concentrarte en el arte de enseñar.
        </p>
        <button 
          @click="navigateToLogin"
          class="px-16 py-8 bg-dark text-white rounded-[2.5rem] font-black text-2xl shadow-premium hover:bg-primary transition-all active:scale-95 shadow-soft"
        >
          Transforma tu aula hoy
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 px-8 border-t border-gray-100 bg-white">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="flex items-center gap-3">
          <BrainCircuit class="w-6 h-6 text-primary" />
          <span class="text-xl font-black text-dark tracking-tighter uppercase">MentorIA</span>
        </div>
        <div class="flex gap-10">
          <a href="#" class="text-sm font-bold text-gray-400 hover:text-dark transition-colors">Twitter</a>
          <a href="#" class="text-sm font-bold text-gray-400 hover:text-dark transition-colors">LinkedIn</a>
          <a href="#" class="text-sm font-bold text-gray-400 hover:text-dark transition-colors">Privacidad</a>
        </div>
        <p class="text-sm font-bold text-gray-300">© 2026 MentorIA. Transformando la educación con IA.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

html {
  scroll-behavior: smooth;
}
</style>
