import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  ArrowLeft, 
  ArrowRight, 
  BrainCircuit, 
  BookOpen,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  X
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()
const showHelp = ref(false)

const currentCourse = computed(() => courseStore.currentCourse)
const currentLesson = computed(() => courseStore.lessons[0] || { title: 'Conceptos Básicos de Fracciones' })

const handleTutorHelp = () => {
  showHelp.value = true
}

<template>
  <div class="min-h-screen bg-white font-sans flex flex-col">
    <!-- Student Header -->
    <header class="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft class="w-6 h-6 text-gray-400" />
        </button>
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-widest text-primary">Lección 01</span>
          <h1 class="text-xl font-black text-dark tracking-tight">{{ currentLesson.title }}</h1>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="w-1/3 h-full bg-secondary transition-all duration-1000"></div>
          </div>
          <span class="text-xs font-black text-gray-400 uppercase tracking-widest">33%</span>
        </div>
        <div class="h-8 w-px bg-gray-100"></div>
        <button 
          @click="handleTutorHelp"
          class="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
        >
          <BrainCircuit class="w-5 h-5" />
          IA Tutor
        </button>
      </div>
    </header>

    <!-- AI Tutor Modal -->
    <div v-if="showHelp" class="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-dark/20 animate-fade-in">
      <div class="glass max-w-lg w-full p-10 rounded-[3rem] shadow-premium relative border border-white">
        <button @click="showHelp = false" class="absolute top-8 right-8 p-2 text-gray-400 hover:text-dark transition-colors">
          <X class="w-6 h-6" />
        </button>
        <div class="flex gap-6 items-start mb-8">
          <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-soft shrink-0">
            <BrainCircuit class="w-10 h-10 text-white" />
          </div>
          <div>
             <h3 class="text-2xl font-black text-dark tracking-tight">IA Mentor Explica</h3>
             <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">Apoyo en tiempo real</p>
          </div>
        </div>
        <div class="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8">
           <p class="text-lg font-medium text-dark leading-relaxed">
             "Veo que tienes dudas. Imagina que las **fracciones** son como piezas de un rompecabezas. El **denominador** te dice cuántas piezas tiene el rompecabezas completo, y el **numerador** cuántas tienes en la mano."
           </p>
        </div>
        <button @click="showHelp = false" class="w-full py-4 bg-dark text-white rounded-2xl font-bold hover:bg-primary transition-all">
          ¡Ya entendí, gracias!
        </button>
      </div>
    </div>

    <!-- Reading Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Index Sidebar -->
      <aside class="w-80 border-r border-gray-100 p-8 hidden xl:flex flex-col overflow-y-auto bg-gray-50/30">
        <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Contenido de la clase</h3>
        <div class="space-y-4">
          <div v-for="(item, i) in ['¿Qué es una fracción?', 'Numerador y Denominador', 'Ejemplos Visuales', 'Desafío Rápido', 'Resumen']" :key="item" 
            class="flex items-center gap-4 p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 border-transparent"
            :class="i === 0 ? 'bg-white shadow-soft border-primary/10 text-primary font-black' : 'text-gray-400 font-bold hover:text-dark'"
          >
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="i === 0 ? 'bg-primary text-white' : 'bg-gray-100'">
              <span class="text-xs">{{ i + 1 }}</span>
            </div>
            <span class="text-sm">{{ item }}</span>
          </div>
        </div>
      </aside>

      <!-- Main Content Canvas -->
      <main class="flex-1 overflow-y-auto p-12 md:p-24 bg-white relative">
        <div class="max-w-3xl mx-auto space-y-16 animate-fade-in">
          <section class="space-y-10">
            <h2 class="text-5xl font-black text-dark leading-tight tracking-tighter">¿Qué es realmente una fracción?</h2>
            <p class="text-2xl text-gray-600 leading-relaxed font-normal">
              Imagina que tienes una pizza deliciosa. Si la cortas por la mitad, cada trozo es una parte de esa pizza. En matemáticas, esa "parte" es lo que llamamos una **fracción**.
            </p>
            
            <div class="bg-primary/5 rounded-[3rem] p-12 flex flex-col items-center gap-10 border border-primary/10 relative overflow-hidden group">
               <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
               <div class="flex gap-16 items-center">
                  <div class="flex flex-col items-center gap-4">
                     <span class="text-sm font-black uppercase text-gray-400 tracking-widest">Numerador</span>
                     <div class="w-20 h-20 bg-white shadow-soft rounded-2xl flex items-center justify-center text-4xl font-black text-primary border-b-4 border-primary">1</div>
                  </div>
                  <div class="h-2 w-16 bg-gray-200 rounded-full"></div>
                  <div class="flex flex-col items-center gap-4">
                     <span class="text-sm font-black uppercase text-gray-400 tracking-widest">Denominador</span>
                     <div class="w-20 h-20 bg-white shadow-soft rounded-2xl flex items-center justify-center text-4xl font-black text-dark border-b-4 border-dark">2</div>
                  </div>
               </div>
               <p class="text-center text-lg font-bold text-gray-500 italic max-w-md">
                 "El denominador me dice cuántas partes hay en total, y el numerador cuántas he tomado yo."
               </p>
            </div>
          </section>

          <section class="space-y-8">
            <h3 class="text-3xl font-black text-dark tracking-tight">Ejemplo Gráfico</h3>
             <div class="grid grid-cols-3 gap-6">
                <div v-for="n in [2, 3, 4]" :key="n" class="aspect-square bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-gray-100 hover:scale-105 transition-all">
                  <div class="w-24 h-24 rounded-full border-4 border-gray-200 relative overflow-hidden">
                    <div class="absolute inset-0 bg-primary opacity-30" :style="{ clipPath: `conic-gradient(white 0% ${100/n}%, transparent ${100/n}% 100%)` }"></div>
                  </div>
                  <span class="font-black text-dark text-xl">1/{{ n }}</span>
                </div>
             </div>
          </section>
        </div>

        <!-- Floating AI Support -->
        <div class="sticky bottom-10 mt-20 flex flex-col items-center gap-6">
          <div class="glass p-6 rounded-[2.5rem] flex items-center gap-6 shadow-premium border border-white max-w-lg w-full">
            <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-soft animate-bounce">
              <BrainCircuit class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-black text-dark mb-1">¿Tienes alguna duda?</p>
              <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Tu Tutor IA está listo para explicarlo de otra forma.</p>
            </div>
            <button 
              @click="handleTutorHelp"
              class="px-6 py-4 bg-dark text-white rounded-2xl font-bold text-sm shadow-soft hover:bg-primary transition-all"
            >
               No entendí (Ayuda IA)
            </button>
          </div>
          
          <div class="flex items-center gap-4 w-full max-w-3xl justify-between border-t border-gray-100 pt-10">
             <button class="flex items-center gap-2 px-8 py-4 text-gray-400 font-bold hover:text-dark transition-all">
               <ArrowLeft class="w-5 h-5" />
               Lección anterior
             </button>
             <button class="flex items-center gap-3 px-10 py-5 bg-secondary text-white rounded-2xl font-black text-lg shadow-premium hover:shadow-secondary/30 transition-all active:scale-95 group">
                Siguiente Lección
                <ArrowRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
