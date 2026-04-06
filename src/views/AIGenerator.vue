<script setup>
import { ref, computed, onMounted } from 'vue'
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
  Terminal
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()

// Form Data
const subject = ref('')
const grade = ref('')
const topic = ref('')
const type = ref('lesson') // 'lesson', 'workshop', 'exam'

const copySuccess = ref(false)
const showDiagnosis = ref(false)

onMounted(() => {
  if (courseStore.currentCourse) {
    subject.value = courseStore.currentCourse.name || ''
    grade.value = courseStore.currentCourse.grade || ''
  }
})

const types = [
  { id: 'lesson', name: 'Lección', desc: 'Pensum y Teoría', icon: BookOpen },
  { id: 'workshop', name: 'Taller', desc: 'Ejercicios Prácticos', icon: ClipboardList },
  { id: 'exam', name: 'Examen', desc: 'Evaluación y Respuestas', icon: GraduationCap }
]

const models = [
  { id: 'gemini', name: 'Gemini 1.5', icon: Zap },
  { id: 'openai', name: 'GPT-4o', icon: Cpu }
]

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

const isFormValid = computed(() => {
  return topic.value.trim() && subject.value.trim() && grade.value.trim()
})
</script>

<template>
  <div class="max-w-7xl mx-auto pb-20 px-4 lg:px-8">
    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      
      <!-- LEFT: Configuration Sidebar (Teacher Input) -->
      <aside class="lg:col-span-4 space-y-6">
        <header class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <button @click="router.push('/dashboard')" class="p-3 bg-white rounded-xl shadow-soft hover:bg-gray-50 transition-all border border-gray-100">
              <ArrowLeft class="w-5 h-5 text-gray-400" />
            </button>
            <h1 class="text-2xl font-black text-dark tracking-tight">Diseñador Mentor IA</h1>
          </div>
        </header>

        <!-- Form Card -->
        <div class="premium-card bg-white p-8 border border-gray-100 shadow-soft">
          <div class="space-y-6">
            <!-- Subject & Grade -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Materia</label>
                <input 
                  v-model="subject"
                  type="text"
                  placeholder="Ej: Biología"
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-dark transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Grado/Nivel</label>
                <input 
                  v-model="grade"
                  type="text"
                  placeholder="Ej: 9º Grado"
                  class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-dark transition-all"
                />
              </div>
            </div>

            <!-- Topic -->
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tema Principal</label>
              <textarea 
                v-model="topic"
                placeholder="Escribe el tema específico que quieres tratar hoy..."
                class="w-full h-32 px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold text-dark transition-all resize-none shadow-inner"
              ></textarea>
            </div>

            <!-- Type Selection -->
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">¿Qué quieres generar?</label>
              <div class="grid grid-cols-1 gap-2">
                <button 
                  v-for="t in types" 
                  :key="t.id"
                  @click="type = t.id"
                  :class="[
                    'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                    type === t.id ? 'border-primary bg-primary/5' : 'border-gray-50 hover:border-gray-100'
                  ]"
                >
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-colors', type === t.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400']">
                    <component :is="t.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-dark leading-none mb-1">{{ t.name }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{{ t.desc }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Model Selection -->
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Motor IA</span>
               <div class="flex p-1 bg-white rounded-xl border border-gray-100">
                  <button 
                    v-for="m in models" 
                    :key="m.id"
                    @click="courseStore.selectedModel = m.id"
                    :class="[
                      'px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2',
                      courseStore.selectedModel === m.id ? 'bg-primary text-white shadow-soft' : 'text-gray-300 hover:text-gray-500'
                    ]"
                  >
                    <component :is="m.icon" class="w-3 h-3" />
                    {{ m.id }}
                  </button>
               </div>
            </div>

            <button 
              @click="handleGenerate"
              :disabled="!isFormValid || courseStore.isGenerating"
              class="w-full py-5 bg-dark text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-soft flex items-center justify-center gap-3 disabled:opacity-50"
            >
               <Loader2 v-if="courseStore.isGenerating" class="w-5 h-5 animate-spin" />
               <Sparkles v-else class="w-5 h-5" />
               {{ courseStore.isGenerating ? 'Generando...' : 'Comenzar Diseño' }}
            </button>
          </div>
        </div>
      </aside>

      <!-- RIGHT: Result & Display -->
      <main class="lg:col-span-8">
        
        <!-- Result View -->
        <div v-if="courseStore.generatedContent" class="premium-card bg-white h-full min-h-[700px] flex flex-col border border-gray-100 shadow-premium overflow-hidden animate-slide-up">
           <div class="p-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-4">
                 <div class="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 class="w-7 h-7 text-green-600" />
                 </div>
                 <div>
                    <h3 class="text-xl font-black text-dark tracking-tight uppercase leading-none mb-1">Documento Generado</h3>
                    <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Listo para revisión</p>
                 </div>
              </div>
              <div class="flex gap-4">
                <button @click="copyToClipboard" class="btn-secondary px-6 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase border-gray-200">
                  <Copy class="w-4 h-4" />
                  {{ copySuccess ? 'Copiado' : 'Copiar' }}
                </button>
                <button @click="router.push('/dashboard/editor')" class="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase shadow-soft flex items-center gap-2">
                  Abrir Editor
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
           </div>
           
           <!-- Content Renderer -->
           <div class="flex-1 p-12 overflow-y-auto preview-markdown custom-scrollbar">
              <div v-html="renderedContent" class="prose prose-slate lg:prose-xl max-w-none"></div>
           </div>
        </div>

        <!-- Initial/Empty State -->
        <div v-else-if="!courseStore.isGenerating && !courseStore.generationError" class="h-full min-h-[600px] flex flex-col items-center justify-center premium-card bg-white border-4 border-dashed border-gray-50 text-center p-20 mix-blend-multiply transition-all hover:border-primary/20">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
               <History class="w-12 h-12 text-gray-200" />
            </div>
            <h3 class="text-3xl font-black text-gray-200 mb-4">Esperando configuración</h3>
            <p class="text-gray-300 font-bold max-w-xs leading-relaxed italic">"El conocimiento se construye, nosotros te ayudamos a estructurarlo."</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="courseStore.isGenerating" class="h-full min-h-[600px] flex flex-col items-center justify-center premium-card bg-white border border-gray-100 text-center p-20 animate-fade-in shadow-soft">
           <div class="relative mb-12">
              <div class="w-32 h-32 bg-primary/10 rounded-full animate-ping absolute inset-0"></div>
              <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center relative shadow-premium border border-primary/20">
                 <BrainCircuit class="w-16 h-16 text-primary animate-pulse" />
              </div>
           </div>
           <h3 class="text-3xl font-black text-dark mb-6 tracking-tight">Diseñando contenido...</h3>
           <div class="space-y-3 max-w-xs mx-auto">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl" v-for="(step, i) in ['Analizando pedagogía...', 'Estructurando contenidos...', 'Creando actividades...']">
                 <div class="w-2 h-2 rounded-full bg-primary animate-bounce" :style="{animationDelay: i*0.2 + 's'}"></div>
                 <span class="text-xs font-bold text-gray-500">{{ step }}</span>
              </div>
           </div>
        </div>

        <!-- ERROR & DIAGNOSTIC State -->
        <div v-else class="h-full min-h-[600px] flex flex-col items-center justify-center premium-card bg-red-50/50 border border-red-100 text-center p-20 animate-fade-in">
           <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-10 text-red-500">
              <AlertCircle class="w-12 h-12" />
           </div>
           <h3 class="text-2xl font-black text-red-900 mb-4">Error de Conexión</h3>
           <p class="text-red-700/60 font-bold mb-8 max-w-sm">No pudimos conectar con el cerebro de Mentor IA. Esto suele deberse a que faltan los Tokens o la función no está desplegada.</p>
           
           <div class="flex flex-col gap-4">
              <button @click="handleGenerate" class="px-12 py-5 bg-red-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-soft hover:bg-red-700 transition-all">Reintentar</button>
              
              <!-- Diagnostic Toggle -->
              <button @click="showDiagnosis = !showDiagnosis" class="text-[10px] font-black text-red-300 uppercase underline mt-4">
                 {{ showDiagnosis ? 'Ocultar Diagnóstico' : 'Ver Diagnóstico Técnico' }}
              </button>

              <div v-if="showDiagnosis" class="mt-4 p-6 bg-dark rounded-2xl text-left border border-white/10 shadow-premium relative group">
                 <div class="flex items-center gap-2 text-green-400 mb-3">
                    <Terminal class="w-4 h-4" />
                    <span class="text-[9px] font-black uppercase tracking-widest">Logs de la Función</span>
                 </div>
                 <pre class="text-[11px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed opacity-90 cursor-text select-text">{{ courseStore.lastDiagnosis || 'El servidor no devolvió detalles técnicos. Intenta de nuevo.' }}</pre>
                 <div class="absolute -top-1 -right-1 flex">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                 </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.preview-markdown :deep(h1) { @apply text-4xl font-black text-dark mb-8 border-b-4 border-primary pb-4 inline-block; }
.preview-markdown :deep(h2) { @apply text-2xl font-black text-dark mt-12 mb-6 flex items-center gap-3; }
.preview-markdown :deep(p) { @apply text-gray-600 leading-relaxed mb-6; }
.preview-markdown :deep(ul) { @apply mb-8 space-y-3; }
.preview-markdown :deep(li) { @apply flex items-start gap-3 text-gray-600; }
.preview-markdown :deep(li::before) { content: "•"; @apply text-primary font-black; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-slide-up { animation: slideUp 0.6s ease-out both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.premium-card { border-radius: 2.5rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.shadow-soft { box-shadow: 0 20px 40px rgba(0,0,0,0.02); }
.shadow-premium { box-shadow: 0 30px 60px rgba(0,0,0,0.05); }

.btn-secondary { @apply bg-white border-2 border-gray-100 text-gray-400 hover:text-dark hover:border-dark transition-all active:scale-95 px-6 py-3; }
</style>
