<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { useAuthStore } from '../store/auth'
import { 
  Plus, 
  MoreVertical, 
  BookOpen, 
  ArrowRight, 
  BrainCircuit,
  Sparkles,
  Search,
  Zap,
  Clock
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

onMounted(() => {
  courseStore.fetchCourses()
})

const courses = computed(() => courseStore.courses)

const handleViewCourse = (course) => {
  courseStore.selectCourse(course)
  router.push('/editor')
}

const navigateToCreate = () => {
  router.push('/dashboard/create')
}

// Get initials for profile/courses
const getInitials = (name) => {
  return (name || 'C').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<template>
  <div class="space-y-12 animate-fade-in max-w-7xl mx-auto">
    <!-- Hero Greeting -->
    <section class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div class="space-y-3">
        <h1 class="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
          Hola, <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ authStore.displayName }}</span>
        </h1>
        <p class="text-white/70 font-bold text-lg lg:text-xl max-w-xl">
          ¿Qué vamos a transformar hoy en el ecosistema educativo?
        </p>
      </div>
      
      <button 
        @click="navigateToCreate"
        class="flex items-center justify-center gap-4 px-10 py-6 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-1 active:scale-95 group overflow-hidden relative"
      >
        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
        <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform relative z-10" />
        <span class="relative z-10">Nueva Experiencia IA</span>
      </button>
    </section>

    <!-- Content Grid -->
    <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="glass-panel p-8 flex flex-col group cursor-pointer hover:border-primary/40 hover:bg-white/5 transition-all duration-500 relative overflow-hidden"
        @click="handleViewCourse(course)"
      >
        <!-- Card Background Glow -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div class="flex items-start justify-between mb-10 relative z-10">
          <div :class="`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color || 'from-primary to-secondary'} flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 font-black text-xl border border-white/20` ">
            {{ getInitials(course.name) }}
          </div>
          <button class="p-2 text-white/50 hover:text-primary transition-colors">
            <MoreVertical class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1 relative z-10">
          <h3 class="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors tracking-tight line-clamp-1 italic">{{ course.name }}</h3>
          <div class="flex items-center gap-3 mb-8">
            <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">{{ course.grade }}</span>
            <span class="text-[9px] font-black text-white/60 uppercase tracking-widest flex items-center gap-1">
              <Clock class="w-3 h-3" /> Hace 2 días
            </span>
          </div>
          
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span class="text-white/60">Progreso Curricular</span>
              <span class="text-primary">{{ course.progress || 0 }}%</span>
            </div>
            <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0 border border-white/5">
              <div 
                class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 shadow-glow"
                :style="{ width: `${course.progress || 0}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
               <BookOpen class="w-4 h-4 text-primary" />
            </div>
            <span class="text-[10px] font-black text-white/70 uppercase tracking-widest">{{ course.classes_count || 0 }} Piezas</span>
          </div>
          <button class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform">
            Entrar
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Quick Add Card -->
      <div 
        @click="navigateToCreate"
        class="border-4 border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 relative overflow-hidden h-full min-h-[350px]"
      >
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
        <div class="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-glow relative z-10">
          <Plus class="w-10 h-10 text-white/50 group-hover:text-white" />
        </div>
        <h4 class="text-xl font-black text-white/20 group-hover:text-white mb-2 transition-colors relative z-10 uppercase tracking-tighter">Nueva Asignatura</h4>
        <p class="text-[10px] text-white/40 uppercase tracking-widest font-black relative z-10">Impulsado por Gemini 2.5</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 flex flex-col items-center text-center animate-slide-up bg-white/2 rounded-[3.5rem] border border-white/5 border-dashed">
      <div class="w-40 h-40 bg-primary/5 rounded-[3.5rem] flex items-center justify-center mb-10 relative">
        <div class="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
        <BrainCircuit class="w-20 h-20 text-primary relative z-10" />
      </div>
      <h2 class="text-4xl font-black text-white mb-4 tracking-tighter">Tu Biblioteca está vacía</h2>
      <p class="text-white/60 font-bold text-lg max-w-md mb-12">
        Aún no has creado ningún curso. El **Mentor IA** te ayudará a preparar clases innovadoras en cuestión de segundos.
      </p>
      <button 
        @click="navigateToCreate"
        class="px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all active:scale-95 group"
      >
        Crear mi primer curso
        <Plus class="inline-block ml-3 w-5 h-5 group-hover:rotate-90 transition-transform" />
      </button>
    </div>

    <!-- Stats Section -->
    <div class="glass-panel p-12 text-white overflow-hidden relative shadow-premium mt-12 group border-primary/20 bg-gradient-to-br from-bg-card to-primary/5">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[100px] -mr-48 -mt-48 group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div class="flex-1 space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
              <Zap class="w-6 h-6 text-white" />
            </div>
            <h2 class="text-3xl font-black italic tracking-tighter">Impacto Pedagógico</h2>
          </div>
          <p class="text-white/70 font-bold text-lg leading-relaxed max-w-xl">
            Tu ecosistema ha procesado lecciones que impactan al <span class="text-primary">92%</span> de tus objetivos curriculares este periodo.
          </p>
        </div>
        
        <div class="flex gap-16">
          <div class="text-center group-hover:scale-110 transition-transform duration-500">
            <p class="text-6xl font-black text-white mb-2 tracking-tighter">+8</p>
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Lecciones Activas</p>
          </div>
          <div class="h-20 w-px bg-white/10 hidden md:block"></div>
          <div class="text-center group-hover:scale-110 transition-transform duration-500">
            <p class="text-6xl font-black text-secondary mb-2 tracking-tighter">24%</p>
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Más Eficiencia</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
