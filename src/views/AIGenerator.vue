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
  Copy,
  ChevronRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Send,
  User,
  Bot,
  Wand2,
  ChevronLeft,
  Cpu,
  Zap
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
  { id: 'workshop', name: 'Taller', desc: 'Práctica Intensiva', icon: ClipboardList },
  { id: 'exam', name: 'Examen', desc: 'Evaluación Técnica', icon: GraduationCap }
]

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

const useIdeaFromChat = (content) => {
  topic.value = content.substring(0, 1000)
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
  <div class="max-w-7xl mx-auto pb-20">
    <header class="py-8 lg:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex items-center gap-6 lg:gap-8 w-full md:w-auto">
        <button @click="router.push('/dashboard')" class="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all active:scale-95 group shrink-0">
          <ArrowLeft class="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight leading-none mb-2">
            Arquitecto <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Gemini AI</span>
          </h1>
          <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Soporte Pedagógico de Próxima Generación</p>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center gap-3 lg:gap-4 bg-white/2 p-2 rounded-[2rem] border border-white/5 w-full md:w-auto justify-center">
        <div v-for="s in [1,2,3]" :key="s" 
          :class="['px-6 py-2 rounded-xl flex items-center gap-2 transition-all duration-500', 
          currentStep === s ? 'bg-primary text-white shadow-glow' : 'text-white/20']"
        >
          <span class="text-xs font-black">{{ s }}</span>
          <span v-if="currentStep === s" class="text-[10px] font-black uppercase tracking-widest hidden sm:block animate-fade-in">
            {{ s === 1 ? 'Contexto' : s === 2 ? 'Ideación' : 'Generación' }}
          </span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <!-- STEP 1: CONTEXTO -->
      <section v-if="currentStep === 1" class="lg:col-span-12 max-w-2xl mx-auto w-full animate-slide-up">
        <div class="glass-panel p-8 lg:p-14 text-center relative overflow-hidden group">
          <div class="absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse group-hover:scale-125 transition-transform"></div>
          
          <div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-glow group-hover:rotate-6 transition-transform">
            <Cpu class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-3xl font-black text-white mb-4 tracking-tight">Núcleo del Aprendizaje</h2>
          <p class="text-white/30 font-black mb-12 uppercase text-[10px] tracking-[0.3em]">Configura las bases de la intervención</p>
          
          <div class="space-y-8 text-left">
            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-3">
                <label class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Materia / Disciplina</label>
                <input v-model="subject" type="text" placeholder="Ej: Pensamiento Crítico" class="input-field w-full text-lg" />
              </div>
              <div class="space-y-3">
                <label class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Nivel Educativo</label>
                <input v-model="grade" type="text" placeholder="Ej: Grado 11" class="input-field w-full text-lg" />
              </div>
            </div>
            
            <button @click="currentStep = 2" :disabled="!isContextValid" class="btn-primary w-full py-6 disabled:opacity-20 uppercase tracking-[0.2em] text-xs">
              Siguiente Fase: Ideación
              <ChevronRight class="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      <!-- STEP 2: BRAINSTORMING (CHAT) -->
      <section v-if="currentStep === 2" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
        <!-- Chat Side -->
        <div class="lg:col-span-8 flex flex-col h-[700px] glass-panel overflow-hidden border-primary/10">
          <div class="p-6 bg-white/2 border-b border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-5">
              <div class="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <BrainCircuit class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="text-sm font-black text-white uppercase tracking-widest">Cocreación IA</h3>
                <p class="text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">Online & Listo</p>
              </div>
            </div>
            <button @click="currentStep = 1" class="text-[9px] font-black text-white/20 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
              <ChevronLeft class="w-4 h-4" /> Volver
            </button>
          </div>

          <!-- Messages -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth">
            <div v-if="courseStore.teacherChatHistory.length === 0" class="text-center py-16">
              <Sparkles class="w-12 h-12 text-primary/10 mx-auto mb-6" />
              <p class="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mb-8">Empieza a describir tu idea...</p>
              <div class="flex flex-wrap justify-center gap-3">
                <button @click="teacherMessage = 'Idea para una clase dinámica sobre ' + subject; sendToMentor()" class="px-5 py-2 bg-white/2 border border-white/5 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">Dinámica Grupal</button>
                <button @click="teacherMessage = '¿Cómo evaluar competencias en ' + subject + '?'; sendToMentor()" class="px-5 py-2 bg-white/2 border border-white/5 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">Evaluación DBA</button>
              </div>
            </div>

            <div v-for="(msg, i) in courseStore.teacherChatHistory" :key="i" 
              :class="['flex gap-4 max-w-[90%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '']"
            >
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/10 transition-all', msg.role === 'user' ? 'bg-primary text-white shadow-glow rotate-3' : 'bg-white/5 text-primary']">
                <User v-if="msg.role === 'user'" class="w-5 h-5" />
                <Bot v-else class="w-5 h-5 shadow-glow" />
              </div>
              <div class="space-y-3" :class="msg.role === 'user' ? 'text-right' : ''">
                <div :class="['p-5 rounded-2xl text-[13px] leading-relaxed shadow-lg font-medium whitespace-pre-wrap transition-all', 
                  msg.role === 'user' ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-tr-none' : 'bg-white/5 text-text-main rounded-tl-none border border-white/10']">
                  {{ msg.content }}
                </div>
                <!-- Magic Button -->
                <button 
                  v-if="msg.role === 'assistant'" 
                  @click="useIdeaFromChat(msg.content)" 
                  class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all active:scale-95"
                >
                  <Wand2 class="w-3.5 h-3.5" /> Trascender a Documento
                </button>
              </div>
            </div>
            
            <div v-if="courseStore.isAskingTutor" class="flex gap-4">
              <div class="w-9 h-9 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                <Loader2 class="w-4 h-4 text-primary animate-spin" />
              </div>
              <div class="p-5 bg-white/5 border border-white/10 rounded-2xl flex gap-1.5 items-center">
                <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-6 bg-white/2 border-t border-white/5">
            <div class="relative group">
              <div class="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
              <input 
                v-model="teacherMessage" 
                @keyup.enter="sendToMentor"
                type="text" 
                placeholder="Prescribe tu visión pedagógica..." 
                class="input-field w-full pr-16 py-5 relative z-10"
              />
              <button @click="sendToMentor" class="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all shadow-glow active:scale-90 z-20">
                <Send class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Mini Summary -->
        <div class="lg:col-span-4 space-y-6">
          <div class="glass-panel p-8 relative overflow-hidden group border-white/10">
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-2">
              <Zap class="w-4 h-4" /> Telemetría IA
            </h4>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-3.5 bg-white/2 rounded-xl border border-white/5">
                <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Motor</span>
                <span class="text-[10px] font-black text-white/60 tracking-widest italic">Gemini 2.5</span>
              </div>
              <div class="flex justify-between items-center p-3.5 bg-white/2 rounded-xl border border-white/5">
                <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Nivel</span>
                <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimizado</span>
              </div>
            </div>
            <hr class="my-8 border-white/5" />
            <button @click="currentStep = 3" class="w-full py-5 bg-white text-bg-deep rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary hover:text-white transition-all shadow-premium group">
              Confirmar Diseño
              <ChevronRight class="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform ml-1" />
            </button>
          </div>
          
          <div class="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 relative group border-dashed">
            <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <Sparkles class="w-4 h-4" /> Mentor Insight
            </p>
            <p class="text-xs text-white/40 leading-relaxed font-bold italic group-hover:text-white/60 transition-colors">
              "La ideación ha detectado patrones transdisciplinares. Procede a la fase de síntesis documental."
            </p>
          </div>
        </div>
      </section>

      <!-- STEP 3: GENERATE & RESULT -->
      <section v-if="currentStep === 3" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
        <!-- Configuration Column -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="glass-panel p-8 space-y-8">
             <div class="flex items-center justify-between mb-2">
                <h3 class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Síntesis Final</h3>
                <button @click="currentStep = 2" class="text-[9px] font-black text-primary uppercase underline tracking-widest">Ajustar</button>
             </div>

             <div class="space-y-3">
              <label class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Núcleo Temático</label>
              <textarea v-model="topic" class="input-field w-full h-40 resize-none text-[13px]"></textarea>
             </div>

             <div class="space-y-4">
              <label class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Estructura Deseada</label>
              <div class="grid grid-cols-1 gap-2">
                <button v-for="t in types" :key="t.id" @click="type = t.id"
                  :class="['flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300', 
                  type === t.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-white/5 hover:bg-white/5']"
                >
                  <component :is="t.icon" :class="['w-5 h-5', type === t.id ? 'text-primary' : 'text-white/20']" />
                  <p :class="['font-black text-[10px] uppercase tracking-widest', type === t.id ? 'text-white' : 'text-white/30']">{{ t.name }}</p>
                </button>
              </div>
             </div>

             <button @click="handleGenerate" :disabled="courseStore.isGenerating"
               class="btn-primary w-full py-5 text-xs uppercase tracking-widest disabled:opacity-20"
             >
                <Loader2 v-if="courseStore.isGenerating" class="w-5 h-5 animate-spin mr-2" />
                <Sparkles v-else class="w-5 h-5 mr-2" />
                {{ courseStore.isGenerating ? 'Trascendiendo...' : 'Generar Artefacto' }}
             </button>
          </div>
        </aside>

        <!-- Result Column -->
        <main class="lg:col-span-8 flex flex-col h-full">
          <div v-if="courseStore.generatedContent" class="glass-panel min-h-[600px] flex flex-col overflow-hidden animate-slide-up border-primary/10">
             <div class="p-6 bg-white/2 border-b border-white/5 flex items-center justify-between">
                <h3 class="text-sm font-black text-white uppercase tracking-widest italic outline-primary">Resultado Pedagógico</h3>
                <button @click="copyToClipboard" class="text-[9px] font-black uppercase text-white/40 hover:text-primary flex items-center gap-2 transition-all p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10">
                   <Copy class="w-4 h-4" /> {{ copySuccess ? 'Copiado' : 'Copiar' }}
                </button>
             </div>
             <div class="flex-1 p-8 lg:p-12 overflow-y-auto preview-markdown custom-scrollbar">
                <div v-html="renderedContent" class="prose prose-invert prose-emerald max-w-none font-medium text-white/80 transition-all duration-700"></div>
             </div>
          </div>

          <div v-else-if="courseStore.generationError" class="glass-panel bg-red-500/5 p-12 text-center border-red-500/20">
             <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
             <h3 class="text-2xl font-black text-red-100 mb-4 uppercase tracking-tight">Anomalía de Generación</h3>
             <p class="text-red-200/40 mb-8 font-bold text-sm leading-relaxed">{{ courseStore.generationError }}</p>
             <button @click="showDiagnosis = !showDiagnosis" class="text-[9px] font-black text-red-400 uppercase underline tracking-[0.3em]">Telemetría de Error</button>
             <pre v-if="showDiagnosis" class="mt-8 p-6 bg-black/60 text-red-400 text-left text-[10px] rounded-2xl border border-red-500/20 overflow-x-auto">{{ courseStore.lastDiagnosis }}</pre>
          </div>

          <div v-else class="h-full min-h-[500px] flex flex-col items-center justify-center glass-panel border-2 border-dashed border-white/5 text-center p-12 relative opacity-50">
             <BrainCircuit class="w-20 h-20 text-white/5 mb-8 animate-float" />
             <p class="text-white/10 font-black uppercase tracking-[0.5em] text-[10px]">Arquitectura lista para sintetizar</p>
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.preview-markdown :deep(h1) { @apply text-4xl font-black mb-10 text-white tracking-tight italic border-b-4 border-primary/20 pb-4 inline-block; }
.preview-markdown :deep(h2) { @apply text-2xl font-black mt-12 mb-6 text-primary tracking-tight uppercase flex items-center gap-3; }
.preview-markdown :deep(h2::before) { content: ""; @apply block w-2 h-8 bg-primary rounded-full; }
.preview-markdown :deep(h3) { @apply text-xl font-black mt-8 mb-4 text-white/80 border-l-4 border-white/10 pl-4; }
.preview-markdown :deep(p) { @apply mb-8 leading-relaxed text-[15px] text-white/70; }
.preview-markdown :deep(ul) { @apply mb-8 space-y-4; }
.preview-markdown :deep(li) { @apply flex items-start gap-4 text-[14px]; }
.preview-markdown :deep(li::before) { content: "›"; @apply text-emerald-400 font-black text-xl leading-none; }
.preview-markdown :deep(strong) { @apply text-emerald-400 font-black; }
.preview-markdown :deep(table) { @apply w-full mb-10 border-collapse bg-white/2 rounded-2xl overflow-hidden shadow-inner border border-white/5; }
.preview-markdown :deep(th) { @apply bg-white/5 p-4 text-left text-[10px] font-black uppercase tracking-widest text-primary border-b border-white/10; }
.preview-markdown :deep(td) { @apply p-4 border-b border-white/5 text-[13px] text-white/60; }
.preview-markdown :deep(blockquote) { @apply border-l-4 border-emerald-500/40 bg-emerald-500/5 px-8 py-6 rounded-r-2xl mb-8 italic text-emerald-100/80; }

.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-white/5 rounded-full; }
</style>
