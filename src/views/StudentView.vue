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
  Cpu
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
  <div class="min-h-screen bg-white font-sans flex flex-col">
    <!-- Student Header -->
    <header class="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft class="w-6 h-6 text-gray-400" />
        </button>
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-widest text-primary">Lección Actual</span>
          <h1 class="text-xl font-black text-dark tracking-tight">{{ currentLesson.title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <button 
          @click="handleTutorHelp"
          class="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <BrainCircuit class="w-5 h-5" />
          IA Tutor
        </button>
      </div>
    </header>

    <!-- AI Tutor Modal -->
    <div v-if="showHelp" class="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-dark/20 animate-fade-in">
      <div class="glass max-w-lg w-full p-10 rounded-[3rem] shadow-premium relative border border-white">
        <button @click="showHelp = false" class="absolute top-8 right-8 p-2 text-gray-400 hover:text-dark transition-colors">
          <X class="w-6 h-6" />
        </button>
        <div class="flex gap-6 items-start mb-8">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft shrink-0">
            <BrainCircuit class="w-10 h-10 text-white" />
          </div>
          <div>
             <h3 class="text-2xl font-black text-dark tracking-tight">IA Mentor Explica</h3>
             <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">Apoyo en tiempo real</p>
          </div>
        </div>

        <div class="space-y-6">
          <div v-if="!courseStore.tutorResponse && !courseStore.isAskingTutor" class="animate-slide-up">
            <p class="text-gray-500 font-medium mb-4">¿Qué parte no te quedó clara? Pregúntame:</p>
            <textarea 
              v-model="studentQuestion"
              placeholder="Ej: ¿Me das un ejemplo práctico de esto?"
              class="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] focus:border-primary focus:bg-white outline-none transition-all font-medium text-lg min-h-[120px]"
            ></textarea>
            <button 
              @click="handleAskTutor"
              class="w-full mt-4 py-4 bg-primary text-white rounded-2xl font-bold shadow-soft hover:shadow-primary/30 transition-all active:scale-95"
            >
              Consultar al Tutor
            </button>
          </div>

          <div v-if="courseStore.isAskingTutor" class="flex flex-col items-center py-10">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-primary font-black uppercase tracking-widest text-xs">Pensando...</p>
          </div>

          <div v-if="courseStore.tutorResponse" class="animate-fade-in">
            <div class="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 mb-8 max-h-[350px] overflow-y-auto custom-scrollbar prose prose-slate prose-sm">
              <div v-html="renderedTutorResponse"></div>
            </div>
            <div class="flex items-center justify-center gap-2 mb-4">
               <component :is="courseStore.selectedModel === 'openai' ? Cpu : Zap" class="w-3 h-3 text-gray-300" />
               <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Respuesta vía {{ courseStore.selectedModel }}</span>
            </div>
            <div class="flex gap-4">
              <button @click="courseStore.tutorResponse = null" class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                Otra pregunta
              </button>
              <button @click="showHelp = false" class="flex-1 py-4 bg-dark text-white rounded-2xl font-bold hover:bg-primary transition-all">
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto p-12 md:p-24 bg-white">
      <div v-if="currentLessonData" class="max-w-3xl mx-auto space-y-16 animate-fade-in">
        <section class="space-y-10">
          <h2 class="text-5xl font-black text-dark leading-tight tracking-tighter">{{ currentLesson.title }}</h2>
          
          <div class="prose prose-xl prose-slate max-w-none">
            <p class="text-2xl text-gray-600 leading-relaxed font-normal whitespace-pre-wrap">
              {{ currentLesson.content }}
            </p>
          </div>
          
          <!-- AI Mentor Block -->
          <div class="bg-primary/5 rounded-[3rem] p-12 flex flex-col items-center gap-10 border border-primary/10 relative overflow-hidden group">
             <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
             <Sparkles class="w-16 h-16 text-primary animate-pulse" />
             <p class="text-center text-lg font-bold text-gray-500 italic max-w-md">
               "Has completado una gran parte de la lección. Si necesitas profundizar en algún punto, usa el botón IA Tutor."
             </p>
          </div>
        </section>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-4 w-full justify-between border-t border-gray-100 pt-10 mt-20">
           <button @click="router.back()" class="flex items-center gap-2 px-8 py-4 text-gray-400 font-bold hover:text-dark transition-all">
             <ArrowLeft class="w-5 h-5" />
             Volver
           </button>
           <button class="flex items-center gap-3 px-10 py-5 bg-secondary text-white rounded-2xl font-black text-lg shadow-premium hover:shadow-secondary/30 transition-all active:scale-95 group">
              Siguiente Lección
              <ArrowRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="max-w-3xl mx-auto space-y-12 animate-pulse">
        <div class="h-16 bg-gray-100 rounded-3xl w-3/4"></div>
        <div class="space-y-4">
          <div class="h-6 bg-gray-100 rounded-full w-full"></div>
          <div class="h-6 bg-gray-100 rounded-full w-full"></div>
          <div class="h-6 bg-gray-100 rounded-full w-5/6"></div>
        </div>
        <div class="h-64 bg-gray-50 rounded-[3rem]"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
