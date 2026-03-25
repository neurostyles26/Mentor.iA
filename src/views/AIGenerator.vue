<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  BrainCircuit,
  Settings2,
  Trash2,
  Loader2
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()
const prompt = ref('')

const lessons = computed(() => courseStore.lessons)
const isGenerating = computed(() => courseStore.isGenerating)

const handleGenerate = async () => {
  if (!prompt.value) return
  await courseStore.generateLessonsForCurrentCourse(prompt.value)
  prompt.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col gap-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-dark tracking-tight mb-2">Generador de Clases IA</h1>
        <p class="text-gray-500 font-semibold">Toda tu asignatura estructurada en segundos.</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-4 bg-white rounded-2xl shadow-soft text-gray-500 hover:text-primary transition-all active:scale-95">
          <Settings2 class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Split Screen -->
    <div class="flex-1 flex gap-10 min-h-0">
      <!-- Chat Interface -->
      <div class="w-1/2 flex flex-col glass rounded-[3rem] shadow-premium overflow-hidden border border-white/50">
        <div class="p-8 border-b border-gray-100 flex items-center justify-between bg-white/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft">
              <BrainCircuit class="w-6 h-6 text-white" />
            </div>
            <span class="font-black text-lg text-dark tracking-tight">IA Mentor</span>
          </div>
          <span class="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-black uppercase tracking-widest">En línea</span>
        </div>

        <div class="flex-1 overflow-y-auto p-10 space-y-8 bg-gradient-to-b from-transparent to-gray-50/50">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center shadow-soft">
              <BrainCircuit class="w-6 h-6 text-white" />
            </div>
            <div class="bg-white p-6 rounded-t-[1.5rem] rounded-br-[1.5rem] shadow-soft border border-gray-50 max-w-[85%]">
              <p class="text-dark font-medium leading-relaxed">
                ¡Hola Prof. García! He analizado tu plan de estudio sobre **Fracciones**. ¿Quieres que genere las 10 lecciones principales o prefieres enfocarte en un tema específico?
              </p>
            </div>
          </div>

          <div v-if="isGenerating" class="flex gap-4 animate-pulse">
            <div class="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
              <BrainCircuit class="w-6 h-6 text-white" />
            </div>
            <div class="bg-white p-6 rounded-[1.5rem] shadow-soft border border-gray-50 italic text-gray-400">
              Generando estructura mágica...
            </div>
          </div>
        </div>

        <div class="p-8 bg-white/60 backdrop-blur-xl border-t border-gray-100">
          <div class="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-premium border border-gray-50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
            <input 
              v-model="prompt"
              type="text" 
              placeholder="Escribe 'Genera 10 clases sobre...'"
              class="flex-1 px-6 bg-transparent border-0 outline-none font-semibold text-lg"
              @keyup.enter="handleGenerate"
            />
            <button 
              @click="handleGenerate"
              class="p-4 bg-primary text-white rounded-full shadow-soft hover:bg-dark transition-all duration-300 active:scale-90"
            >
              <Send class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Result Preview -->
      <div class="w-1/2 flex flex-col gap-6 overflow-hidden">
        <h3 class="text-xl font-black text-dark flex items-center gap-3">
          Lecciones generadas
          <span class="px-3 py-1 bg-primary text-white rounded-full text-xs">{{ lessons.length }}</span>
        </h3>

        <div class="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
          <div 
            v-for="lesson in lessons" 
            :key="lesson.id"
            class="premium-card p-6 flex items-center justify-between group"
          >
            <div class="flex items-center gap-5">
              <div 
                class="w-12 h-12 rounded-2xl flex items-center justify-center"
                :class="lesson.status === 'ready' ? 'bg-green-50 text-green-500' : lesson.status === 'generating' ? 'bg-primary/10 text-primary animate-spin' : 'bg-gray-50 text-gray-300'"
              >
                <CheckCircle2 v-if="lesson.status === 'ready'" class="w-7 h-7" />
                <Clock v-else class="w-7 h-7" />
              </div>
              <div>
                <h4 class="font-bold text-dark group-hover:text-primary transition-colors">{{ lesson.title }}</h4>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 px-2 py-0.5 rounded-full">{{ lesson.type }}</span>
                  <span v-if="lesson.status === 'generating'" class="text-[10px] font-bold text-primary animate-pulse uppercase tracking-wider italic">Generando contenido...</span>
                </div>
              </div>
            </div>
            <button 
              @click="router.push('/editor')"
              class="p-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2 group/btn"
              :class="lesson.status !== 'ready' ? 'opacity-30 cursor-not-allowed' : ''"
            >
              <ChevronRight class="w-6 h-6 text-gray-400 group-hover/btn:text-primary group-hover/btn:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        <button 
          class="w-full py-5 bg-dark text-white rounded-[2rem] font-black text-lg shadow-premium hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          Confirmar y crear curso completo
          <Sparkles class="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
</style>
