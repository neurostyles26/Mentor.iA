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
  FileText,
  Zap,
  Cpu
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
    alert('Error en la sincronización de archivos. Verifica tu enlace de datos.')
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
      router.push('/generator') // Redirect to the generator view
    } catch (error) {
      console.error('Error finalising course:', error)
      alert('Anomalía detectada al persistir el curso. Reintenta la operación.')
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-16 px-6 lg:px-0 relative mb-20 overflow-hidden">
    <!-- Hyper-Premium Ambient Backgrounds -->
    <div class="fixed inset-0 pointer-events-none z-0">
       <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
       <div class="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 3s"></div>
    </div>

    <!-- Layout Container -->
    <div class="relative z-10 animate-fade-in">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <button 
          @click="router.back()" 
          class="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 transition-all group"
        >
          <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retornar al Nucleo
        </button>

        <div class="text-center md:text-right">
          <div class="flex items-center justify-center md:justify-end gap-3 mb-2">
             <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
             <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Nueva Cátedra</h1>
          </div>
          <p class="text-[9px] font-black text-primary uppercase tracking-[0.5em]">Arquitectura de Formación v2.5</p>
        </div>
      </div>

      <!-- Stepper Navigation (Refined) -->
      <div class="glass-panel p-8 md:p-12 mb-16 border-primary/10 relative overflow-hidden bg-gradient-to-br from-bg-card to-primary/5">
        <div class="flex items-center justify-between relative z-10">
          <!-- Connecting Line -->
          <div class="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-[24px] md:-translate-y-[28px] -z-10"></div>
          <div 
            class="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent -translate-y-[24px] md:-translate-y-[28px] -z-10 transition-all duration-1000 shadow-glow"
            :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
          ></div>

          <div 
            v-for="(step, index) in steps" 
            :key="step"
            class="flex flex-col items-center gap-5 group"
          >
            <div 
              class="w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] flex items-center justify-center font-black text-lg transition-all duration-700 relative overflow-hidden"
              :class="index + 1 <= currentStep ? 'bg-primary text-white scale-110 shadow-glow' : 'bg-white/5 text-white/20 border border-white/5'"
            >
              <div v-if="index + 1 <= currentStep" class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <CheckCircle2 v-if="index + 1 < currentStep" class="w-8 h-8 md:w-10 md:h-10 animate-scale-up" />
              <span v-else class="relative z-10 text-[13px] md:text-base">{{ index + 1 }}</span>
            </div>
            <span 
              class="text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-700"
              :class="index + 1 <= currentStep ? 'text-white' : 'text-white/10'"
            >
              {{ step }}
            </span>
          </div>
        </div>
      </div>

      <!-- Form Container Content -->
      <div class="glass-panel p-8 md:p-20 min-h-[650px] flex flex-col border-white/5 relative overflow-hidden group">
        <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>

        <!-- Transitions Wrapper -->
        <Transition name="step-fade" mode="out-in">
          <div :key="currentStep" class="flex-1 flex flex-col">
            
            <!-- STEP 1: ENTORNO -->
            <div v-if="currentStep === 1" class="space-y-12">
              <header class="space-y-5">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/5 rounded-full border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                  <Building2 class="w-4 h-4" /> Configuración de Ecosistema
                </div>
                <h2 class="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none">Matriz de Operación</h2>
                <p class="text-white/40 text-lg font-bold leading-relaxed max-w-2xl">Define los parámetros de entorno. La IA ajustará la profundidad pedagógica basándose en el nivel del destinatario.</p>
              </header>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                <div class="space-y-4 group/input">
                  <label class="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 group-focus-within/input:text-primary transition-colors">
                    Institución Activa
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej: Facultad de Ingeniería Cuántica"
                    class="input-field w-full text-xl font-bold py-6 italic"
                  />
                </div>

                <div class="space-y-4 group/input">
                  <label class="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 group-focus-within/input:text-primary transition-colors">
                    Nivel de Complejidad
                  </label>
                  <select 
                    v-model="courseStore.newCourseDraft.grade"
                    class="input-field w-full text-xl font-bold py-6 appearance-none cursor-pointer italic"
                  >
                    <option value="">Seleccionar Estrato...</option>
                    <option v-for="n in 11" :key="n" :value="`${n}º Grado`">{{ n }}º Grado</option>
                    <option value="Universitario">Grado Universitario</option>
                    <option value="Postgrado">Nivel Postgrado / Master</option>
                    <option value="Técnico">Capacitación Técnica</option>
                  </select>
                </div>

                <div class="lg:col-span-2 space-y-4 group/input">
                  <label class="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1 group-focus-within/input:text-primary transition-colors">
                    Denominación de la Asignatura
                  </label>
                  <div class="relative">
                    <input 
                      v-model="courseStore.newCourseDraft.name"
                      type="text" 
                      placeholder="Ej: Macroeconomía y Dinámicas AI..."
                      class="input-field w-full text-3xl font-black py-8 placeholder:text-white/5 border-primary/10 italic"
                    />
                    <Sparkles class="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-primary opacity-20 animate-pulse pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: OBJETIVOS -->
            <div v-else-if="currentStep === 2" class="space-y-12">
              <header class="space-y-5">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-secondary/5 rounded-full border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.3em]">
                  <Trophy class="w-4 h-4" /> Objetivos de Trascendencia
                </div>
                <h2 class="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none">Visión de Metas</h2>
                <p class="text-white/40 text-lg font-bold leading-relaxed max-w-2xl">Describe las competencias críticas que los aprendices deben dominar al finalizar la experiencia.</p>
              </header>

              <div class="space-y-12 pt-8">
                <div class="relative group">
                  <div class="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[3rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
                  <textarea 
                    v-model="courseStore.newCourseDraft.objectives"
                    rows="8"
                    placeholder="Describe los hitos pedagógicos..."
                    class="input-field w-full h-80 resize-none relative z-10 text-xl leading-relaxed italic p-10 bg-white/[0.02] border-white/5"
                  ></textarea>
                </div>
                
                <div class="flex flex-wrap gap-4 items-center">
                  <span class="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] mr-4">Sugerencias:</span>
                  <button 
                    v-for="tag in ['Pensamiento Crítico', 'Resolución IA', 'Creatividad Sistémica', 'Análisis de Datos']" 
                    :key="tag" 
                    @click="courseStore.newCourseDraft.objectives += ' - ' + tag"
                    class="px-8 py-3.5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-primary/60 rounded-full border border-white/5 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all active:scale-95"
                  >
                    + {{ tag }}
                  </button>
                </div>
              </div>
            </div>

            <!-- STEP 3: RECURSOS -->
            <div v-else-if="currentStep === 3" class="space-y-12">
              <header class="space-y-5 text-center">
                <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-accent/5 rounded-full border border-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                  <FileText class="w-4 h-4" /> Ingesta de Datos
                </div>
                <h2 class="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none">Syllabus Inteligente</h2>
                <p class="text-white/40 text-lg font-bold leading-relaxed max-w-xl mx-auto">Carga el plan de estudio en PDF para que la red neuronal genere la ruta de aprendizaje optimizada.</p>
              </header>
              
              <div 
                @click="triggerFileInput"
                class="border-2 border-dashed rounded-[4rem] p-20 lg:p-28 flex flex-col items-center justify-center group cursor-pointer transition-all duration-700 relative overflow-hidden"
                :class="[
                  courseStore.newCourseDraft.file ? 'border-accent/40 bg-accent/5 shadow-glow' : 'border-white/5 bg-white/2 hover:border-primary/40 hover:bg-primary/5',
                  isUploading ? 'opacity-30 pointer-events-none scale-95' : 'hover:scale-[1.02]'
                ]"
              >
                <!-- Animated Background Rays -->
                <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl scale-125"></div>
                
                <input 
                  ref="fileInput"
                  type="file" 
                  class="hidden" 
                  accept=".pdf"
                  @change="handleFileUpload"
                />
                
                <!-- Loading State (Hyper UI) -->
                <div v-if="isUploading" class="flex flex-col items-center">
                  <div class="w-24 h-24 mb-10 relative">
                     <div class="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                     <div class="absolute inset-4 bg-primary/20 rounded-full flex items-center justify-center">
                        <Cpu class="w-8 h-8 text-primary animate-pulse" />
                     </div>
                  </div>
                  <p class="text-2xl font-black text-primary uppercase tracking-[0.4em] italic animate-pulse">Analizando Archivo...</p>
                </div>
                
                <!-- Success State -->
                <template v-else-if="courseStore.newCourseDraft.file">
                  <div class="w-24 h-24 rounded-[2rem] bg-accent text-white flex items-center justify-center mb-10 shadow-glow transform rotate-6 scale-110 transition-all duration-700">
                    <CheckCircle2 class="w-12 h-12" />
                  </div>
                  <p class="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Sincronización Exitosa</p>
                  <p class="text-[9px] text-white/30 font-black uppercase tracking-[0.5em]">Click para re-escanear documento</p>
                </template>

                <!-- Initial Idle State -->
                <template v-else>
                  <div class="w-24 h-24 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-1000 shadow-premium relative z-10 shrink-0">
                    <Upload class="w-12 h-12 text-white/20 group-hover:text-white" />
                  </div>
                  <p class="text-3xl font-black text-white/30 group-hover:text-white mb-4 transition-colors relative z-10 uppercase tracking-tighter italic">Cargar Documento Matriz (PDF)</p>
                  <p class="text-[9px] text-white/10 font-black uppercase tracking-[0.6em] relative z-10">Análisis Pedagógico Instantáneo</p>
                </template>
              </div>
            </div>

            <!-- STEP 4: FINALIZAR -->
            <div v-else-if="currentStep === 4" class="space-y-12 text-center py-10">
              <div class="relative inline-block mt-8">
                 <!-- Orbital Ring Animation -->
                 <div class="absolute inset-0 border-[3px] border-primary/20 rounded-[4rem] animate-ping opacity-20"></div>
                 <div class="glass-panel p-16 border-primary/30 relative z-10 shadow-glow-primary scale-125">
                    <Sparkles class="w-24 h-24 text-primary animate-pulse" />
                 </div>
              </div>
              
              <div class="space-y-5 pt-12">
                <h2 class="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">Matriz Lista</h2>
                <div class="flex items-center justify-center gap-4">
                   <div class="h-px bg-white/5 w-12"></div>
                   <p class="text-primary font-black uppercase tracking-[0.8em] text-[11px]">Consolidación Completa</p>
                   <div class="h-px bg-white/5 w-12"></div>
                </div>
              </div>

              <p class="text-white/50 font-bold text-xl max-w-2xl mx-auto leading-relaxed italic">
                Visionario, tu estructura académica está configurada óptimamente. El motor neuronal MentorIA tomará el control para generar el siguiente nivel de educación.
              </p>
              
              <!-- Review Card -->
              <div class="glass-panel p-10 md:p-14 inline-block border-white/10 shadow-2xl bg-black/40 backdrop-blur-3xl animate-scale-up">
                <div class="flex flex-col md:flex-row items-center gap-16 md:gap-24">
                  <div class="text-left md:border-r border-white/10 md:pr-24 w-full md:w-auto">
                    <p class="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Núcleo Temático</p>
                    <p class="text-3xl font-black text-white italic tracking-tight leading-none truncate max-w-xs">{{ courseStore.newCourseDraft.name || 'Sin nombre definido' }}</p>
                  </div>
                  <div class="text-left w-full md:w-auto">
                    <p class="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-4">Estado de Red</p>
                    <div class="flex items-center gap-3">
                       <Zap class="w-6 h-6 text-emerald-400" />
                       <p class="text-3xl font-black text-white italic tracking-tight leading-none">Fase de Síntesis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Transition>

        <!-- Persistent Navigation Controls (Premium) -->
        <div class="mt-auto flex flex-col sm:flex-row items-center justify-between gap-10 pt-20 border-t border-white/5 relative z-20">
          <button 
            @click="prevStep" 
            :disabled="currentStep === 1"
            class="flex items-center gap-4 px-10 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] text-white/20 hover:bg-white/5 hover:text-white disabled:opacity-0 transition-all group"
          >
            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Vínculo Anterior
          </button>
          
          <button 
            @click="nextStep"
            class="flex items-center justify-center gap-6 px-12 md:px-20 py-7 bg-primary text-white rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-[0.4em] shadow-glow hover:bg-secondary hover:-translate-y-2 transition-all active:scale-95 group relative overflow-hidden w-full sm:w-auto"
          >
            <!-- Particle Overlay on Hover (Simulated) -->
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            
            <span class="relative z-10 tracking-[0.5em]">{{ currentStep === 4 ? 'Iniciar Trascendencia' : 'Siguiente Fase' }}</span>
            <ArrowRight v-if="currentStep < 4" class="w-6 h-6 group-hover:translate-x-3 transition-transform relative z-10" />
            <Sparkles v-else class="w-6 h-6 animate-pulse relative z-10" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";

.step-fade-enter-active, .step-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
  filter: blur(10px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
  filter: blur(10px);
}

.animate-fade-in {
  animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-up {
  animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.shadow-glow-primary {
  box-shadow: 0 0 80px -10px rgba(99, 102, 241, 0.4);
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366F1' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 2rem center;
  background-size: 1.5rem;
}

input::placeholder {
  @apply opacity-20 italic;
}
</style>
