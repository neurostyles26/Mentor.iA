<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  Sparkles, 
  ArrowLeft, 
  BrainCircuit, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Copy,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()
const topic = ref('')
const copySuccess = ref(false)

const handleGenerate = async () => {
  if (!topic.value.trim()) return
  await courseStore.generateLessonsWithAI(topic.value)
}

const copyToClipboard = () => {
  if (!courseStore.generatedContent) return
  navigator.clipboard.writeText(courseStore.generatedContent)
  copySuccess.value = true
  setTimeout(() => copySuccess.value = false, 2000)
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="max-w-5xl mx-auto pb-20">
    <!-- Header -->
    <header class="flex items-center justify-between mb-12 animate-fade-in">
      <div class="flex items-center gap-6">
        <button 
          @click="goToDashboard"
          class="p-4 bg-white rounded-2xl text-gray-400 hover:text-dark hover:shadow-soft transition-all active:scale-95 border border-gray-100"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <div>
          <h1 class="text-4xl font-black text-dark tracking-tight mb-2">Generador de Lecciones IA</h1>
          <p class="text-gray-500 font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Potenciado por DeepSeek-Chat
          </p>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Input Sidebar -->
      <div class="lg:col-span-5 space-y-8 animate-slide-up">
        <div class="premium-card p-10 bg-white">
          <div class="flex items-center gap-4 mb-8">
            <div class="p-3 bg-primary/10 rounded-2xl">
              <Sparkles class="w-6 h-6 text-primary" />
            </div>
            <h2 class="text-xl font-black text-dark uppercase tracking-wider">Configuración</h2>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-dark mb-3 uppercase tracking-widest ml-1">Tema de la lección</label>
              <textarea 
                v-model="topic"
                placeholder="Ej: Las leyes de Newton, El ciclo del agua, La revolución francesa..."
                class="w-full h-40 px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all outline-none text-lg font-medium placeholder:text-gray-300 resize-none"
              ></textarea>
            </div>

            <div v-if="courseStore.currentCourse" class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
               <p class="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widestAlpha">Curso Activo</p>
               <div class="flex items-center justify-between">
                  <span class="font-bold text-dark">{{ courseStore.currentCourse.name }}</span>
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-black">{{ courseStore.currentCourse.grade }}</span>
               </div>
            </div>

            <button 
              @click="handleGenerate"
              :disabled="courseStore.isGenerating || !topic.trim()"
              class="w-full py-6 bg-dark text-white rounded-[2rem] font-black text-xl shadow-premium hover:bg-primary hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-4 group"
            >
              <Loader2 v-if="courseStore.isGenerating" class="w-6 h-6 animate-spin" />
              <BrainCircuit v-else class="w-6 h-6 group-hover:rotate-12 transition-transform" />
              {{ courseStore.isGenerating ? 'Generando...' : 'Generar con IA' }}
            </button>
          </div>
        </div>

        <!-- Help Card -->
        <div class="p-8 bg-gradient-to-br from-secondary to-blue-600 rounded-[2.5rem] text-white shadow-soft relative overflow-hidden">
           <div class="relative z-10">
              <h3 class="text-lg font-black mb-3">Consejo de MentorIA</h3>
              <p class="text-sm font-semibold opacity-90 leading-relaxed">Describe brevemente el tema y nivel educativo. Nuestra IA estructurará 5 lecciones completas con explicación, ejemplos y actividades.</p>
           </div>
           <Sparkles class="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12" />
        </div>
      </div>

      <!-- Result Area -->
      <div class="lg:col-span-7 animate-slide-up" style="animation-delay: 0.1s">
        <!-- Loading State -->
        <div v-if="courseStore.isGenerating" class="h-full min-h-[500px] flex flex-col items-center justify-center premium-card bg-white text-center p-20 border-dashed border-4 border-gray-100">
           <div class="relative mb-10">
              <div class="w-24 h-24 bg-primary/10 rounded-full animate-ping absolute inset-0"></div>
              <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center relative shadow-soft border-2 border-primary/20">
                 <BrainCircuit class="w-12 h-12 text-primary animate-pulse" />
              </div>
           </div>
           <h3 class="text-2xl font-black text-dark mb-4 tracking-tight">Consultando redes neuronales...</h3>
           <p class="text-gray-400 font-bold max-w-sm leading-relaxed">DeepSeek está estructurando tus lecciones pedagógicamente. Esto tomará unos segundos.</p>
        </div>

        <!-- Error State -->
        <div v-else-if="courseStore.generationError" class="h-full min-h-[500px] flex flex-col items-center justify-center premium-card bg-red-50 p-20 text-center border-red-100">
           <AlertCircle class="w-20 h-20 text-red-500 mb-8" />
           <h3 class="text-2xl font-black text-red-900 mb-4">{{ courseStore.generationError }}</h3>
           <button @click="handleGenerate" class="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-soft">Reintentar generación</button>
        </div>

        <!-- Result View -->
        <div v-else-if="courseStore.generatedContent" class="flex flex-col h-full premium-card bg-white overflow-hidden shadow-premium border-gray-100">
           <div class="px-10 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <CheckCircle2 class="w-6 h-6 text-green-600" />
                 </div>
                 <h3 class="text-xl font-black text-dark tracking-tight uppercase">Contenido listo</h3>
              </div>
              <button 
                @click="copyToClipboard"
                class="flex items-center gap-3 px-6 py-2 bg-white rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:text-dark hover:border-dark transition-all active:scale-95"
              >
                <Copy v-if="!copySuccess" class="w-4 h-4" />
                <CheckCircle2 v-else class="w-4 h-4 text-green-500" />
                {{ copySuccess ? 'Copiado' : 'Copiar' }}
              </button>
           </div>
           
           <div class="flex-1 overflow-y-auto p-12 bg-white prose prose-slate max-w-none">
              <div class="text-lg text-dark leading-relaxed whitespace-pre-wrap font-medium font-sans italic opacity-90">{{ courseStore.generatedContent }}</div>
           </div>

           <div class="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-6">
              <button @click="router.push('/dashboard')" class="px-10 py-4 bg-white border-2 border-gray-200 rounded-2xl font-black text-gray-400 hover:text-dark hover:border-dark transition-all active:scale-95 uppercase tracking-widest text-xs">
                Descartar
              </button>
              <button @click="router.push('/editor')" class="px-12 py-4 bg-primary text-white rounded-2xl font-black shadow-premium hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center gap-3">
                Continuar al Editor
                <ChevronRight class="w-4 h-4" />
              </button>
           </div>
        </div>

        <!-- Empty State -->
        <div v-else class="h-full min-h-[500px] flex flex-col items-center justify-center premium-card bg-white p-20 text-center border-dashed border-4 border-gray-100">
           <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
              <Sparkles class="w-12 h-12 text-gray-200" />
           </div>
           <h3 class="text-2xl font-black text-gray-300 tracking-tight">Esperando entrada del docente...</h3>
           <p class="text-gray-300 font-bold max-w-xs leading-relaxed">Escribe un tema a la izquierda para que nuestra IA genere contenido educativo de calidad.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
