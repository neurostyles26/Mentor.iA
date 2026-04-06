<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'

const router = useRouter()
const courseStore = useCourseStore()

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
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-dark tracking-tight mb-2">Panel de Control</h1>
        <p class="text-gray-500 font-semibold text-lg">Bienvenido de nuevo, ¿qué enseñaremos hoy?</p>
      </div>
      <button 
        @click="navigateToCreate"
        class="flex items-center gap-3 px-8 py-5 bg-dark text-white rounded-[2rem] font-bold text-lg shadow-premium hover:bg-primary transition-all duration-300 active:scale-95 group"
      >
        <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        Crear nuevo curso
      </button>
    </div>

    <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="premium-card p-8 flex flex-col group cursor-pointer hover:-translate-y-2 transition-all duration-500"
        @click="handleViewCourse(course)"
      >
        <div class="flex items-start justify-between mb-8">
          <div :class="`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${course.color || 'from-primary to-blue-400'} flex items-center justify-center text-white shadow-soft group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 font-bold text-2xl` ">
            {{ (course.name || 'C')[0] }}
          </div>
          <button class="p-2 text-gray-400 hover:text-dark transition-colors">
            <MoreVertical class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1">
          <h3 class="text-2xl font-black text-dark mb-1 group-hover:text-primary transition-colors">{{ course.name }}</h3>
          <p class="text-gray-400 font-bold text-sm uppercase tracking-widest mb-6">{{ course.grade }}</p>
          
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold text-gray-400">Progreso Curricular</span>
            <span class="text-sm font-black text-dark">{{ course.progress || 0 }}%</span>
          </div>
          <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 p-0.5 border border-gray-50">
            <div 
              class="h-full bg-gradient-to-r rounded-full transition-all duration-1000"
              :class="(course.color || '').includes('secondary') ? 'from-secondary to-green-400' : 'from-primary to-blue-400'"
              :style="{ width: `${course.progress || 0}%` }"
            ></div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-50">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
               <BookOpen class="w-4 h-4 text-gray-400" />
            </div>
            <span class="text-sm font-bold text-gray-500">{{ course.classes_count || 0 }} Lecciones</span>
          </div>
          <button class="flex items-center gap-2 text-primary font-black group-hover:translate-x-2 transition-transform">
            Gestionar
            <ArrowRight class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Quick Add Card -->
      <div 
        @click="navigateToCreate"
        class="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm relative z-10">
          <Plus class="w-10 h-10 text-gray-400 group-hover:text-white" />
        </div>
        <h4 class="text-xl font-black text-gray-400 group-hover:text-primary mb-2 transition-colors relative z-10 uppercase tracking-tighter">Nueva Asignatura</h4>
        <p class="text-sm text-gray-400 font-bold relative z-10">Expande tu currículo con IA.</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 flex flex-col items-center text-center animate-slide-up">
      <div class="w-40 h-40 bg-primary/5 rounded-[3.5rem] flex items-center justify-center mb-10 relative">
        <div class="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <BrainCircuit class="w-20 h-20 text-primary relative z-10" />
      </div>
      <h2 class="text-4xl font-black text-dark mb-4 tracking-tighter">Tu Biblioteca está lista</h2>
      <p class="text-xl text-gray-400 font-medium max-w-md mb-12">
        Aún no has creado ningún curso. Deja que el **IA Mentor** te ayude a preparar tus clases en segundos.
      </p>
      <button 
        @click="navigateToCreate"
        class="px-12 py-6 bg-dark text-white rounded-[2.5rem] font-black text-xl shadow-premium hover:bg-primary hover:-translate-y-2 transition-all active:scale-95 group"
      >
        Crear mi primer curso
        <Plus class="inline-block ml-2 group-hover:rotate-90 transition-transform" />
      </button>
    </div>

    <!-- Impact Snapshot -->
    <div class="bg-dark rounded-[3.5rem] p-12 text-white overflow-hidden relative shadow-premium mt-12 group">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[100px] -mr-48 -mt-48 group-hover:scale-150 transition-transform duration-1000"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-20 blur-[80px] -ml-32 -mb-32 group-hover:scale-110 transition-transform duration-1000"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="flex-1">
          <h2 class="text-3xl font-black mb-4">Impacto Educativo</h2>
          <p class="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
            Tus clases generadas con IA han ayudado a que el 85% de tus estudiantes superen sus retos académicos este mes.
          </p>
        </div>
        <div class="flex gap-10">
          <div class="text-center">
            <p class="text-5xl font-black text-white mb-2">+124</p>
            <p class="text-sm font-bold uppercase tracking-widest text-primary">Lecciones</p>
          </div>
          <div class="h-16 w-px bg-white/10 hidden md:block"></div>
          <div class="text-center">
            <p class="text-5xl font-black text-secondary mb-2">92%</p>
            <p class="text-sm font-bold uppercase tracking-widest text-white/50">Engagement</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
