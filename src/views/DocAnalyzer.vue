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
  ClipboardCheck
} from 'lucide-vue-next'
import { documentProcessor } from '../lib/documentProcessor'
import { supabase } from '../lib/supabase'
import { useCourseStore } from '../store/index'

const courseStore = useCourseStore()
const isUploading = ref(false)
const isProcessing = ref(false)
const currentFile = ref(null)
const extractedText = ref('')
const analysisResult = ref(null)
const selectedMode = ref(null)

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
    // Truncate to avoid token limits (approx 15000 chars is safe for most models)
    const truncatedText = extractedText.value.length > 15000 
      ? extractedText.value.substring(0, 15000) + '... [Texto truncado por longitud]'
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

const reset = () => {
  currentFile.value = null
  extractedText.value = ''
  analysisResult.value = null
  selectedMode.value = null
}
</script>

<template>
  <div class="p-6 md:p-12 space-y-12 max-w-7xl mx-auto animate-page-in">
    <!-- Header Elite -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-primary rounded-full shadow-glow"></div>
          <span class="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Laboratorio de Documentos</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">Análisis <br /> <span class="text-primary opacity-80">Multiformato</span></h1>
      </div>
      
      <p class="text-white/40 font-bold text-lg max-w-md md:text-right border-r-4 border-primary/20 pr-8 italic">
        Sincroniza Excel, Word o PDF. El Mentor extraerá la inteligencia latente de tus archivos.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Sidebar de Control -->
      <aside class="lg:col-span-4 space-y-8">
        <!-- Mode Selection -->
        <section class="space-y-6">
           <h3 class="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2">Seleccionar Propósito</h3>
           <div class="space-y-3">
              <button 
                v-for="mode in modes" 
                :key="mode.id"
                @click="selectedMode = mode"
                class="w-full p-6 rounded-3xl border transition-all duration-500 text-left group flex items-start gap-5 relative overflow-hidden"
                :class="selectedMode?.id === mode.id ? 'bg-primary/10 border-primary/40 shadow-glow' : 'bg-white/2 border-white/5 hover:border-white/20'"
              >
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                     :class="selectedMode?.id === mode.id ? 'bg-primary text-white shadow-glow' : 'bg-white/5 text-white/20'">
                  <component :is="mode.icon" class="w-6 h-6" />
                </div>
                <div>
                   <h4 class="text-sm font-black text-white uppercase tracking-tight mb-1" :class="selectedMode?.id === mode.id ? 'text-primary' : ''">{{ mode.title }}</h4>
                   <p class="text-[10px] text-white/30 font-medium leading-relaxed">{{ mode.desc }}</p>
                </div>
                <ChevronRight v-if="selectedMode?.id === mode.id" class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              </button>
           </div>
        </section>

        <!-- File Upload -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] ml-2">Carga de Activos</h3>
          <div 
            @click="triggerFileInput"
            class="border-4 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center group cursor-pointer transition-all duration-700 relative overflow-hidden text-center"
            :class="[
              currentFile ? 'border-accent/40 bg-accent/5' : 'border-white/5 bg-white/2 hover:border-primary/40 hover:bg-primary/5',
              isUploading ? 'opacity-30 pointer-events-none' : ''
            ]"
          >
            <input ref="fileInput" type="file" class="hidden" accept=".pdf,.docx,.xlsx,.xls" @change="handleFileUpload" />
            
            <div v-if="isUploading" class="flex flex-col items-center gap-4">
               <Loader2 class="w-10 h-10 text-primary animate-spin" />
               <p class="text-[10px] font-black text-primary uppercase tracking-widest">Escaneando...</p>
            </div>
            
            <template v-else-if="currentFile">
               <CheckCircle2 class="w-12 h-12 text-accent mb-4 animate-bounce" />
               <p class="text-xs font-black text-white italic truncate max-w-[200px]">{{ currentFile.name }}</p>
               <button @click.stop="reset" class="mt-4 text-[8px] font-black text-red-400 uppercase tracking-widest hover:underline">Eliminar</button>
            </template>

            <template v-else>
               <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <Upload class="w-8 h-8 text-white/20" />
               </div>
               <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Click para Cargar</p>
               <p class="text-[8px] text-white/10 mt-2 font-bold italic">PDF, Word, Excel</p>
            </template>
          </div>
        </section>

        <!-- Process Button -->
        <button 
          @click="processWithAI"
          :disabled="!currentFile || !selectedMode || isProcessing"
          class="w-full py-7 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-20 disabled:translate-y-0 group"
        >
           <div class="flex items-center justify-center gap-4">
              <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
              <Zap v-else class="w-5 h-5 group-hover:animate-pulse" />
              <span>Sintetizar con IA</span>
           </div>
        </button>
      </aside>

      <!-- Main Display -->
      <main class="lg:col-span-8">
        <div class="glass-panel min-h-[700px] border-white/5 p-8 md:p-16 relative flex flex-col">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
             <Cpu :size="300" />
          </div>

          <div v-if="analysisResult" class="relative z-10 space-y-12">
             <header class="flex items-center justify-between border-b border-white/5 pb-8">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                      <Sparkles class="w-6 h-6" />
                   </div>
                   <div>
                      <h3 class="text-[10px] font-black text-white uppercase tracking-[0.4em]">Resultado de la Red</h3>
                      <p class="text-xl font-black text-white italic tracking-tight">{{ selectedMode?.title }}</p>
                   </div>
                </div>
                <div class="flex gap-2">
                   <button class="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Download class="w-4 h-4" /></button>
                   <button class="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><ClipboardCheck class="w-4 h-4" /></button>
                </div>
             </header>

             <div class="prose-content whitespace-pre-wrap text-white/70 font-medium leading-relaxed text-lg italic selection:bg-primary/40">
                {{ analysisResult }}
             </div>
          </div>

          <div v-else-if="isProcessing" class="flex-1 flex flex-col items-center justify-center text-center space-y-8">
             <div class="relative">
                <div class="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                   <BrainCircuit class="w-12 h-12 text-primary animate-pulse" />
                </div>
             </div>
             <div class="space-y-4">
                <h3 class="text-4xl font-black text-white italic tracking-tighter uppercase animate-pulse">Procesando Neuronas</h3>
                <p class="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Extrayendo vectores de conocimiento</p>
             </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
             <Search class="w-24 h-24 text-white/20 transition-transform group-hover:scale-110 duration-700" />
             <div class="space-y-3">
                <h3 class="text-2xl font-black text-white uppercase tracking-[0.2em]">Esperando Directivas</h3>
                <p class="text-[10px] font-black uppercase tracking-[0.4em]">Configura el propósito y carga el activo</p>
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

.prose-content {
  font-family: inherit;
}
</style>
