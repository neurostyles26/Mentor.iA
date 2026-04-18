<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '../store'
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Upload,
  Sparkles,
  CheckCircle2,
  Building2,
  Trophy,
  Loader2,
  FileText
} from 'lucide-vue-next'

const router = useRouter()
const courseStore = useCourseStore()
const isUploading = ref(false)
const fileInput = ref(null)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const url = await courseStore.uploadMaterial(file)
    console.log('File uploaded:', url)
  } catch (error) {
    alert('Error al subir el archivo. Por favor verifica tu conexión.')
  } finally {
    isUploading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const currentStep = ref(1)
const steps = ['Entorno', 'Objetivos', 'Recursos', 'Sintetizar']

const nextStep = async () => {
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    try {
      await courseStore.createCourseFromDraft()
      router.push('/dashboard/create') // Redirect to the generator view within dashboard
    } catch (error) {
      console.error('Error finalising course:', error)
      alert('Hubo un error al crear el curso. Revisa tu conexión.')
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-12 px-6 lg:px-0 animate-fade-in relative">
    <!-- Premium Glow Backgrounds -->
    <div class="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] -z-10 animate-pulse" style="animation-delay: 2s"></div>

    <!-- Header Section -->
    <div class="flex items-center justify-between mb-12">
      <button 
        @click="router.back()" 
        class="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 font-bold hover:text-white hover:bg-white/10 transition-all group"
      >
        <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Regresar
      </button>

      <div class="text-right">
        <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">Configuración de Cátedra</h1>
        <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1">Ecosistema MentorIA v2.5</p>
      </div>
    </div>

    <!-- Stepper Navigation -->
    <div class="glass-panel p-8 md:p-10 mb-12 border-primary/20 relative overflow-hidden">
      <div class="flex items-center justify-between relative z-10">
        <!-- Connecting Line -->
        <div class="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-[24px] md:-translate-y-[28px] -z-10"></div>
        <div 
          class="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary to-secondary -translate-y-[24px] md:-translate-y-[28px] -z-10 transition-all duration-700"
          :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
        ></div>

        <div 
          v-for="(step, index) in steps" 
          :key="step"
          class="flex flex-col items-center gap-4 group"
        >
          <div 
            class="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 shadow-glow relative overflow-hidden"
            :class="index + 1 <= currentStep ? 'bg-primary text-white scale-110' : 'bg-bg-card text-white/20 border border-white/5'"
          >
            <CheckCircle2 v-if="index + 1 < currentStep" class="w-8 h-8" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span 
            class="text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500"
            :class="index + 1 <= currentStep ? 'text-primary' : 'text-white/20'"
          >
            {{ step }}
          </span>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="glass-panel p-8 md:p-16 min-h-[500px] flex flex-col border-white/5">
      
      <!-- STEP 1: ENTORNO Y MATERIA -->
      <div v-if="currentStep === 1" class="space-y-12 animate-slide-up">
        <header class="space-y-4">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Building2 class="w-4 h-4" /> Contexto Educativo
          </div>
          <h2 class="text-4xl font-black text-white italic tracking-tighter">¿Dónde y a quién enseñaremos?</h2>
          <p class="text-white/50 text-sm font-medium leading-relaxed max-w-2xl">Configura el ecosistema base. Estos datos permiten a la IA ajustar el nivel de complejidad y el tono pedagógico de tus contenidos.</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div class="space-y-4">
            <label class="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
              Institución Educativa
            </label>
            <input 
              type="text" 
              placeholder="Ej: Colegio San José, Universidad Nacional"
              class="input-field w-full text-lg font-bold"
            />
          </div>

          <div class="space-y-4">
            <label class="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
              Grado o Nivel Educativo
            </label>
            <select 
              v-model="courseStore.newCourseDraft.grade"
              class="input-field w-full text-lg font-bold appearance-none cursor-pointer"
            >
              <option value="">Seleccionar nivel...</option>
              <option v-for="n in 11" :key="n" :value="`${n}º Grado`">{{ n }}º Grado</option>
              <option value="Universitario">Nivel Universitario</option>
              <option value="Técnico">Formación Técnica</option>
            </select>
          </div>

          <div class="lg:col-span-2 space-y-4">
            <label class="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
              Nombre de la Asignatura
              <Sparkles class="w-4 h-4 text-secondary animate-pulse" />
            </label>
            <input 
              v-model="courseStore.newCourseDraft.name"
              type="text" 
              placeholder="Ej: Álgebra Lineal, Geopolítica Contemporánea..."
              class="input-field w-full text-2xl font-black placeholder:text-white/10"
            />
          </div>
        </div>
      </div>

      <!-- STEP 2: OBJETIVOS -->
      <div v-if="currentStep === 2" class="space-y-12 animate-slide-up">
        <header class="space-y-4">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest">
            <Trophy class="w-4 h-4" /> Ambición Pedagógica
          </div>
          <h2 class="text-4xl font-black text-white italic tracking-tighter">Define los objetivos maestros</h2>
          <p class="text-white/50 text-sm font-medium leading-relaxed max-w-2xl">Describe qué competencias técnicas o blandas deseas que tus estudiantes trasciendan al finalizar este ciclo.</p>
        </header>

        <div class="space-y-10">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <textarea 
              v-model="courseStore.newCourseDraft.objectives"
              rows="6"
              placeholder="Describe tus expectativas pedagógicas..."
              class="input-field w-full h-56 resize-none relative z-10 text-lg leading-relaxed shadow-inner"
            ></textarea>
          </div>
          
          <div class="flex flex-wrap gap-4">
            <span 
              v-for="tag in ['Pensamiento Crítico', 'Resolución de Problemas', 'Creatividad', 'Análisis']" 
              :key="tag" 
              class="px-6 py-3 bg-white/5 text-[10px] font-black uppercase tracking-widest text-primary rounded-full border border-white/5 hover:border-primary/40 transition-all cursor-default"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- STEP 3: RECURSOS -->
      <div v-if="currentStep === 3" class="space-y-12 animate-slide-up">
        <header class="space-y-4 text-center">
          <div class="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest mx-auto">
            <FileText class="w-4 h-4" /> Inteligencia Documental
          </div>
          <h2 class="text-4xl font-black text-white italic tracking-tighter">Carga tu Syllabus o Guía</h2>
          <p class="text-white/50 text-sm font-medium leading-relaxed max-w-lg mx-auto">Nuestro motor neuronal procesará tu material para estructurar la ruta de aprendizaje automáticamente.</p>
        </header>
        
        <div 
          @click="triggerFileInput"
          class="border-4 border-dashed rounded-[3.5rem] p-16 flex flex-col items-center justify-center group cursor-pointer transition-all duration-500 relative overflow-hidden"
          :class="[
            courseStore.newCourseDraft.file ? 'border-accent bg-accent/5' : 'border-white/5 hover:border-primary/40 hover:bg-primary/5',
            isUploading ? 'opacity-50 pointer-events-none' : ''
          ]"
        >
          <div v-if="!courseStore.newCourseDraft.file" class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
          
          <input 
            ref="fileInput"
            type="file" 
            class="hidden" 
            accept=".pdf"
            @change="handleFileUpload"
          />
          
          <div v-if="isUploading" class="flex flex-col items-center animate-pulse">
            <Loader2 class="w-20 h-20 text-primary animate-spin mb-6" />
            <p class="text-xl font-black text-primary uppercase tracking-widest">Escaneando Estructura...</p>
          </div>
          
          <template v-else-if="courseStore.newCourseDraft.file">
            <div class="w-24 h-24 rounded-[2rem] bg-accent text-white flex items-center justify-center mb-8 shadow-glow transform rotate-6 scale-110 transition-transform">
              <CheckCircle2 class="w-12 h-12" />
            </div>
            <p class="text-3xl font-black text-white mb-4 italic tracking-tighter">¡Material Trascendido!</p>
            <p class="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">Toca para actualizar el archivo</p>
          </template>

          <template v-else>
            <div class="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-premium relative z-10">
              <Upload class="w-12 h-12 text-white/30 group-hover:text-white" />
            </div>
            <p class="text-2xl font-black text-white/40 group-hover:text-white mb-3 transition-colors relative z-10 uppercase tracking-tighter italic">Cargar Plan de Estudio (PDF)</p>
            <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.5em] relative z-10">Análisis Neuronal bajo demanda</p>
          </template>
        </div>
      </div>

      <!-- STEP 4: GENERAR -->
      <div v-if="currentStep === 4" class="space-y-12 text-center py-10 animate-slide-up">
        <div class="inline-flex p-10 bg-primary/5 rounded-[3.5rem] border border-primary/20 relative shadow-glow">
          <Sparkles class="w-20 h-20 text-primary animate-pulse relative z-10" />
          <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/20 to-transparent blur-xl"></div>
        </div>
        
        <div class="space-y-4">
          <h2 class="text-5xl font-black text-white italic tracking-tighter uppercase">Todo Listo</h2>
          <p class="text-white/40 font-black uppercase tracking-[0.6em] text-[10px]">Sincronización de Datos Completa</p>
        </div>

        <p class="text-white/60 font-bold text-xl max-w-xl mx-auto leading-relaxed">
          Hemos fusionado tu visión pedagógica con nuestra inteligencia avanzada. Estamos listos para generar tu <span class="text-primary italic">Ecosistema de Clases Premium</span>.
        </p>
        
        <div class="bg-white/2 p-8 md:p-10 rounded-[3rem] inline-block border border-white/5 shadow-inner backdrop-blur-sm">
          <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div class="text-left md:border-r border-white/10 md:pr-16 w-full md:w-auto">
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-3">Asignatura</p>
              <p class="text-2xl font-black text-white italic tracking-tight">{{ courseStore.newCourseDraft.name || 'Sin nombre' }}</p>
            </div>
            <div class="text-left w-full md:w-auto">
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-3">Prosapia</p>
              <p class="text-2xl font-black text-white italic tracking-tight">Estructura Adaptativa</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Persistent Navigation Buttons -->
      <div class="mt-auto flex items-center justify-between pt-16 border-t border-white/5">
        <button 
          @click="prevStep" 
          :disabled="currentStep === 1"
          class="flex items-center gap-4 px-8 md:px-10 py-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/30 hover:bg-white/5 hover:text-white disabled:opacity-0 transition-all group"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Anterior
        </button>
        
        <button 
          @click="nextStep"
          class="flex items-center gap-4 px-10 md:px-14 py-6 bg-primary text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all active:scale-95 group overflow-hidden relative"
        >
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
          <span class="relative z-10">{{ currentStep === 4 ? 'Iniciar Trascendencia IA' : 'Continuar' }}</span>
          <ArrowRight v-if="currentStep < 4" class="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
          <Sparkles v-else class="w-6 h-6 animate-pulse relative z-10" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366F1' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1.25rem;
}
</style>
