<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  Sparkles, 
  Plus, 
  Image as ImageIcon, 
  Type, 
  CheckSquare, 
  ChevronDown,
  Save,
  Eye,
  MoreHorizontal,
  Cloud,
  Loader2,
  Trash2,
  ChevronLeft,
  Wand2,
  Share2
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()

const currentLesson = ref(null)
const blocks = ref([])

onMounted(async () => {
  if (courseStore.currentCourse) {
    await courseStore.fetchLessons(courseStore.currentCourse.id)
    if (courseStore.lessons.length > 0) {
      currentLesson.value = courseStore.lessons[0]
      // Si el contenido es un string, lo ponemos en un bloque de texto inicial
      if (currentLesson.value.content && blocks.value.length === 0) {
        blocks.value.push({
          id: Date.now(),
          type: 'text',
          content: currentLesson.value.content
        })
      }
    }
  }
})

const handleSave = async () => {
  if (!currentLesson.value) return
  
  // Consolidar todos los bloques de texto en un string para el MVP
  const fullContent = blocks.value
    .map(b => b.content)
    .join('\n\n')
    
  await courseStore.updateLesson(currentLesson.value.id, fullContent)
  // Notificación tipo toast (simulada por ahora)
  alert('Clase sincronizada con el núcleo de datos')
}

const isOptimizing = ref(false)

const addBlock = (type) => {
  const newBlock = {
    id: Date.now(),
    type,
    content: type === 'text' ? '' : type === 'image' ? 'https://images.unsplash.com/photo-1454165833767-02a6ed8a68b8?q=80&w=2070&auto=format&fit=crop' : 'Nueva pregunta para el desafío...',
    ...(type === 'quiz' ? { options: ['Opción Predictiva A', 'Opción Predictiva B', 'Opción Predictiva C', 'Opción Predictiva D'], answer: 0 } : {}),
    caption: type === 'image' ? 'Metadata Visual' : undefined
  }
  blocks.value.push(newBlock)
}

const removeBlock = (id) => {
  blocks.value = blocks.value.filter(b => b.id !== id)
}

const optimizeWithAI = () => {
  isOptimizing.value = true
  // Simulación de procesamiento neuronal
  setTimeout(() => {
    isOptimizing.value = false
    addBlock('text')
    blocks.value[blocks.value.length - 1].content = '💡 Insight IA: He detectado que este contenido puede potenciarse vinculándolo con casos de estudio actuales. ¡He optimizado la redacción para maximizar la retención!'
  }, 1800)
}
</script>

<template>
  <div class="h-full flex flex-col gap-10 animate-fade-in pb-10">
    <!-- Premium Editor Header -->
    <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div class="flex items-center gap-4">
        <button @click="router.push('/dashboard')" class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
             <span class="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Editor de Archivo</span>
             <div class="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
          </div>
          <h1 class="text-xl font-black text-white tracking-tight italic">{{ courseStore.currentCourse?.name || 'Nuevo Diseño' }}</h1>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-3 px-5 py-2.5 bg-emerald-500/5 text-emerald-400 rounded-full font-black text-[10px] border border-emerald-500/10 uppercase tracking-widest mr-4">
          <Cloud class="w-4 h-4" />
          Sincronización Activa
        </div>
        
        <div class="flex items-center gap-3 bg-white/2 p-1.5 rounded-2xl border border-white/5">
          <button @click="router.push('/student')" class="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-primary transition-all">
            <Eye class="w-5 h-5" />
          </button>
          <button @click="handleSave" class="p-3 hover:bg-white/5 rounded-xl text-white/40 hover:text-primary transition-all">
            <Save class="w-5 h-5" />
          </button>
        </div>

        <button 
          @click="router.push('/student')"
          class="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-glow hover:bg-secondary transition-all active:scale-95 group"
        >
          Publicar Ecosistema
          <Share2 class="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </header>

    <!-- Main Workspace Area -->
    <div class="flex-1 flex gap-10 min-h-0">
      <!-- Blocks Toolbar (Holographic Design) -->
      <aside class="w-24 hidden md:flex flex-col items-center gap-6 glass-panel py-10 border-white/5 h-fit sticky top-0 animate-slide-right shadow-2xl">
        <div class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Blocks</div>
        
        <button @click="addBlock('text')" class="p-4 bg-white/2 border border-white/5 rounded-2xl text-white/40 hover:bg-primary hover:text-white transition-all shadow-sm group relative">
          <Type class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div class="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button @click="addBlock('image')" class="p-4 bg-white/2 border border-white/5 rounded-2xl text-white/40 hover:bg-primary hover:text-white transition-all shadow-sm group relative">
          <ImageIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div class="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <button @click="addBlock('quiz')" class="p-4 bg-white/2 border border-white/5 rounded-2xl text-white/40 hover:bg-primary hover:text-white transition-all shadow-sm group relative">
          <CheckSquare class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div class="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <div class="h-px w-8 bg-white/5 my-4"></div>
        
        <button class="p-4 bg-primary/10 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-soft group border border-primary/20">
          <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </aside>

      <!-- Collaborative Editor Canvas -->
      <div class="flex-1 flex flex-col gap-10 min-h-0 overflow-y-auto pr-6 custom-scrollbar pb-32">
        <div class="bg-bg-card/40 rounded-[3.5rem] p-12 lg:p-20 shadow-premium min-h-[1200px] relative border border-white/5 backdrop-blur-sm animate-scale-up">
          
          <!-- Virtual Paper Title -->
          <div class="relative mb-16 group">
            <input 
              type="text" 
              placeholder="Nombre de la Lección..."
              class="w-full text-4xl lg:text-6xl font-black text-white mb-4 border-0 outline-none placeholder:text-white/5 bg-transparent italic tracking-tighter"
              v-if="currentLesson"
              v-model="currentLesson.title"
            />
            <div class="h-1 w-20 bg-primary/20 rounded-full transform group-focus-within:w-full transition-all duration-700"></div>
          </div>

          <!-- Dynamic Blocks System -->
          <div class="space-y-16">
            <div v-for="block in blocks" :key="block.id" class="group relative">
              <!-- Inline Controls -->
              <div class="absolute -left-16 lg:-left-24 top-0 flex flex-col gap-3 p-2 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0">
                <button class="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white hover:bg-white/10 cursor-grab transition-all">
                  <MoreHorizontal class="w-5 h-5" />
                </button>
                <button @click="removeBlock(block.id)" class="p-3 bg-white/5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>

              <!-- Content Renderers -->
              <div v-if="block.type === 'text'" class="animate-fade-in px-4">
                <textarea 
                  v-model="block.content"
                  placeholder="Inicia la narrativa pedagógica..."
                  class="w-full bg-transparent border-0 outline-none text-xl lg:text-2xl text-white/60 leading-relaxed font-medium resize-none placeholder:text-white/5 custom-scrollbar"
                  rows="4"
                ></textarea>
              </div>

              <div v-else-if="block.type === 'image'" class="animate-fade-in border border-white/5 bg-white/2 rounded-[3rem] p-2 overflow-hidden group/img">
                <div class="relative bg-black/40 rounded-[2.8rem] aspect-video flex flex-col items-center justify-center overflow-hidden">
                  <img :src="block.content" class="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div class="absolute bottom-8 right-8 px-6 py-3 bg-primary/20 backdrop-blur-xl border border-primary/20 rounded-2xl flex items-center gap-3 shadow-glow animate-float">
                    <Sparkles class="w-5 h-5 text-primary" />
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">Activo Visual IA</span>
                  </div>
                </div>
                <input v-model="block.caption" class="w-full text-center py-5 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] outline-none bg-transparent" placeholder="Editar Atributos..." />
              </div>

              <div v-else-if="block.type === 'quiz'" class="animate-fade-in glass-panel p-10 lg:p-14 border-primary/10 relative overflow-hidden group/quiz">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover/quiz:scale-150 transition-transform"></div>
                
                <div class="flex items-center justify-between mb-10">
                  <h4 class="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
                    <Wand2 class="w-6 h-6 text-primary shadow-glow" />
                    Desafío Cognitivo
                  </h4>
                  <span class="px-5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Algoritmo Activo</span>
                </div>

                <textarea v-model="block.content" class="w-full bg-white/5 border border-white/5 rounded-2xl p-6 outline-none text-lg font-bold text-white/80 resize-none mb-8 focus:border-primary/40 transition-all"></textarea>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(opt, i) in block.options" :key="i" class="px-6 py-4 bg-white/2 border border-white/5 rounded-xl flex items-center gap-4 group/opt hover:border-primary/40 transition-all">
                    <div class="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover/opt:text-primary">
                      {{ String.fromCharCode(65 + i) }}
                    </div>
                    <input v-model="block.options[i]" class="flex-1 bg-transparent border-0 outline-none text-xs font-bold text-white/50 focus:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Contextual Add Bar (Floating between blocks) -->
             <div class="flex justify-center pt-10 border-t border-white/5">
                <div class="flex items-center gap-4 bg-white/2 p-2 rounded-3xl border border-white/5">
                  <button @click="addBlock('text')" class="flex items-center gap-3 px-6 py-3 hover:bg-white/5 rounded-2xl font-black text-[9px] text-white/40 hover:text-white transition-all uppercase tracking-widest">
                    <Type class="w-4 h-4" />
                    Texto
                  </button>
                  <button @click="addBlock('image')" class="flex items-center gap-3 px-6 py-3 hover:bg-white/5 rounded-2xl font-black text-[9px] text-white/40 hover:text-white transition-all uppercase tracking-widest">
                    <ImageIcon class="w-4 h-4" />
                    Imagen
                  </button>
                  <button @click="addBlock('quiz')" class="flex items-center gap-3 px-6 py-3 hover:bg-white/5 rounded-2xl font-black text-[9px] text-white/40 hover:text-white transition-all uppercase tracking-widest">
                    <CheckSquare class="w-4 h-4" />
                    Quiz
                  </button>
                </div>
             </div>
          </div>
        </div>

        <!-- Floating Action Optimizer (Enhanced) -->
        <div class="fixed bottom-12 right-12 z-[70]">
          <button 
            @click="optimizeWithAI"
            :disabled="isOptimizing"
            class="flex items-center gap-5 px-10 py-6 bg-primary text-white rounded-[2.5rem] font-black text-lg shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all group active:scale-95 disabled:opacity-30 relative overflow-hidden"
          >
            <!-- Animated Background Shader -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <Loader2 v-if="isOptimizing" class="w-7 h-7 animate-spin" />
            <Sparkles v-else class="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
            
            <div class="flex flex-col items-start leading-none">
              <span class="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-1">Optimización</span>
              <span class="uppercase tracking-widest">{{ isOptimizing ? 'Sintetizando...' : 'Neural Link' }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-white/5 rounded-full hover:bg-primary/40 transition-colors; }

.animate-scale-up {
  animation: scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.98) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-slide-right {
  animation: slideRight 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

input::placeholder, textarea::placeholder {
  @apply italic;
}
</style>

