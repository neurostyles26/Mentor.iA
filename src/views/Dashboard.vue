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
  Clock,
  Globe,
  Wand2,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Zap,
  TrendingUp,
  ChevronRight
} from 'lucide-vue-next'
import SponsorCard from '../components/SponsorCard.vue'

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

const getInitials = (name) => {
  return (name || 'C').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const premiumSponsors = [
  {
    title: 'Canva Education',
    desc: 'Crea recursos visuales asombrosos para tus clases con IA.',
    icon: Palette,
    url: 'https://canva.com',
    color: 'from-blue-400 to-emerald-400'
  },
  {
    title: 'Digital Ocean',
    desc: 'Despliegue escalable para tus proyectos de educación online.',
    icon: Globe,
    url: 'https://digitalocean.com',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    title: 'Adobe Express',
    desc: 'Diseño rápido impulsado por IA para contenidos educativos.',
    icon: ImageIcon,
    url: 'https://adobe.com/express',
    color: 'from-red-500 to-orange-500'
  }
]
</script>

<template>
  <div class="space-y-16 animate-page-in max-w-7xl mx-auto pb-20">
    <!-- Hero Greeting -->
    <header class="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-bg-card to-transparent border border-white/5 p-10 lg:p-16">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary">
            <Sparkles class="w-4 h-4" />
            <span class="text-[9px] font-black uppercase tracking-[0.3em]">Plataforma Elite v2.5</span>
          </div>
          <h1 class="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] italic">
            Hola, <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ authStore.displayName }}</span>
          </h1>
          <p class="text-white/50 font-medium text-lg lg:text-xl max-w-xl">
            ¿Qué vamos a transformar hoy en el ecosistema educativo?
          </p>
        </div>
        
        <button 
          @click="navigateToCreate"
          class="relative group px-10 py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(var(--color-primary-rgb),0.5)] hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 overflow-hidden"
        >
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
          <div class="flex items-center gap-4 relative z-10">
            <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform" />
            <span>Nueva Experiencia IA</span>
          </div>
        </button>
      </div>
    </header>

    <!-- Content Grid -->
    <div class="space-y-8">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-3">
          <BookOpen class="w-4 h-4 text-primary" /> Mis Asignaturas
        </h2>
        <div class="h-px bg-white/5 flex-1 ml-6"></div>
      </div>

      <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="group relative p-8 bg-white/2 border border-white/5 rounded-[3rem] hover:border-primary/40 transition-all duration-700 overflow-hidden cursor-pointer"
          @click="handleViewCourse(course)"
        >
          <!-- Card Background Decor -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

          <div class="flex items-start justify-between mb-12 relative z-10">
            <div :class="`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${course.color || 'from-primary to-secondary'} flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 font-black text-2xl border border-white/20` ">
              {{ getInitials(course.name) }}
            </div>
            <button class="p-2 text-white/20 hover:text-primary transition-colors">
              <MoreVertical class="w-6 h-6" />
            </button>
          </div>

          <div class="relative z-10 space-y-6">
            <div>
              <h3 class="text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tighter leading-none mb-3 italic line-clamp-1">{{ course.name }}</h3>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-primary uppercase tracking-widest">{{ course.grade }}</span>
                <div class="flex items-center gap-1.5 text-[8px] font-black text-white/40 uppercase tracking-widest">
                  <Clock class="w-3 h-3" /> Hace 2 días
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                <span class="text-white/30">Progreso Curricular</span>
                <span class="text-primary">{{ course.progress || 0 }}%</span>
              </div>
              <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0">
                <div 
                  class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                  :style="{ width: `${course.progress || 0}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                 <BookOpen class="w-4 h-4 text-white/40" />
              </div>
              <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">{{ course.classes_count || 0 }} Piezas</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:translate-x-2 transition-transform">
              Gestionar <ChevronRight class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Quick Add Card -->
        <div 
          @click="navigateToCreate"
          class="border-4 border-dashed border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-700 relative overflow-hidden min-h-[350px]"
        >
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
          <div class="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-glow relative z-10">
            <Plus class="w-10 h-10 text-white/20 group-hover:text-white" />
          </div>
          <h4 class="text-2xl font-black text-white/20 group-hover:text-white mb-2 transition-colors relative z-10 italic tracking-tighter">Nueva Asignatura</h4>
          <p class="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black relative z-10">Expandir mi Ecosistema</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-24 flex flex-col items-center text-center bg-white/2 rounded-[4rem] border border-white/5 border-dashed">
        <div class="w-48 h-48 bg-primary/5 rounded-[4rem] flex items-center justify-center mb-12 relative animate-float">
          <div class="absolute inset-0 bg-primary/20 blur-[80px] rounded-full scale-150 animate-pulse-slow"></div>
          <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-24 h-24 object-contain relative z-10" />
        </div>
        <h2 class="text-5xl font-black text-white mb-6 tracking-tighter italic">Tu Biblioteca está en blanco</h2>
        <p class="text-white/60 font-medium text-xl max-w-md mb-12">
          Comienza tu viaje pedagógico asistido por IA. El Mentor está listo para colaborar contigo.
        </p>
        <button 
          @click="navigateToCreate"
          class="px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all active:scale-95 group"
        >
          Crear mi primer curso
          <Plus class="inline-block ml-3 w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="relative overflow-hidden rounded-[4rem] bg-bg-card border border-primary/20 p-12 lg:p-16 shadow-[0_0_80px_-20px_rgba(var(--color-primary-rgb),0.3)]">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 blur-[120px] -mr-48 -mt-48"></div>
      
      <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div class="flex-1 space-y-6">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 shadow-glow">
              <TrendingUp class="w-7 h-7 text-primary" />
            </div>
            <h2 class="text-4xl font-black italic tracking-tighter text-white">Impacto Pedagógico</h2>
          </div>
          <p class="text-white/60 font-medium text-lg leading-relaxed max-w-xl">
            Tu ecosistema ha procesado lecciones que impactan al <span class="text-primary font-black">92%</span> de tus objetivos curriculares este periodo.
          </p>
        </div>
        
        <div class="flex gap-20">
          <div class="text-center">
            <p class="text-7xl font-black text-white mb-2 tracking-tighter italic">+8</p>
            <p class="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Lecciones Activas</p>
          </div>
          <div class="h-24 w-px bg-white/10 hidden md:block"></div>
          <div class="text-center">
            <p class="text-7xl font-black text-secondary mb-2 tracking-tighter italic">24%</p>
            <p class="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Más Eficiencia</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsor Spotlight -->
    <section class="space-y-10">
      <div class="flex items-center justify-between px-2">
        <h2 class="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] flex items-center gap-3">
          <Sparkles class="w-4 h-4 text-primary" /> Sponsor Spotlight
        </h2>
        <div class="h-px bg-white/5 flex-1 ml-6"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SponsorCard 
          v-for="sponsor in premiumSponsors" 
          :key="sponsor.title"
          :title="sponsor.title"
          :description="sponsor.desc"
          :icon="sponsor.icon"
          :url="sponsor.url"
          :color="sponsor.color"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-page-in {
  animation: pageIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

.shadow-glow {
  box-shadow: 0 0 40px -10px var(--color-primary-glow);
}
</style>
