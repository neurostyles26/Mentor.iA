<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { useChatStore } from '../store/chat'
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
  Zap,
  ChevronDown,
  FileDown,
  ClipboardPlus,
  Maximize2,
  Minimize2,
  Volume2,
  Square,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-vue-next'

import { exportService } from '../lib/exportService'
import { useClipboardStore } from '../store/clipboard'
import VoiceAssistant from '../components/VoiceAssistant.vue'
import { useTextToSpeech } from '../composables/useTextToSpeech'

const { speak, stop, isSpeaking } = useTextToSpeech()

const router = useRouter()
const courseStore = useCourseStore()
const chatStore = useChatStore()

// Wizard State
const currentStep = ref(1) // 1: Context, 2: Brainstorm, 3: Generate
const isSidebarCollapsed = ref(false)
const showExportMenu = ref(false)
const clipboardStore = useClipboardStore()

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
  if (!teacherMessage.value.trim() || chatStore.isLoading) return
  const msg = teacherMessage.value
  teacherMessage.value = ''
  await chatStore.sendMessage(msg)
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
  topic.value = content.substring(0, 2000)
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

const saveToClipboard = async () => {
  if (!courseStore.generatedContent) return
  await clipboardStore.addItem(courseStore.generatedContent, `Resultado: ${topic.value.substring(0, 30)}...`, type.value)
  alert('Guardado en el portapapeles con éxito.')
}

const handleExportResult = (format) => {
  if (!courseStore.generatedContent) return
  const item = {
    content: courseStore.generatedContent,
    tag: type.value,
    created_at: new Date()
  }
  const filename = `MentorIA_${type.value}_${new Date().toISOString().slice(0,10)}`
  
  if (format === 'pdf') exportService.exportToPDF([item], `${filename}.pdf`)
  else if (format === 'excel') exportService.exportToExcel([item], `${filename}.xlsx`)
  else if (format === 'slides') exportService.exportToSlides([item], `${filename}.pptx`)
  
  showExportMenu.value = false
}

const isContextValid = computed(() => subject.value.trim() && grade.value.trim())
</script>

<template>
  <div class="max-w-7xl mx-auto pb-24 animate-page-in">
    <!-- Sophisticated Header -->
    <header class="py-10 lg:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
      <div class="flex items-center gap-8 w-full md:w-auto">
        <button @click="router.push('/dashboard')" class="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-primary/40 transition-all active:scale-95 group shrink-0">
          <ArrowLeft class="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 class="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-3 italic">
            Arquitecto <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Inteligente</span>
          </h1>
          <div class="flex items-center gap-3">
            <ShieldCheck class="w-3.5 h-3.5 text-primary" />
            <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Soporte Pedagógico Elite</p>
          </div>
        </div>
      </div>

      <!-- Elevated Step Indicator -->
      <div class="flex items-center gap-3 bg-white/2 p-2.5 rounded-[2.5rem] border border-white/5 w-full md:w-auto justify-center shadow-inner">
        <div v-for="s in [1,2,3]" :key="s" 
          :class="['px-8 py-3 rounded-2xl flex items-center gap-3 transition-all duration-700 relative overflow-hidden', 
          currentStep === s ? 'bg-primary text-white shadow-glow' : 'text-white/20']"
        >
          <span class="text-xs font-black">{{ s }}</span>
          <span v-if="currentStep === s" class="text-[10px] font-black uppercase tracking-[0.3em] hidden sm:block animate-fade-in whitespace-nowrap">
            {{ s === 1 ? 'Contexto' : s === 2 ? 'Ideación' : 'Síntesis' }}
          </span>
          <!-- Active indicator background shine -->
          <div v-if="currentStep === s" class="absolute inset-0 bg-white/10 blur-xl"></div>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- STEP 1: CONTEXTO -->
       <section v-if="currentStep === 1" class="lg:col-span-12 max-w-2xl mx-auto w-full animate-slide-up">
        <div class="relative overflow-hidden rounded-[4rem] bg-bg-card border border-white/10 p-10 lg:p-20 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] group">
          <div class="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse group-hover:scale-125 transition-transform duration-1000"></div>
          
          <div class="relative z-10 text-center space-y-12">
            <div class="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto border border-primary/20 shadow-glow group-hover:rotate-12 transition-transform duration-700">
              <Cpu class="w-10 h-10 text-primary" />
            </div>
            
            <div class="space-y-4">
              <h2 class="text-4xl font-black text-white tracking-tighter italic">Núcleo del Aprendizaje</h2>
              <p class="text-white/30 font-black uppercase text-[10px] tracking-[0.5em]">Configura las bases de la intervención</p>
            </div>
            
            <div class="space-y-10 text-left">
              <div class="space-y-8">
                <div class="space-y-4">
                  <label class="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Materia / Disciplina</label>
                  <input 
                    v-model="subject" 
                    type="text" 
                    placeholder="Ej: Pensamiento Crítico" 
                    class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white font-bold text-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-500 placeholder:text-white/10 shadow-inner" 
                  />
                </div>
                <div class="space-y-4">
                  <label class="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Nivel Educativo</label>
                  <input 
                    v-model="grade" 
                    type="text" 
                    placeholder="Ej: Grado 11" 
                    class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white font-bold text-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-500 placeholder:text-white/10 shadow-inner" 
                  />
                </div>
              </div>
              
              <button 
                @click="currentStep = 2" 
                :disabled="!isContextValid" 
                class="relative group w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-20 disabled:translate-y-0 overflow-hidden"
              >
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                <div class="flex items-center justify-center gap-4 relative z-10">
                   Siguiente Fase: Ideación
                   <ChevronRight class="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- STEP 2: BRAINSTORMING (CHAT) -->
      <section v-if="currentStep === 2" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
        <!-- Chat Side -->
        <div class="lg:col-span-8 flex flex-col h-[750px] bg-bg-card border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl relative">
          <div class="p-8 bg-white/[0.02] border-b border-white/5 flex items-center justify-between relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 shadow-glow">
                <BrainCircuit class="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 class="text-[10px] font-black text-white uppercase tracking-[0.4em]">Cocreación Neuronal</h3>
                <div class="flex items-center gap-2">
                   <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   <p class="text-[9px] font-black text-emerald-400/70 uppercase tracking-widest">Listo para Ideación</p>
                </div>
              </div>
            </div>
            <button @click="currentStep = 1" class="px-5 py-2.5 bg-white/5 rounded-xl text-[9px] font-black text-white/40 hover:text-white hover:bg-white/10 flex items-center gap-2 uppercase tracking-[0.2em] transition-all border border-white/5">
              <ChevronLeft class="w-4 h-4" /> Volver
            </button>
          </div>

          <!-- Messages Area -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth bg-white/[0.01]">
            <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-10 opacity-40 py-20">
              <div class="relative">
                 <Sparkles class="w-20 h-20 text-primary animate-pulse" />
                 <div class="absolute -inset-10 bg-primary/10 blur-3xl rounded-full"></div>
              </div>
              <div class="space-y-4">
                 <p class="text-white/60 font-black uppercase tracking-[0.5em] text-[10px]">Describe tu visión pedagógica</p>
                 <div class="flex flex-wrap justify-center gap-4">
                  <button @click="teacherMessage = 'Diseña una dinámica disruptiva para ' + subject; sendToMentor()" class="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white/50 uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary transition-all active:scale-95">Disrupción Grupal</button>
                  <button @click="teacherMessage = 'Planifica una evaluación por competencias para ' + subject; sendToMentor()" class="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white/50 uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary transition-all active:scale-95">Evaluación Elite</button>
                </div>
              </div>
            </div>

            <div v-for="(msg, i) in chatStore.messages" :key="i" 
              :class="['flex flex-col gap-4 w-full', msg.role === 'user' ? 'items-end' : 'items-start']"
            >
              <div :class="['max-w-[85%] p-7 rounded-[2.5rem] text-[15px] leading-relaxed shadow-lg font-medium transition-all duration-700', 
                msg.role === 'user' ? 'bg-primary text-white rounded-br-none shadow-glow-primary' : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-none']">
                {{ msg.content }}
              </div>
              
              <div class="flex items-center gap-3 px-4">
                 <div class="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <User v-if="msg.role === 'user'" class="w-4 h-4 text-white/30" />
                    <Bot v-else class="w-4 h-4 text-primary" />
                 </div>
                 <span class="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                    {{ msg.role === 'user' ? 'Tú' : 'Mentor IA' }}
                 </span>
                 <button 
                  v-if="msg.role === 'assistant'" 
                  @click="useIdeaFromChat(msg.content)" 
                  class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all active:scale-95 ml-4"
                >
                  <Wand2 class="w-3 h-3" /> Sintetizar Documento
                </button>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div v-if="chatStore.isLoading" class="flex flex-col items-start">
               <div class="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-bl-none flex items-center gap-4">
                  <div class="flex gap-1.5">
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></span>
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                  </div>
                  <span class="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Procesando Neuronas...</span>
               </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-8 bg-bg-card border-t border-white/5">
            <div class="flex items-center gap-4 bg-white/5 p-2.5 pl-6 rounded-[2.5rem] border border-white/10 focus-within:border-primary/50 transition-all duration-500 shadow-inner group relative">
              <input 
                v-model="teacherMessage" 
                @keyup.enter="sendToMentor"
                type="text" 
                placeholder="Prescribe tu visión pedagógica..." 
                class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-white/20"
                :disabled="chatStore.isLoading"
              />
              <VoiceAssistant v-model="teacherMessage" :disabled="chatStore.isLoading" />
              <button 
                @click="sendToMentor" 
                class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-all shadow-glow active:scale-90 disabled:opacity-20 group-hover:rotate-12"
                :disabled="!teacherMessage.trim() || chatStore.isLoading"
              >
                <Send class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Telemetry -->
        <div class="lg:col-span-4 space-y-8">
          <div class="bg-bg-card border border-white/10 rounded-[3.5rem] p-10 relative overflow-hidden group shadow-2xl">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <h4 class="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-10 flex items-center gap-3">
              <Zap class="w-5 h-5" /> Telemetría IA
            </h4>
            
            <div class="space-y-6">
              <div class="flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Motor de Proceso</span>
                <span class="text-[11px] font-black text-white/60 tracking-widest italic">Core v4.0</span>
              </div>
              <div class="flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                <span class="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Estado de Red</span>
                <span class="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                   <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Optimizado
                </span>
              </div>
            </div>

            <hr class="my-10 border-white/5" />
            
            <button 
              @click="currentStep = 3" 
              class="relative group w-full py-5 bg-white text-bg-deep rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 overflow-hidden"
            >
              <div class="flex items-center justify-center gap-3 relative z-10">
                Confirmar Diseño
                <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </div>
            </button>
          </div>
          
          <div class="p-10 bg-primary/5 rounded-[3.5rem] border border-primary/20 relative group border-dashed shadow-inner">
            <p class="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6 flex items-center gap-3 italic">
              <Sparkles class="w-5 h-5" /> Mentor Insight
            </p>
            <p class="text-sm text-white/60 leading-relaxed font-bold italic group-hover:text-white/80 transition-colors">
              "La ideación ha detectado patrones disruptivos en tu visión. Procede a la fase de síntesis final."
            </p>
          </div>
        </div>
      </section>

      <!-- STEP 3: SÍNTESIS -->
      <section v-if="currentStep === 3" class="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up relative">
        <!-- Configuration Side -->
        <aside 
          :class="['transition-all duration-700 ease-in-out h-fit sticky top-28', 
            isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-4']"
        >
          <div :class="['bg-bg-card border border-white/10 rounded-[3.5rem] relative shadow-2xl overflow-hidden', isSidebarCollapsed ? 'p-4' : 'p-10']">
             <div class="flex items-center justify-between mb-10">
                <h3 v-if="!isSidebarCollapsed" class="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] animate-fade-in italic">Síntesis Final</h3>
                <button 
                  @click="isSidebarCollapsed = !isSidebarCollapsed"
                  class="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl text-white/30 hover:text-primary transition-all border border-white/5 flex items-center justify-center shadow-inner"
                >
                  <Maximize2 v-if="isSidebarCollapsed" :size="16" />
                  <Minimize2 v-else :size="16" />
                </button>
             </div>
             
             <div v-show="!isSidebarCollapsed" class="space-y-12 animate-fade-in">
               <div class="space-y-4">
                  <div class="flex items-center justify-between px-2">
                    <label class="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Núcleo Temático</label>
                    <VoiceAssistant v-model="topic" />
                  </div>
                  <textarea 
                    v-model="topic" 
                    class="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold text-sm focus:border-primary/50 outline-none resize-none transition-all duration-500 custom-scrollbar"
                  ></textarea>
               </div>

               <div class="space-y-6">
                <label class="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 px-2">Arquitectura del Documento</label>
                <div class="grid grid-cols-1 gap-3">
                  <button v-for="t in types" :key="t.id" @click="type = t.id"
                    :class="['flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-500 group', 
                    type === t.id ? 'border-primary bg-primary/10 shadow-glow' : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10']"
                  >
                    <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500', type === t.id ? 'bg-primary text-white scale-110 rotate-6 shadow-glow' : 'bg-white/5 text-white/20 group-hover:text-white/40']">
                       <component :is="t.icon" class="w-5 h-5" />
                    </div>
                    <div class="text-left">
                       <p :class="['font-black text-[11px] uppercase tracking-widest mb-0.5', type === t.id ? 'text-white' : 'text-white/40 group-hover:text-white/60']">{{ t.name }}</p>
                       <p class="text-[8px] font-black text-white/20 uppercase tracking-widest">{{ t.desc }}</p>
                    </div>
                  </button>
                </div>
               </div>

                <button 
                  @click="handleGenerate" 
                  :disabled="courseStore.isGenerating"
                  class="relative group w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-20 overflow-hidden mt-6"
                >
                   <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                   <div class="flex items-center justify-center gap-4 relative z-10">
                      <Loader2 v-if="courseStore.isGenerating" class="w-5 h-5 animate-spin" />
                      <Sparkles v-else class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>{{ courseStore.isGenerating ? 'Trascendiendo...' : 'Generar Artefacto' }}</span>
                   </div>
                </button>
                
                <button @click="currentStep = 2" class="w-full text-center text-[9px] font-black text-white/20 hover:text-primary uppercase tracking-[0.3em] transition-all underline decoration-primary/20 hover:decoration-primary">
                  Regresar a Ideación
                </button>
             </div>
             
             <!-- Collapsed Sidebar Decor -->
             <div v-if="isSidebarCollapsed" class="flex flex-col items-center gap-12 py-10 animate-fade-in">
                <Zap class="text-primary animate-neural-pulse w-8 h-8 shadow-glow" />
                <div class="[writing-mode:vertical-lr] rotate-180 text-[11px] font-black text-white/10 uppercase tracking-[0.6em] italic">DOCK CONFIGURATION</div>
             </div>
          </div>
        </aside>

        <!-- Result Content Area -->
        <main 
          :class="['transition-all duration-700 ease-in-out flex flex-col', 
            isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-8']"
        >
          <div v-if="courseStore.generatedContent" class="bg-bg-card border border-primary/20 rounded-[4rem] min-h-[700px] flex flex-col overflow-hidden animate-slide-up shadow-[0_40px_100px_-40px_rgba(var(--color-primary-rgb),0.3)]">
             <!-- Result Header -->
             <header class="p-8 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-full bg-primary/5 blur-3xl rounded-full -mr-32"></div>
                
                <div class="flex items-center gap-6 relative z-10">
                  <div class="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40 shadow-glow">
                    <Check class="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic mb-1">Resultado Maestro</h3>
                    <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{{ type }} • Ecosistema MentorIA</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 relative z-10">
                  <!-- Escuchar -->
                  <button 
                    @click="isSpeaking ? stop() : speak(renderedContent.replace(/<[^>]*>/g, ''))"
                    class="w-11 h-11 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:border-primary/40 group shadow-inner"
                    :class="isSpeaking ? 'text-primary' : 'text-white/40'"
                    title="Reproducción por Voz"
                  >
                    <Volume2 v-if="!isSpeaking" class="w-5 h-5" />
                    <Square v-else :size="14" class="fill-current animate-pulse" />
                  </button>

                  <div class="h-8 w-px bg-white/5 mx-1"></div>

                  <!-- Copiar/Guardar -->
                  <button @click="saveToClipboard" class="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all flex items-center gap-3">
                    <ClipboardPlus class="w-4 h-4" /> <span class="hidden sm:inline">Guardar</span>
                  </button>

                  <button @click="copyToClipboard" class="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 relative overflow-hidden">
                    <Copy v-if="!copySuccess" class="w-4 h-4" />
                    <Check v-else class="w-4 h-4 text-emerald-400" />
                    <span class="hidden sm:inline">{{ copySuccess ? 'Copiado' : 'Copiar' }}</span>
                  </button>

                  <!-- Export Elite -->
                  <div class="relative">
                    <button 
                      @click="showExportMenu = !showExportMenu"
                      class="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-glow hover:bg-secondary transition-all active:scale-95 flex items-center gap-3 group"
                    >
                      <FileDown class="w-4 h-4" /> Exportar
                      <ChevronDown class="w-4 h-4 transition-transform duration-500" :class="showExportMenu ? 'rotate-180' : ''" />
                    </button>
                    
                    <div v-if="showExportMenu" class="absolute right-0 mt-4 w-64 bg-bg-card border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden py-3 animate-page-in">
                      <button @click="handleExportResult('pdf')" class="w-full text-left px-6 py-4 text-[10px] font-black text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
                        <span class="flex items-center gap-4"><div class="w-2 h-2 bg-red-500 rounded-full group-hover:scale-150 transition-transform"></div> PDF Profesional</span>
                        <ExternalLink class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button @click="handleExportResult('excel')" class="w-full text-left px-6 py-4 text-[10px] font-black text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
                        <span class="flex items-center gap-4"><div class="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></div> Hoja Excel</span>
                        <ExternalLink class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button @click="handleExportResult('slides')" class="w-full text-left px-6 py-4 text-[10px] font-black text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
                        <span class="flex items-center gap-4"><div class="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform"></div> Diapositivas</span>
                        <ExternalLink class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
             </header>

             <!-- Preview Content -->
             <div class="flex-1 p-10 lg:p-20 overflow-y-auto preview-markdown custom-scrollbar bg-white/[0.01]">
                <div v-html="renderedContent" class="prose prose-invert prose-emerald max-w-none font-medium text-white/70 leading-relaxed"></div>
             </div>
          </div>

          <!-- Error Handle -->
          <div v-else-if="courseStore.generationError" class="bg-red-500/5 border border-red-500/20 rounded-[4rem] p-16 text-center shadow-2xl">
             <div class="w-24 h-24 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-500/20">
               <AlertCircle class="w-12 h-12 text-red-500 animate-pulse" />
             </div>
             <h3 class="text-3xl font-black text-red-200 mb-6 tracking-tight italic uppercase">Anomalía Detectada</h3>
             <p class="text-red-200/50 mb-10 font-bold text-lg leading-relaxed max-w-xl mx-auto">{{ courseStore.generationError }}</p>
             <button @click="showDiagnosis = !showDiagnosis" class="text-[10px] font-black text-red-400 uppercase underline tracking-[0.4em] hover:text-red-300 transition-colors">Telemetría de Error</button>
             <pre v-if="showDiagnosis" class="mt-10 p-10 bg-black/80 text-red-400 text-left text-[11px] rounded-[2.5rem] border border-red-500/10 overflow-x-auto custom-scrollbar font-mono">{{ courseStore.lastDiagnosis }}</pre>
          </div>

          <!-- Empty Preview -->
          <div v-else class="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/[0.02] border-4 border-dashed border-white/5 rounded-[4rem] text-center p-20 relative opacity-40">
             <div class="w-24 h-24 bg-white/5 rounded-[3rem] flex items-center justify-center mb-10 border border-white/5 animate-float">
                <BrainCircuit class="w-12 h-12 text-white/20" />
             </div>
             <p class="text-white/20 font-black uppercase tracking-[0.6em] text-[11px] italic">Esperando Síntesis Neuronal</p>
          </div>
        </main>
      </section>
    </div>
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

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); filter: blur(15px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-neural-pulse {
  animation: neuralPulse 3s ease-in-out infinite;
}

@keyframes neuralPulse {
  0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
  50% { opacity: 0.7; transform: scale(1.1); filter: brightness(1.5); }
}

/* Premium Markdown Styling */
.preview-markdown :deep(h1) { 
  @apply text-5xl font-black mb-12 text-white tracking-tighter italic border-b-8 border-primary/10 pb-6 inline-block; 
}
.preview-markdown :deep(h2) { 
  @apply text-3xl font-black mt-16 mb-8 text-primary tracking-tighter uppercase flex items-center gap-4; 
}
.preview-markdown :deep(h2::before) { 
  content: ""; 
  @apply block w-2.5 h-10 bg-primary rounded-full shadow-glow; 
}
.preview-markdown :deep(h3) { 
  @apply text-2xl font-black mt-10 mb-6 text-white/90 border-l-8 border-white/5 pl-6 italic; 
}
.preview-markdown :deep(p) { 
  @apply mb-10 leading-relaxed text-[17px] text-white/60 font-medium; 
}
.preview-markdown :deep(ul) { 
  @apply mb-10 space-y-5; 
}
.preview-markdown :deep(li) { 
  @apply flex items-start gap-5 text-[16px] text-white/70; 
}
.preview-markdown :deep(li::before) { 
  content: "→"; 
  @apply text-primary font-black text-2xl leading-none mt-0.5; 
}
.preview-markdown :deep(strong) { 
  @apply text-primary font-black filter brightness-125; 
}
.preview-markdown :deep(table) { 
  @apply w-full mb-12 border-separate border-spacing-0 bg-white/[0.02] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl; 
}
.preview-markdown :deep(th) { 
  @apply bg-white/5 p-6 text-left text-[10px] font-black uppercase tracking-[0.4em] text-primary border-b border-white/10; 
}
.preview-markdown :deep(td) { 
  @apply p-6 border-b border-white/5 text-[14px] text-white/50 font-medium; 
}
.preview-markdown :deep(blockquote) { 
  @apply border-l-8 border-primary/30 bg-primary/5 px-10 py-8 rounded-r-[2.5rem] mb-10 italic text-white/80 font-bold; 
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-white/5 rounded-full hover:bg-primary/20 transition-colors;
}

.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}

.shadow-glow-primary {
  box-shadow: 0 20px 50px -15px rgba(var(--color-primary-rgb), 0.5);
}
</style>
