<script setup> 
import { ref } from 'vue'
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  Zap, 
  BrainCircuit,
  Search,
  FileSpreadsheet,
  FileEdit,
  GraduationCap,
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  Trash2, 
  Download, 
  ClipboardCheck, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  ChevronDown
} from 'lucide-vue-next'
import { documentProcessor } from '../lib/documentProcessor'
import { supabase } from '../lib/supabase'
import { useCourseStore } from '../store/index'
import { useTextToSpeech } from '../composables/useTextToSpeech'

const courseStore = useCourseStore()
const { speak, stop, isSpeaking } = useTextToSpeech()
const isUploading = ref(false)
const isProcessing = ref(false)
const currentFile = ref(null)
const extractedText = ref('')
const analysisResult = ref(null)
const selectedMode = ref(null)
const isSidebarCollapsed = ref(false)
const isDropdownOpen = ref(false)
const selectMode = (mode) => {
  selectedMode.value = mode
  isDropdownOpen.value = false
}

const modes = [
  { 
    id: 'summary', 
    title: 'Síntesis Pedagógica', 
    desc: 'Extrae conceptos clave y resúmenes ejecutivos.', 
    icon: FileText,
    prompt: 'Resume este documento extrayendo los puntos clave, conceptos fundamentales y una conclusión pedagógica.'
  },
  { 
    id: 'grading', 
    title: 'Evaluación de Notas', 
    desc: 'Analiza listas de calificaciones o trabajos.', 
    icon: GraduationCap,
    prompt: 'Analiza este documento como un docente experto. Si es una lista de notas, genera estadísticas. Si es un trabajo, evalúalo con criterios pedagógicos.'
  },
  { 
    id: 'homework', 
    title: 'Generador de Tareas', 
    desc: 'Crea actividades basadas en el contenido.', 
    icon: FileEdit,
    prompt: 'Basado en este documento, genera 3 actividades creativas para los estudiantes, incluyendo objetivos y criterios de evaluación.'
  }
]

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  currentFile.value = file

  try {
    const text = await documentProcessor.extractText(file)
    extractedText.value = text
  } catch (error) {
    console.error('Error extracting text:', error)
    alert('Error al procesar el archivo: ' + error.message)
  } finally {
    isUploading.value = false
  }
}

const processWithAI = async () => {
  if (!extractedText.value || !selectedMode.value) return

  isProcessing.value = true
  analysisResult.value = null

  try {
    // Aumentamos el límite a 200,000 caracteres para procesar documentos extensos
    const truncatedText = extractedText.value.length > 200000 
      ? extractedText.value.substring(0, 200000) + '... [Texto truncado por longitud máxima]'
      : extractedText.value

    const prompt = `Modo: ${selectedMode.value.title}\nInstrucción específica: ${selectedMode.value.prompt}\n\nContenido del documento:\n"""\n${truncatedText}\n"""`

    const { data, error } = await supabase.functions.invoke('tutor-chat', {
      body: { 
        pregunta: prompt, 
        contexto: 'Eres un analista de documentos pedagógicos experto en MentorIA. Tu objetivo es ayudar al docente con el contenido proporcionado. Responde con un tono profesional, elegante y estructurado.' 
      }
    })

    if (error) throw error
    analysisResult.value = data.text
  } catch (error) {
    console.error('AI Error:', error)
    alert('Error al procesar con IA: ' + error.message)
  } finally {
    isProcessing.value = false
  }
}

// Auto-collapse sidebar during processing to maximize space
import { watch } from 'vue'
watch(isProcessing, (newValue) => {
  if (newValue) {
    isSidebarCollapsed.value = true
  }
})

const copyToClipboard = async () => {
  if (!analysisResult.value) return
  try {
    await navigator.clipboard.writeText(analysisResult.value)
    alert('¡Copiado al portapapeles!')
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const downloadAsWord = () => {
  if (!analysisResult.value) return
  
  const filename = `MentorIA_${currentFile.value?.name.split('.')[0] || 'Analisis'}.doc`
  
  // Limpieza profunda de Markdown para Word
  const cleanContent = analysisResult.value
    .replace(/#{1,6}\s?(.*?)\n/g, '<h2 style="color: #1e293b; font-size: 16pt; margin-top: 20pt; margin-bottom: 10pt;">$1</h2>')
    .replace(/\*\*\s?(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*\s?(.*?)\*/g, '<em>$1</em>')
    .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n/g, '<br>')

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
    <style>
      @page { size: 8.5in 11in; margin: 2.5cm; }
      body { font-family: 'Arial', sans-serif; font-size: 12pt; line-height: 1.6; color: #334155; }
      .header-table { width: 100%; border-bottom: 2pt solid #6366f1; margin-bottom: 20pt; }
      .brand { font-size: 18pt; font-weight: bold; color: #6366f1; font-style: italic; }
      .subtitle { font-size: 9pt; color: #64748b; text-transform: uppercase; letter-spacing: 2pt; }
    </style>
    </head><body>
    <table class="header-table">
      <tr>
        <td>
          <div class="brand">MENTORIA</div>
          <div class="subtitle">Intelligence Suite | Laboratorio Pedagógico</div>
        </td>
        <td style="text-align: right; color: #64748b; font-size: 10pt;">
          Generado el ${new Date().toLocaleDateString()}
        </td>
      </tr>
    </table>
  `
  const footer = "</body></html>"
  
  const sourceHTML = header + cleanContent + footer
  
  const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const reset = () => {
  currentFile.value = null
  extractedText.value = ''
  analysisResult.value = null
  selectedMode.value = null
  stop()
}

const toggleSpeech = () => {
  if (isSpeaking.value) {
    stop()
  } else {
    speak(analysisResult.value)
  }
}
</script>

<template>
  <div class="p-4 sm:p-8 md:p-12 space-y-8 sm:space-y-12 max-w-7xl mx-auto animate-page-in">
    <!-- Header Elite -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
      <div class="space-y-3 sm:space-y-4">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full shadow-glow"></div>
          <span class="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em]">Laboratorio de Documentos</span>
        </div>
        <h1 class="text-3xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">Análisis <br /> <span class="text-primary opacity-80">Multiformato</span></h1>
      </div>
      
      <p class="text-base sm:text-lg text-white/40 font-bold max-w-md md:text-right border-r-0 md:border-r-4 border-primary/20 md:pr-8 italic px-2 md:px-0">
        Sincroniza Excel, Word o PDF. El Mentor extraerá la inteligencia latente de tus archivos.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 relative">
      <!-- Sidebar de Control -->
      <aside 
        :class="['transition-all duration-700 ease-in-out lg:sticky lg:top-24 h-fit', 
          isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-4']"
      >
        <div :class="['glass-panel border-white/5 relative overflow-hidden transition-all duration-700', isSidebarCollapsed ? 'p-3' : 'p-6 sm:p-8']">
          <!-- Toggle Button -->
          <div class="flex items-center justify-between mb-6">
            <h3 v-if="!isSidebarCollapsed" class="text-[9px] sm:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Configuración</h3>
            <button 
              @click="isSidebarCollapsed = !isSidebarCollapsed"
              class="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-primary transition-all border border-white/10 flex items-center justify-center shadow-inner"
            >
              <ChevronRight v-if="isSidebarCollapsed" class="w-4 h-4" />
              <ChevronLeft v-else class="w-4 h-4" />
            </button>
          </div>

          <div v-show="!isSidebarCollapsed" class="space-y-8 animate-fade-in">
            <!-- Custom Mode Selection (The "Dropdown") -->
            <section class="space-y-4">
               <h3 class="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] ml-2">Misión / Propósito</h3>
               <div class="relative">
                 <button 
                   @click="isDropdownOpen = !isDropdownOpen"
                   class="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-sm hover:border-primary/40 transition-all group"
                   :class="isDropdownOpen ? 'border-primary/60 shadow-glow bg-white/10' : ''"
                 >
                   <div class="flex items-center gap-3">
                     <component :is="selectedMode?.icon || BrainCircuit" class="w-4 h-4" :class="selectedMode ? 'text-primary' : 'text-white/20'" />
                     <span :class="!selectedMode ? 'text-white/20' : ''">{{ selectedMode?.title || 'Seleccionar Propósito' }}</span>
                   </div>
                   <ChevronDown class="w-4 h-4 text-white/20 group-hover:text-primary transition-transform duration-500" :class="isDropdownOpen ? 'rotate-180' : ''" />
                 </button>

                 <!-- Custom Dropdown Menu -->
                 <Transition name="fade-slide">
                   <div v-if="isDropdownOpen" class="absolute z-50 top-full left-0 right-0 mt-3 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2">
                     <button 
                       v-for="mode in modes" 
                       :key="mode.id"
                       @click="selectMode(mode)"
                       class="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-primary/10 transition-all text-left group"
                       :class="selectedMode?.id === mode.id ? 'bg-primary/10 border border-primary/20' : 'border border-transparent'"
                     >
                       <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="selectedMode?.id === mode.id ? 'bg-primary text-white' : 'bg-white/5 text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors'">
                         <component :is="mode.icon" class="w-5 h-5" />
                       </div>
                       <div>
                         <p class="text-xs font-black text-white uppercase tracking-tight mb-0.5" :class="selectedMode?.id === mode.id ? 'text-primary' : ''">{{ mode.title }}</p>
                         <p class="text-[8px] text-white/30 font-medium leading-tight">{{ mode.desc }}</p>
                       </div>
                     </button>
                   </div>
                 </Transition>
               </div>
            </section>

            <!-- File Upload Elite -->
            <section class="space-y-4">
              <h3 class="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] ml-2">Activo de Datos</h3>
              <div 
                @click="triggerFileInput"
                class="border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center group cursor-pointer transition-all duration-700 relative overflow-hidden text-center"
                :class="[
                  currentFile ? 'border-accent/40 bg-accent/5' : 'border-white/5 bg-white/2 hover:border-primary/40 hover:bg-primary/5',
                  isUploading ? 'opacity-30 pointer-events-none' : ''
                ]"
              >
                <!-- Background Pulse -->
                <div v-if="!currentFile" class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>

                <input ref="fileInput" type="file" class="hidden" accept=".pdf,.docx,.xlsx,.xls" @change="handleFileUpload" />
                
                <Loader2 v-if="isUploading" class="w-8 h-8 text-primary animate-spin" />
                
                <template v-else-if="currentFile">
                   <div class="relative">
                     <CheckCircle2 class="w-10 h-10 text-accent mb-3 animate-bounce" />
                     <div class="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
                   </div>
                   <p class="text-[10px] font-black text-white italic truncate max-w-[180px]">{{ currentFile.name }}</p>
                   <button @click.stop="reset" class="mt-4 text-[8px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">Eliminar Activo</button>
                </template>

                <template v-else>
                   <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all border border-white/5">
                      <Upload class="w-6 h-6 text-white/20" />
                   </div>
                   <p class="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Prescribir Archivo</p>
                   <p class="text-[7px] font-bold text-white/10 uppercase tracking-[0.2em]">PDF • Word • Excel</p>
                </template>
              </div>
            </section>

            <!-- Process Button Elite -->
            <button 
              @click="processWithAI" 
              :disabled="!currentFile || !selectedMode || isProcessing"
              class="w-full py-6 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-10 disabled:translate-y-0 group relative overflow-hidden"
            >
               <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
               <div class="flex items-center justify-center gap-4 relative z-10">
                  <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
                  <Zap v-else class="w-5 h-5 group-hover:animate-pulse" />
                  <span>Sintetizar Red</span>
               </div>
            </button>
          </div>

          <!-- Collapsed State Icons -->
          <div v-if="isSidebarCollapsed" class="flex flex-col items-center gap-8 py-10 animate-fade-in">
             <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border transition-all', selectedMode ? 'bg-primary/20 border-primary/40 text-primary shadow-glow' : 'bg-white/5 border-white/10 text-white/20']">
                <component :is="selectedMode?.icon || BrainCircuit" class="w-5 h-5" />
             </div>
             <div :class="['w-10 h-10 rounded-xl flex items-center justify-center border transition-all', currentFile ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-white/5 border-white/10 text-white/20']">
                <FileText class="w-5 h-5" />
             </div>
             <div class="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black text-white/10 uppercase tracking-[0.4em] italic">LAB DOCK</div>
          </div>
        </div>
      </aside>

      <!-- Main Display -->
      <main 
        :class="['transition-all duration-700 ease-in-out', 
          isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-8']"
      >
        <div class="glass-panel min-h-[500px] sm:min-h-[700px] border-white/5 p-6 sm:p-10 md:p-16 relative flex flex-col">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.02] pointer-events-none">
             <Cpu :size="200" class="sm:size-[300px]" />
          </div>

          <div v-if="analysisResult" class="relative z-10 space-y-8 sm:space-y-12">
             <header class="flex flex-wrap items-center justify-between border-b border-white/5 pb-6 sm:pb-8 gap-4">
                <div class="flex items-center gap-3 sm:gap-4">
                   <div class="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 rounded-lg sm:rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <Sparkles class="w-5 h-5 sm:w-6 sm:h-6" />
                   </div>
                   <div>
                      <h3 class="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.4em]">Resultado de la Red</h3>
                      <p class="text-lg sm:text-xl font-black text-white italic tracking-tight">{{ selectedMode?.title }}</p>
                   </div>
                </div>
                 <div class="flex gap-2">
                   <button 
                     @click="toggleSpeech"
                     title="Escuchar análisis"
                     class="p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all border"
                     :class="isSpeaking ? 'bg-primary/20 text-primary border-primary/40 shadow-glow' : 'bg-white/5 text-white/40 border-white/10 hover:text-white'"
                   >
                     <Volume2 v-if="!isSpeaking" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                     <VolumeX v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>
                   
                   <button 
                     @click="downloadAsWord"
                     title="Descargar Word"
                     class="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl text-white/40 hover:text-white transition-all border border-white/10"
                   >
                     <Download class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>
                   
                   <button 
                     @click="copyToClipboard"
                     title="Copiar texto"
                     class="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl text-white/40 hover:text-white transition-all border border-white/10"
                   >
                     <ClipboardCheck class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                   </button>
                </div>
             </header>

             <div class="prose-content whitespace-pre-wrap text-white/70 font-medium leading-relaxed text-base sm:text-lg italic selection:bg-primary/40">
                {{ analysisResult }}
             </div>
          </div>

          <div v-else-if="isProcessing" class="flex-1 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
             <div class="relative">
                <div class="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                   <BrainCircuit class="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-pulse" />
                </div>
             </div>
             <div class="space-y-3 sm:space-y-4">
                <h3 class="text-2xl sm:text-4xl font-black text-white italic tracking-tighter uppercase animate-pulse">Procesando Neuronas</h3>
                <p class="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.4em] sm:tracking-[0.6em]">Extrayendo vectores de conocimiento</p>
             </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 opacity-20 group py-10 sm:py-20">
             <Search class="w-16 h-16 sm:w-24 sm:h-24 text-white/20 transition-transform group-hover:scale-110 duration-700" />
             <div class="space-y-2 sm:space-y-3">
                <h3 class="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.1em] sm:tracking-[0.2em]">Esperando Directivas</h3>
                <p class="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">Configura el propósito y carga el activo</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-page-in {
  animation: pageIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(40px); filter: blur(15px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.shadow-glow-primary {
  box-shadow: 0 0 80px -10px rgba(99, 102, 241, 0.4);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

select option {
  background-color: #0f172a;
  color: white;
}

.prose-content {
  font-family: inherit;
}
</style>
