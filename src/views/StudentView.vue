<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  ArrowLeft, 
  ArrowRight, 
  BrainCircuit, 
  Sparkles,
  X,
  Zap,
  Cpu,
  Clock,
  BookOpen,
  Send
} from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const router = useRouter()
const courseStore = useCourseStore()
const showHelp = ref(false)
const studentQuestion = ref('')
const currentLessonData = ref(null)

onMounted(async () => {
  if (courseStore.currentCourse) {
    await courseStore.fetchLessons(courseStore.currentCourse.id)
    if (courseStore.lessons.length > 0) {
      currentLessonData.value = courseStore.lessons[0]
    }
  }
})

const currentCourse = computed(() => courseStore.currentCourse)
const currentLesson = computed(() => currentLessonData.value || { title: 'Cargando lección...', content: '' })

const handleTutorHelp = () => {
  showHelp.value = true
  courseStore.tutorResponse = null
}

const handleAskTutor = async () => {
  if (!studentQuestion.value) return
  const context = `Lección: ${currentLesson.value.title}. Contenido: ${currentLesson.value.content}`
  await courseStore.askTutor(context, studentQuestion.value)
}

const renderedTutorResponse = computed(() => {
  if (!courseStore.tutorResponse) return ''
  return DOMPurify.sanitize(marked.parse(courseStore.tutorResponse))
})
</script>

<template>
  <div class="min-h-screen bg-bg-deep flex flex-col selection:bg-primary/30">
    <!-- Student Header -->
    <header class="h-24 glass-panel border-x-0 border-t-0 rounded-none px-6 lg:px-12 flex items-center justify-between sticky top-0 z-[60] backdrop-blur-2xl">
      <div class="flex items-center gap-6 lg:gap-8">
        <button @click="router.back()" class="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all active:scale-95 group">
          <ArrowLeft class="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
        </button>
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
             <div class="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
             <span class="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/80">Sesión en Curso</span>
          </div>
          <h1 class="text-xl lg:text-2xl font-black text-white tracking-tighter truncate max-w-md italic">{{ currentLesson.title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <button 
          @click="handleTutorHelp"
          class="flex items-center gap-3 px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:bg-secondary transition-all active:scale-95 group"
        >
          <BrainCircuit class="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span class="hidden md:block">Consultar Mentor</span>
        </button>
      </div>
    </header>

    <!-- AI Tutor Modal (Holographic Style) -->
    <Transition name="modal-fade">
      <div v-if="showHelp" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showHelp = false"></div>
        
        <div class="glass-panel max-w-2xl w-full p-8 lg:p-12 relative z-10 border-primary/20 shadow-2xl animate-scale-up overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <button @click="showHelp = false" class="absolute top-8 right-8 p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/30 hover:text-white transition-all">
            <X class="w-5 h-5" />
          </button>

          <div class="flex gap-6 items-start mb-10">
            <div class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-glow shrink-0 animate-float">
              <BrainCircuit class="w-9 h-9 text-primary" />
            </div>
            <div>
               <h3 class="text-2xl font-black text-white italic tracking-tighter">Telemetría Tutor IA</h3>
               <p class="text-primary font-black uppercase tracking-[0.4em] text-[9px] mt-2">Apoyo Pedagógico en Tiempo Real</p>
            </div>
          </div>

          <div class="space-y-8">
            <div v-if="!courseStore.tutorResponse && !courseStore.isAskingTutor" class="animate-slide-up">
              <p class="text-white/40 font-black uppercase tracking-widest text-[9px] mb-4 ml-1">Entrada de Consulta:</p>
              <div class="relative group">
                <textarea 
                  v-model="studentQuestion"
                  placeholder="Ej: ¿Puedes profundizar en la relación entre los conceptos expuestos?"
                  class="input-field w-full h-40 py-6 resize-none text-[15px] font-medium leading-relaxed"
                ></textarea>
                <div class="absolute bottom-4 right-4 text-[8px] font-black text-white/10 group-hover:text-white/20 transition-colors uppercase tracking-[0.2em] pointer-events-none">
                  Neural Engine v2.5
                </div>
              </div>
              <button 
                @click="handleAskTutor"
                class="btn-primary w-full mt-6 py-5 text-xs uppercase tracking-[0.2em]"
              >
                Inhibir Incertidumbre
                <Zap class="w-4 h-4 ml-2" />
              </button>
            </div>

            <div v-if="courseStore.isAskingTutor" class="flex flex-col items-center py-16">
              <div class="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center relative mb-6">
                <div class="absolute inset-0 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <Cpu class="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p class="text-primary font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Analizando Contexto...</p>
            </div>

            <div v-if="courseStore.tutorResponse" class="animate-fade-in">
              <div class="bg-white/2 p-8 lg:p-10 rounded-[2.5rem] border border-white/5 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar prose prose-invert prose-emerald max-w-none">
                <div v-html="renderedTutorResponse" class="text-white/80 leading-relaxed font-medium"></div>
              </div>
              
              <div class="flex items-center justify-center gap-4 mb-8">
                 <div class="h-px bg-white/10 flex-1"></div>
                 <div class="flex items-center gap-2 opacity-30 group">
                    <Zap class="w-3 h-3 text-emerald-400 group-hover:animate-bounce" />
                    <span class="text-[9px] font-black text-white uppercase tracking-[0.3em]">IA de Alto Rendimiento</span>
                 </div>
                 <div class="h-px bg-white/10 flex-1"></div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <button @click="courseStore.tutorResponse = null" class="flex-1 py-5 bg-white/5 text-white/60 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                  Nueva Consulta
                </button>
                <button @click="showHelp = false" class="flex-1 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-glow hover:bg-secondary transition-all">
                  Continuar Lectura
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <div v-if="currentLessonData" class="space-y-16 animate-fade-in">
          <section class="space-y-12">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                 <BookOpen class="w-4 h-4 text-primary" />
                 <span class="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Arquitectura de Lección</span>
              </div>
              <h2 class="text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter italic">{{ currentLesson.title }}</h2>
            </div>
            
            <div class="glass-panel p-8 lg:p-16 border-white/5 relative overflow-hidden group">
               <div class="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                  <BrainCircuit :size="200" />
               </div>
               
               <div class="prose prose-invert prose-emerald prose-xl max-w-none">
                <p class="text-white/70 leading-relaxed font-medium whitespace-pre-wrap text-lg md:text-xl selection:bg-primary/40">
                  {{ currentLesson.content }}
                </p>
              </div>
            </div>
            
            <!-- Insight Block -->
            <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[3rem] p-10 lg:p-14 flex flex-col md:flex-row items-center gap-10 border border-primary/10 border-dashed relative overflow-hidden group">
               <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity"></div>
               <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-glow shrink-0">
                  <Sparkles class="w-8 h-8 text-primary animate-pulse" />
               </div>
               <div>
                  <p class="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-4">Nota del Mentor IA</p>
                  <p class="text-lg font-black text-white/50 italic leading-relaxed">
                    "Tu progreso ha sido detectado por la red neuronal. Si necesitas un desglose técnico, el Mentor está activo."
                  </p>
               </div>
            </div>
          </section>

          <!-- Navigation Footer -->
          <footer class="flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/5 pt-12 pb-20">
             <button @click="router.back()" class="flex items-center gap-4 px-8 py-4 text-white/30 font-black uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
               <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               Volver al Panel
             </button>
             
             <button class="flex items-center justify-center gap-4 px-10 py-5 bg-white text-bg-deep rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-premium hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 group w-full sm:w-auto">
                Trascender a Siguiente Fase
                <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </footer>
        </div>

        <!-- Loading Skeleton Premium -->
        <div v-else class="space-y-12 animate-pulse py-20">
          <div class="h-16 bg-white/5 rounded-3xl w-3/4"></div>
          <div class="space-y-4">
            <div class="h-6 bg-white/5 rounded-full w-full"></div>
            <div class="h-6 bg-white/5 rounded-full w-full"></div>
            <div class="h-6 bg-white/5 rounded-full w-5/6"></div>
          </div>
          <div class="h-[400px] bg-white/2 rounded-[3.5rem] border border-white/5"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@reference "../style.css";

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-white/10 rounded-full hover:bg-primary/40 transition-colors; }

.animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}
</style>

