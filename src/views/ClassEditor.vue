import { ref, computed } from 'vue'
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
  Trash2
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()

const blocks = ref([
  { id: 1, type: 'text', content: 'Una fracción representa una parte de un todo, dividido en partes exactamente iguales. Se compone de dos números: el **numerador** y el **denominador**.' },
  { id: 2, type: 'image', content: 'https://images.unsplash.com/photo-1509228468518-180dd48229d1?q=80&w=2070&auto=format&fit=crop', caption: 'Representación visual de 3/4' },
  { id: 3, type: 'quiz', content: '¿Qué número indica en cuántas partes iguales se divide el todo?', options: ['Numerador', 'Denominador', 'Cociente', 'Resto'], answer: 1 }
])

const isOptimizing = ref(false)

const addBlock = (type) => {
  const newBlock = {
    id: Date.now(),
    type,
    content: type === 'text' ? '' : type === 'image' ? 'https://images.unsplash.com/photo-1454165833767-02a6ed8a68b8?q=80&w=2070&auto=format&fit=crop' : 'Nueva pregunta...',
    ...(type === 'quiz' ? { options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], answer: 0 } : {}),
    caption: type === 'image' ? 'Pie de foto' : undefined
  }
  blocks.value.push(newBlock)
}

const removeBlock = (id) => {
  blocks.value = blocks.value.filter(b => b.id !== id)
}

const optimizeWithAI = () => {
  isOptimizing.value = true
  setTimeout(() => {
    isOptimizing.value = false
    addBlock('text')
    blocks.value[blocks.value.length - 1].content = '💡 Resumen IA: Las fracciones son esenciales para entender proporciones en la vida real. ¡Excelente contenido!'
  }, 1500)
}

<template>
  <div class="h-full flex flex-col gap-8 animate-fade-in">
    <!-- Header with Breadcrumbs & Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-gray-400 font-bold hover:text-dark cursor-pointer transition-colors" @click="router.push('/')">Cursos</span>
        <span class="text-gray-300">/</span>
        <span class="text-gray-400 font-bold">{{ courseStore.currentCourse?.name || 'Nuevo Curso' }}</span>
        <span class="text-gray-300">/</span>
        <h1 class="text-xl font-black text-dark tracking-tight">Editor de Clase</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full font-bold text-sm border border-green-100">
          <Cloud class="w-4 h-4" />
          Guardado automáticamente
        </div>
        <button class="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-primary shadow-soft active:scale-95 transition-all">
          <Eye class="w-6 h-6" />
        </button>
        <button class="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-primary shadow-soft active:scale-95 transition-all">
          <Save class="w-6 h-6" />
        </button>
        <button 
          @click="router.push('/student')"
          class="px-8 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-3 shadow-premium hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Publicar clase
          <ChevronDown class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="flex-1 flex gap-10 min-h-0">
      <!-- Sidebar Blocks -->
      <aside class="w-20 flex flex-col items-center gap-6 glass rounded-[2.5rem] py-10 shadow-premium h-fit border border-white/50 sticky top-10">
        <button class="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm group">
          <Type class="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button class="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm group">
          <ImageIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <button class="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm group">
          <CheckSquare class="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        <div class="h-px w-8 bg-gray-100"></div>
        <button class="p-4 bg-primary/10 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all shadow-soft group">
          <Plus class="w-6 h-6 group-hover:rotate-90 transition-transform" />
        </button>
      </aside>

      <!-- Editor Canvas -->
      <div class="flex-1 flex flex-col gap-10 min-h-0 overflow-y-auto pr-6 custom-scrollbar pb-20">
        <div class="glass p-16 rounded-[3.5rem] shadow-premium bg-white min-h-[1000px] relative border border-white/50">
          <!-- Title -->
          <input 
            type="text" 
            placeholder="Título de la lección"
            class="w-full text-5xl font-black text-dark mb-12 border-0 outline-none placeholder:text-gray-100 bg-transparent"
            value="Introducción a las Fracciones"
          />

          <!-- Content Blocks -->
          <div class="space-y-12">
            <div v-for="block in blocks" :key="block.id" class="group relative">
              <div class="absolute -left-16 top-0 flex flex-col gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-2 text-gray-300 hover:text-dark cursor-grab"><MoreHorizontal class="w-5 h-5" /></button>
                <button @click="removeBlock(block.id)" class="p-2 text-gray-300 hover:text-red-500"><Trash2 class="w-5 h-5" /></button>
              </div>

              <!-- Text Block -->
              <div v-if="block.type === 'text'">
                <textarea 
                  v-model="block.content"
                  class="w-full bg-transparent border-0 outline-none text-2xl text-gray-600 leading-relaxed font-medium resize-none"
                  rows="3"
                ></textarea>
              </div>

              <!-- Image Block -->
              <div v-else-if="block.type === 'image'" class="border-4 border-dashed border-primary/20 rounded-[3rem] p-1 shadow-soft overflow-hidden">
                <div class="bg-gray-50 rounded-[2.8rem] aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                  <img :src="block.content" class="w-full h-full object-cover" />
                  <div class="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur rounded-2xl flex items-center gap-3 shadow-premium border border-white">
                    <Sparkles class="w-5 h-5 text-primary" />
                    <span class="text-sm font-bold text-dark">Generado por IA</span>
                  </div>
                </div>
                <input v-model="block.caption" class="w-full text-center py-4 text-sm font-bold text-gray-400 uppercase tracking-widest outline-none bg-transparent" placeholder="Pie de foto..." />
              </div>

              <!-- Quiz Block -->
              <div v-else-if="block.type === 'quiz'" class="bg-[#F8FAFC] p-10 rounded-[3rem] border border-gray-100 shadow-inner space-y-8">
                <div class="flex items-center justify-between">
                  <h4 class="text-xl font-black text-dark flex items-center gap-3 uppercase tracking-tighter">
                    <CheckSquare class="w-6 h-6 text-primary" />
                    Mini-Desafío
                  </h4>
                  <span class="px-4 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-black">Interactivo</span>
                </div>
                <textarea v-model="block.content" class="w-full bg-transparent border-0 outline-none text-xl font-bold text-gray-600 resize-none"></textarea>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="(opt, i) in block.options" :key="i" class="px-8 py-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:border-primary transition-all">
                    <input v-model="block.options[i]" class="flex-1 bg-transparent border-0 outline-none font-bold text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Block Floating Button -->
             <div class="flex justify-center pt-6">
                <div class="flex items-center gap-4">
                  <button @click="addBlock('text')" class="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Type class="w-5 h-5" />
                    Texto
                  </button>
                  <button @click="addBlock('image')" class="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                    <ImageIcon class="w-5 h-5" />
                    Imagen
                  </button>
                  <button @click="addBlock('quiz')" class="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                    <CheckSquare class="w-5 h-5" />
                    Quiz
                  </button>
                </div>
             </div>
          </div>
        </div>

        <!-- Floating AI Optimizer -->
        <div class="fixed bottom-12 right-12 z-50">
          <button 
            @click="optimizeWithAI"
            :disabled="isOptimizing"
            class="flex items-center gap-4 px-10 py-6 bg-primary text-white rounded-[2.5rem] font-black text-xl shadow-premium hover:shadow-primary/40 hover:-translate-y-2 transition-all group active:scale-95 disabled:opacity-50"
          >
            <Loader2 v-if="isOptimizing" class="w-8 h-8 animate-spin" />
            <Sparkles v-else class="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />
            {{ isOptimizing ? 'Optimizando...' : 'Optimizar con IA' }}
          </button>
        </div>
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
