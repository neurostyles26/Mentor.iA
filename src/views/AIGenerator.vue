<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { 
  Sparkles, 
  ArrowLeft, 
  BrainCircuit, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronRight,
  Cpu,
  Zap,
  BookOpen,
  ClipboardList,
  GraduationCap,
  History,
  Terminal,
  Send,
  User,
  Bot,
  Wand2,
  ChevronLeft
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()

// Wizard State
const currentStep = ref(1) // 1: Context, 2: Brainstorm, 3: Generate

// Form Data
const subject = ref('')
const grade = ref('')
const topic = ref('')
const type = ref('lesson')

// Chat State
const teacherMessage = ref('')
const chatContainer = ref(null)

const copySuccess = ref(false)
const showDiagnosis = ref(false)

onMounted(() => {
  if (courseStore.currentCourse) {
    subject.value = courseStore.currentCourse.name || ''
    grade.value = courseStore.currentCourse.grade || ''
  }
})

// Types of content to generate
const types = [
  { id: 'lesson', name: 'Lección', desc: 'Pensum y Teoría', icon: BookOpen },
  { id: 'workshop', name: 'Taller', desc: 'Ejercicios Prácticos', icon: ClipboardList },
  { id: 'exam', name: 'Examen', desc: 'Evaluación y Respuestas', icon: GraduationCap }
]

const models = [
  { id: 'gemini', name: 'Gemini 1.5', icon: Zap },
  { id: 'openai', name: 'GPT-4o', icon: Cpu }
]

// Handle chat with mentor
const sendToMentor = async () => {
  if (!teacherMessage.value.trim() || courseStore.isAskingTutor) return
  const msg = teacherMessage.value
  teacherMessage.value = ''
  await courseStore.askMentorTeacher(msg)
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// "Magic" feature: Extract topic from chat
const useIdeaFromChat = (content) => {
  topic.value = content.substring(0, 500) // Take first 500 chars as a base
  currentStep.value = 3
}

const handleGenerate = async () => {
  if (!topic.value.trim() || !subject.value.trim() || !grade.value.trim()) return
  await courseStore.generateLessonsWithAI(topic.value, {
    subject: subject.value,
    grade: grade.value,
    type: type.value
  })
}

const renderedContent = computed(() => {
  if (!courseStore.generatedContent) return ''
  return DOMPurify.sanitize(marked.parse(courseStore.generatedContent))
})

const copyToClipboard = () => {
  if (!courseStore.generatedContent) return
  navigator.clipboard.writeText(courseStore.generatedContent)
  copySuccess.value = true
  setTimeout(() => copySuccess.value = false, 2000)
}

const isContextValid = computed(() => subject.value.trim() && grade.value.trim())
</script>

<template>
  <div class="max-w-7xl mx-auto pb-20 px-4 lg:px-8">
    <header class="py-10 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button @click="router.push('/dashboard')" class="p-4 bg-white rounded-2xl shadow-soft hover:bg-gray-50 transition-all border border-gray-100 group">
          <ArrowLeft class="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 class="text-3xl font-black text-dark tracking-tight mb-1">Mentor IA 2.0</h1>
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Planificación Profesional</p>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="hidden md:flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-soft">
        <div v-for="s in [1,2,3]" :key="s" 
          :class="['w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all', 
          currentStep === s ? 'bg-primary text-white scale-110 shadow-glow' : 'bg-gray-100 text-gray-300']"
        >
          {{ s }}
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <!-- STEP 1: CONTEXTO -->
      <section v-if="currentStep === 1" class="lg:col-span-12 max-w-2xl mx-auto w-full animate-slide-up">
        <div class="premium-card bg-white p-12 text-center border border-gray-100 shadow-premium">
          <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <BookOpen class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-3xl font-black text-dark mb-4">¿Qué vamos a enseñar hoy?</h2>
          <p class="text-gray-400 font-medium mb-10">Define el contexto básico para que el Mentor pueda ayudarte mejor.</p>
          
          <div class="space-y-6 text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Materia / Asignatura</label>
                <input v-model="subject" type="text" placeholder="Ej: Álgebra, Historia..." class="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-lg transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Grado o Nivel</label>
                <input v-model="grade" type="text" placeholder="Ej: 10º Grado, Primaria..." class="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-lg transition-all" />
              </div>
            </div>
            
            <button @click="currentStep = 2" :disabled="!isContextValid" class="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-glow disabled:opacity-50 flex items-center justify-center gap-3">
              Continuar al Brainstorming
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <!-- STEP 2: BRAINSTORMING (CHAT) -->
      <section v-if="currentStep === 2" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
        <!-- Chat Side -->
        <div class="lg:col-span-8 flex flex-col h-[650px] premium-card bg-white border border-gray-100 shadow-premium overflow-hidden">
          <div class="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-dark rounded-xl flex items-center justify-center">
                <Bot class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-black text-dark">Chat con el Mentor</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Define tus ideas para la clase</p>
              </div>
            </div>
            <button @click="currentStep = 1" class="text-xs font-black text-gray-400 hover:text-dark flex items-center gap-1 uppercase transition-colors">
              <ChevronLeft class="w-4 h-4" /> Volver
            </button>
          </div>

          <!-- Messages -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div v-if="courseStore.teacherChatHistory.length === 0" class="text-center py-20">
              <p class="text-gray-300 font-bold italic mb-4">"Dime qué tienes en mente y te daré ideas creativas..."</p>
              <div class="flex flex-wrap justify-center gap-2">
                <button @click="teacherMessage = 'Dame ideas creativas para este grado'; sendToMentor()" class="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-primary/10 hover:text-primary transition-all">Ideas creativas</button>
                <button @click="teacherMessage = '¿Cómo puedo evaluar este tema de forma lúdica?'; sendToMentor()" class="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-primary/10 hover:text-primary transition-all">Ideas de evaluación</button>
              </div>
            </div>

            <div v-for="(msg, i) in courseStore.teacherChatHistory" :key="i" 
              :class="['flex gap-4 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '']"
            >
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', msg.role === 'user' ? 'bg-primary text-white' : 'bg-dark text-white']">
                <User v-if="msg.role === 'user'" class="w-4 h-4" />
                <Bot v-else class="w-4 h-4" />
              </div>
              <div class="space-y-2">
                <div :class="['p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm', msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-700']">
                  {{ msg.content }}
                </div>
                <!-- Magic Button for Bot messages -->
                <button v-if="msg.role === 'assistant'" @click="useIdeaFromChat(msg.content)" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-400 uppercase hover:text-primary hover:border-primary transition-all">
                  <Wand2 class="w-3 h-3" /> Usar esta idea
                </button>
              </div>
            </div>
            
            <div v-if="courseStore.isAskingTutor" class="flex gap-4">
              <div class="w-8 h-8 bg-dark rounded-lg flex items-center justify-center">
                <Loader2 class="w-4 h-4 text-white animate-spin" />
              </div>
              <div class="p-4 bg-gray-50 rounded-2xl flex gap-1">
                <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-6 bg-white border-t border-gray-100">
            <div class="relative">
              <input 
                v-model="teacherMessage" 
                @keyup.enter="sendToMentor"
                type="text" 
                placeholder="Escribe tu duda o pide una sugerencia..." 
                class="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-dark transition-all pr-16"
              />
              <button @click="sendToMentor" class="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-glow">
                <Send class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Mini Summary -->
        <div class="lg:col-span-4 space-y-6">
          <div class="premium-card bg-dark p-8 text-white shadow-premium">
            <h4 class="text-xs font-black uppercase tracking-widest text-primary mb-6">Plan en curso</h4>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span class="text-[10px] font-bold text-gray-400">MATERIA</span>
                <span class="text-xs font-black">{{ subject }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <span class="text-[10px] font-bold text-gray-400">GRADO</span>
                <span class="text-xs font-black">{{ grade }}</span>
              </div>
            </div>
            <hr class="my-8 border-white/5" />
            <button @click="currentStep = 3" class="w-full py-4 bg-white text-dark rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center gap-2">
              Siguiente Paso
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
          
          <div class="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10">
            <p class="text-[11px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles class="w-4 h-4" /> Consejo de Mentor
            </p>
            <p class="text-sm text-gray-600 leading-relaxed font-bold italic">"Habla conmigo para definir el tema específico. Cuanto más detalle me des en el chat, mejor será el examen o taller final."</p>
          </div>
        </div>
      </section>

      <!-- STEP 3: GENERATE & RESULT -->
      <section v-if="currentStep === 3" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
        <!-- Configuration Column -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="premium-card bg-white p-8 border border-gray-100 shadow-soft space-y-6">
             <div class="flex items-center justify-between mb-4">
                <h3 class="font-black text-dark uppercase text-xs tracking-widest">Estructuración</h3>
                <button @click="currentStep = 2" class="text-[10px] font-black text-primary uppercase underline">Editar Tema</button>
             </div>

             <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tema a desarrollar</label>
              <textarea v-model="topic" class="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-dark resize-none"></textarea>
             </div>

             <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tipo de contenido</label>
              <div class="grid grid-cols-1 gap-2">
                <button v-for="t in types" :key="t.id" @click="type = t.id"
                  :class="['flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left', 
                  type === t.id ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100']"
                >
                  <component :is="t.icon" :class="['w-5 h-5', type === t.id ? 'text-primary' : 'text-gray-300']" />
                  <div>
                    <p class="font-black text-xs text-dark leading-none">{{ t.name }}</p>
                  </div>
                </button>
              </div>
             </div>

             <button @click="handleGenerate" :disabled="courseStore.isGenerating"
               class="w-full py-5 bg-dark text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-glow flex items-center justify-center gap-3"
             >
                <Loader2 v-if="courseStore.isGenerating" class="w-5 h-5 animate-spin" />
                <Sparkles v-else class="w-5 h-5" />
                {{ courseStore.isGenerating ? 'Generando...' : 'Generar Documento' }}
             </button>
          </div>
        </aside>

        <!-- Result Column -->
        <main class="lg:col-span-8">
          <div v-if="courseStore.generatedContent" class="premium-card bg-white h-full min-h-[600px] flex flex-col border border-gray-100 shadow-premium overflow-hidden animate-slide-up">
             <div class="p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-lg font-black text-dark uppercase tracking-tight">Resultado Final</h3>
                <div class="flex gap-4">
                  <button @click="copyToClipboard" class="text-xs font-black uppercase text-gray-400 hover:text-dark flex items-center gap-2">
                    <Copy class="w-4 h-4" /> {{ copySuccess ? 'Copiado' : 'Copiar' }}
                  </button>
                </div>
             </div>
             <div class="flex-1 p-12 overflow-y-auto preview-markdown custom-scrollbar">
                <div v-html="renderedContent" class="prose prose-slate max-w-none"></div>
             </div>
          </div>

          <div v-else-if="courseStore.generationError" class="premium-card bg-red-50 p-12 text-center border border-red-100">
             <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-6" />
             <h3 class="text-2xl font-black text-red-900 mb-4">Error de Generación</h3>
             <p class="text-red-700/60 mb-8">{{ courseStore.generationError }}</p>
             <button @click="showDiagnosis = !showDiagnosis" class="text-[10px] font-black text-red-300 uppercase underline">Ver Diagnóstico</button>
             <pre v-if="showDiagnosis" class="mt-6 p-6 bg-dark text-white text-left text-[10px] rounded-2xl overflow-x-auto">{{ courseStore.lastDiagnosis }}</pre>
          </div>

          <div v-else class="h-full min-h-[500px] flex flex-col items-center justify-center premium-card bg-white border-4 border-dashed border-gray-50 text-center p-20">
             <BrainCircuit class="w-20 h-20 text-gray-100 mb-8" />
             <p class="text-gray-300 font-black uppercase tracking-widest text-sm">Listo para generar tu contenido profesional</p>
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.premium-card { border-radius: 2.5rem; transition: all 0.4s ease; }
.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
.shadow-premium { box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
.shadow-glow { box-shadow: 0 0 20px 2px rgba(99, 102, 241, 0.2); }
</style>
