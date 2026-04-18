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
    <header class="py-12 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <button @click="router.push('/dashboard')" class="p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all active:scale-95 group">
          <ArrowLeft class="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tight mb-2">Mentor IA <span class="text-primary">Gemma 4</span></h1>
          <p class="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Arquitectura Pedagógica de Vanguardia</p>
        </div>
      </div>

      <!-- Step Indicator Premium -->
      <div class="hidden md:flex items-center gap-6 bg-white/5 p-3 rounded-[2.5rem] border border-white/5 shadow-inner">
        <div v-for="s in [1,2,3]" :key="s" 
          :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500', 
          currentStep === s ? 'bg-primary text-white scale-110 shadow-glow' : 'bg-white/5 text-white/10']"
        >
          {{ s }}
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- STEP 1: CONTEXTO -->
      <section v-if="currentStep === 1" class="lg:col-span-12 max-w-3xl mx-auto w-full animate-slide-up">
        <div class="glass-panel p-16 text-center relative overflow-hidden">
          <div class="absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div class="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 shadow-glow">
            <BookOpen class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-4xl font-black text-white mb-6 tracking-tight">¿Qué vamos a transformar hoy?</h2>
          <p class="text-white/30 font-bold mb-14 uppercase text-[10px] tracking-[0.3em]">Define el contexto pedagógico elemental</p>
          
          <div class="space-y-10 text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Materia / Asignatura</label>
                <input v-model="subject" type="text" placeholder="Ej: Neurociencia, Ética..." class="input-field w-full text-xl" />
              </div>
              <div class="space-y-4">
                <label class="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Grado o Nivel</label>
                <input v-model="grade" type="text" placeholder="Ej: Postgrado, 11º..." class="input-field w-full text-xl" />
              </div>
            </div>
            
            <button @click="currentStep = 2" :disabled="!isContextValid" class="w-full py-7 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary transition-all active:scale-95 shadow-glow disabled:opacity-20 flex items-center justify-center gap-4 group">
              Iniciar Fase de Ideación
              <ChevronRight class="w-6 h-6 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      <!-- STEP 2: BRAINSTORMING (CHAT) -->
      <section v-if="currentStep === 2" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
        <!-- Chat Side -->
        <div class="lg:col-span-8 flex flex-col h-[750px] glass-panel overflow-hidden">
          <div class="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-glow border border-primary/20">
                <Bot class="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 class="text-xl font-black text-white tracking-tight">Ideación con Gemma 4</h3>
                <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Define el núcleo de tu lección</p>
              </div>
            </div>
            <button @click="currentStep = 1" class="text-[10px] font-black text-white/20 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
              <ChevronLeft class="w-5 h-5" /> Volver al contexto
            </button>
          </div>

          <!-- Messages Premium -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar scroll-smooth">
            <div v-if="courseStore.teacherChatHistory.length === 0" class="text-center py-20 animate-fade-in">
              <Sparkles class="w-16 h-16 text-primary/20 mx-auto mb-8 animate-pulse" />
              <p class="text-white/40 font-black uppercase tracking-[0.3em] text-xs mb-8">"Describe tu visión y la haré pedágogicamente brillante"</p>
              <div class="flex flex-wrap justify-center gap-4">
                <button @click="teacherMessage = 'Necesito un enfoque lúdico para este tema'; sendToMentor()" class="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">Enfoque Lúdico</button>
                <button @click="teacherMessage = '¿Cómo puedo aplicar los DBA en esta clase?'; sendToMentor()" class="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">Alinear con DBA</button>
              </div>
            </div>

            <div v-for="(msg, i) in courseStore.teacherChatHistory" :key="i" 
              :class="['flex gap-6 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '']"
            >
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5', msg.role === 'user' ? 'bg-primary text-white shadow-glow' : 'bg-white/5 text-white/40']">
                <User v-if="msg.role === 'user'" class="w-5 h-5" />
                <Bot v-else class="w-5 h-5" />
              </div>
              <div class="space-y-4">
                <div :class="['p-6 rounded-[2rem] text-sm leading-relaxed shadow-lg font-medium', msg.role === 'user' ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-none' : 'bg-white/5 text-gray-300 rounded-bl-none border border-white/5']">
                  {{ msg.content }}
                </div>
                <!-- Magic Button for Bot messages -->
                <button v-if="msg.role === 'assistant'" @click="useIdeaFromChat(msg.content)" class="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-primary hover:border-primary transition-all hover:bg-white/10">
                  <Wand2 class="w-4 h-4" /> Usar esta propuesta
                </button>
              </div>
            </div>
            
            <div v-if="courseStore.isAskingTutor" class="flex gap-6 animate-pulse">
              <div class="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                <Loader2 class="w-5 h-5 text-primary animate-spin" />
              </div>
              <div class="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex gap-2">
                <span class="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
              </div>
            </div>
          </div>

          <!-- Input Premium -->
          <div class="p-8 bg-white/5 border-t border-white/5">
            <div class="relative">
              <input 
                v-model="teacherMessage" 
                @keyup.enter="sendToMentor"
                type="text" 
                placeholder="Solicita sugerencias o describe tu clase..." 
                class="input-field w-full pr-20 py-6"
              />
              <button @click="sendToMentor" class="absolute right-3 top-3 p-4 bg-primary text-white rounded-2xl hover:bg-secondary transition-all shadow-glow active:scale-95">
                <Send class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Mini Summary -->
        <div class="lg:col-span-4 space-y-8">
          <div class="glass-panel p-10 relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Estado Cuántico</h4>
            <div class="space-y-6">
              <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span class="text-[10px] font-black text-white/30 uppercase tracking-widest">NÚCLEO IA</span>
                <span class="text-[11px] font-black flex items-center gap-2 text-primary">
                  <Zap class="w-4 h-4" /> GEMMA 4 31B
                </span>
              </div>
              <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span class="text-[10px] font-black text-white/30 uppercase tracking-widest">LATENCIA</span>
                <span class="text-[11px] font-black text-emerald-400 uppercase tracking-widest">ULTRA FAST</span>
              </div>
            </div>
            <hr class="my-10 border-white/5" />
            <button @click="currentStep = 3" class="w-full py-5 bg-white text-dark rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary hover:text-white transition-all shadow-premium group">
              Confirmar Diseño
              <ChevronRight class="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div class="p-10 bg-primary/5 rounded-4xl border border-primary/10 relative">
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <Sparkles class="w-5 h-5" /> Mentor Insigth
            </p>
            <p class="text-sm text-gray-400 leading-relaxed font-bold italic">"Estamos listos. Gemma 4 ha detectado patrones creativos. Procede a generar el documento final para tu aula."</p>
          </div>
        </div>
      </section>

      <!-- STEP 3: GENERATE & RESULT -->
      <section v-if="currentStep === 3" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
        <!-- Configuration Column -->
        <aside class="lg:col-span-4 space-y-8">
          <div class="glass-panel p-10 space-y-10">
             <div class="flex items-center justify-between mb-4">
                <h3 class="text-xs font-black text-white uppercase tracking-[0.4em]">Arquitectura Final</h3>
                <button @click="currentStep = 2" class="text-[10px] font-black text-primary uppercase underline tracking-widest">Editar Ideación</button>
             </div>

             <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Núcleo Temático</label>
              <textarea v-model="topic" class="input-field w-full h-44 resize-none"></textarea>
             </div>

             <div class="space-y-6">
              <label class="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Estructura Deseada</label>
              <div class="grid grid-cols-1 gap-3">
                <button v-for="t in types" :key="t.id" @click="type = t.id"
                  :class="['flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all text-left duration-500', 
                  type === t.id ? 'border-primary bg-primary/10 shadow-glow' : 'border-white/5 hover:border-white/10 hover:bg-white/5']"
                >
                  <component :is="t.icon" :class="['w-6 h-6', type === t.id ? 'text-primary' : 'text-white/20']" />
                  <div>
                    <p :class="['font-black text-xs uppercase tracking-widest', type === t.id ? 'text-white' : 'text-white/30']">{{ t.name }}</p>
                  </div>
                </button>
              </div>
             </div>

             <button @click="handleGenerate" :disabled="courseStore.isGenerating"
               class="w-full py-6 bg-white text-dark rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-primary hover:text-white transition-all shadow-glow flex items-center justify-center gap-4 active:scale-95 disabled:opacity-20"
             >
                <Loader2 v-if="courseStore.isGenerating" class="w-6 h-6 animate-spin" />
                <Sparkles v-else class="w-6 h-6" />
                {{ courseStore.isGenerating ? 'Trascendiendo...' : 'Generar Artefacto' }}
             </button>
          </div>
        </aside>

        <!-- Result Column -->
        <main class="lg:col-span-8">
          <div v-if="courseStore.generatedContent" class="glass-panel h-full min-h-[700px] flex flex-col overflow-hidden animate-slide-up">
             <div class="p-10 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <h3 class="text-xl font-black text-white uppercase tracking-[0.2em]">Salida Pedagógica</h3>
                <div class="flex gap-6">
                  <button @click="copyToClipboard" class="text-[11px] font-black uppercase text-white/30 hover:text-primary flex items-center gap-3 transition-all">
                    <Copy class="w-5 h-5" /> {{ copySuccess ? 'Transferido' : 'Transferir a Portapapeles' }}
                  </button>
                </div>
             </div>
             <div class="flex-1 p-14 overflow-y-auto preview-markdown custom-scrollbar">
                <div v-html="renderedContent" class="prose prose-invert prose-lg max-w-none font-medium text-gray-300"></div>
             </div>
          </div>

          <div v-else-if="courseStore.generationError" class="glass-panel bg-red-500/5 p-16 text-center border-red-500/20">
             <AlertCircle class="w-20 h-20 text-red-500 mx-auto mb-8 animate-pulse" />
             <h3 class="text-3xl font-black text-red-100 mb-6 uppercase tracking-tight">Colapso de Generación</h3>
             <p class="text-red-200/40 mb-10 font-bold">{{ courseStore.generationError }}</p>
             <button @click="showDiagnosis = !showDiagnosis" class="text-[10px] font-black text-red-400 uppercase underline tracking-[0.3em]">Acceder a Telemetría de Error</button>
             <pre v-if="showDiagnosis" class="mt-10 p-8 bg-black/40 text-red-400 text-left text-xs rounded-3xl border border-red-500/20 overflow-x-auto">{{ courseStore.lastDiagnosis }}</pre>
          </div>

          <div v-else class="h-full min-h-[600px] flex flex-col items-center justify-center glass-panel border-4 border-dashed border-white/5 text-center p-20 relative">
             <div class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
             <BrainCircuit class="w-24 h-24 text-white/5 mb-10 animate-float" />
             <p class="text-white/10 font-black uppercase tracking-[0.5em] text-sm">Arquitectura en espera de ideación</p>
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";
.preview-markdown :deep(h1) { @apply text-3xl font-black mb-10 text-white tracking-tight; }
.preview-markdown :deep(h2) { @apply text-2xl font-black mt-12 mb-6 text-primary tracking-tight uppercase; }
.preview-markdown :deep(h3) { @apply text-xl font-black mt-8 mb-4 text-white/80; }
.preview-markdown :deep(p) { @apply mb-8 leading-relaxed; }
.preview-markdown :deep(ul) { @apply mb-8 space-y-3; }
.preview-markdown :deep(li) { @apply flex items-start gap-3; }
.preview-markdown :deep(li::before) { content: "•"; @apply text-primary font-black; }
.preview-markdown :deep(strong) { @apply text-primary font-black; }
.preview-markdown :deep(table) { @apply w-full mb-10 border-collapse bg-white/5 rounded-3xl overflow-hidden shadow-inner; }
.preview-markdown :deep(th) { @apply bg-white/10 p-5 text-left text-[11px] font-black uppercase tracking-widest text-primary border-b border-white/10; }
.preview-markdown :deep(td) { @apply p-5 border-b border-white/5 text-sm; }

.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
</style>

<style scoped>
@reference "../style.css";
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.premium-card { border-radius: 2.5rem; transition: all 0.4s ease; }
.shadow-soft { box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
.shadow-premium { box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
.shadow-glow { box-shadow: 0 0 20px 2px rgba(99, 102, 241, 0.2); }
</style>
