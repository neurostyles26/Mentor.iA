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
  CheckCircle2
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
    alert('Error al subir el archivo')
  } finally {
    isUploading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const currentStep = ref(1)
const steps = ['Básicos', 'Detalles', 'Materiales', 'Generar']

const nextStep = async () => {
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    await courseStore.createCourseFromDraft()
    router.push('/dashboard/ai-generator')
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 animate-fade-in">
    <!-- Breadcrumb / Back -->
    <button @click="router.back()" class="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-primary transition-colors">
      <ArrowLeft class="w-5 h-5" />
      Volver al panel
    </button>

    <!-- Stepper -->
    <div class="glass p-10 rounded-[3rem] shadow-premium mb-12">
      <div class="flex items-center justify-between mb-12 relative">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>
        <div 
          v-for="(step, index) in steps" 
          :key="step"
          class="flex flex-col items-center gap-4 relative"
        >
          <div 
            class="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500 shadow-soft"
            :class="index + 1 <= currentStep ? 'bg-primary text-white scale-110' : 'bg-white text-gray-300 border border-gray-100'"
          >
            <CheckCircle2 v-if="index + 1 < currentStep" class="w-8 h-8" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span 
            class="text-sm font-bold uppercase tracking-widest"
            :class="index + 1 <= currentStep ? 'text-dark' : 'text-gray-300'"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Step Content -->
      <div class="min-h-[400px] flex flex-col">
        <div v-if="currentStep === 1" class="space-y-8 animate-slide-up">
          <h2 class="text-3xl font-black text-dark">¿Cómo se llamará el curso?</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Nombre de la asignatura</label>
              <input 
                v-model="courseStore.newCourseDraft.name"
                type="text" 
                placeholder="Ej: Álgebra Avanzada, Historia de México..."
                class="w-full px-8 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:border-primary focus:bg-white transition-all duration-300 outline-none text-xl font-bold placeholder:text-gray-300"
              />
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Grado</label>
                <select 
                  v-model="courseStore.newCourseDraft.grade"
                  class="w-full px-8 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:border-primary focus:bg-white transition-all duration-300 outline-none font-bold appearance-none"
                >
                  <option value="">Seleccionar grado</option>
                  <option v-for="n in 11" :key="n" :value="`${n}º Grado`">{{ n }}º Grado</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Institución</label>
                <input 
                  type="text" 
                  placeholder="Ej: Colegio San José"
                  class="w-full px-8 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:border-primary focus:bg-white transition-all duration-300 outline-none font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-8 animate-slide-up">
          <h2 class="text-3xl font-black text-dark">Define los objetivos</h2>
          <div class="space-y-6">
            <textarea 
              rows="6"
              placeholder="¿Qué deberían aprender tus alumnos al finalizar este curso?"
              class="w-full px-8 py-6 bg-gray-50/50 border-2 border-transparent rounded-[2.5rem] focus:border-primary focus:bg-white transition-all duration-300 outline-none font-medium text-lg leading-relaxed shadow-inner"
            ></textarea>
            <div class="flex flex-wrap gap-4">
              <span v-for="tag in ['Analítico', 'Práctico', 'Creativo']" :key="tag" class="px-6 py-3 bg-primary/10 text-primary rounded-full font-bold text-sm border border-primary/20">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-8 animate-slide-up">
          <h2 class="text-3xl font-black text-dark">Sube tu plan de estudio</h2>
          <p class="text-gray-500 font-medium">Gemma 4 analizará tu PDF para estructurar las clases automáticamente.</p>
          
          <div 
            @click="triggerFileInput"
            class="border-4 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center group cursor-pointer transition-all duration-300 relative"
            :class="[
              courseStore.newCourseDraft.file ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5',
              isUploading ? 'opacity-50 pointer-events-none' : ''
            ]"
          >
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              accept=".pdf"
              @change="handleFileUpload"
            />
            
            <div v-if="isUploading" class="flex flex-col items-center">
              <Loader2 class="w-16 h-16 text-primary animate-spin mb-4" />
              <p class="text-xl font-bold text-primary">Subiendo plan...</p>
            </div>
            
            <template v-else-if="courseStore.newCourseDraft.file">
              <div class="w-24 h-24 rounded-3xl bg-green-500 text-white flex items-center justify-center mb-6 shadow-soft">
                <CheckCircle2 class="w-12 h-12" />
              </div>
              <p class="text-2xl font-black text-green-600 mb-2">¡Material Cargado!</p>
              <p class="text-gray-400 font-bold uppercase tracking-widest text-sm">Toca para cambiar archivo</p>
            </template>

            <template v-else>
              <div class="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Upload class="w-12 h-12 text-gray-400 group-hover:text-white" />
              </div>
              <p class="text-2xl font-black text-gray-400 group-hover:text-primary mb-2">Sube tu PDF del Sílabo</p>
              <p class="text-gray-400 font-bold uppercase tracking-widest text-sm">Nuestra IA lo analizará automáticamente</p>
            </template>
          </div>
        </div>

        <div v-if="currentStep === 4" class="space-y-10 text-center py-10 animate-slide-up">
          <div class="inline-flex p-8 bg-primary/10 rounded-[3rem] mb-6">
            <Sparkles class="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h2 class="text-4xl font-black text-dark">¡Todo listo para la magia!</h2>
          <p class="text-gray-500 font-semibold text-lg max-w-lg mx-auto leading-relaxed">
            Hemos procesado tus datos. Gemma 4 generará una estructura de 12 clases personalizadas con actividades interactivas.
          </p>
          
          <div class="bg-gray-50 p-8 rounded-[2rem] inline-block border border-gray-100 shadow-inner">
            <div class="flex items-center gap-6">
              <div class="text-left border-r border-gray-200 pr-10">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estructura</p>
                <p class="text-xl font-bold text-dark">Vía Rápida (Syllabus)</p>
              </div>
              <div class="text-left">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Formato</p>
                <p class="text-xl font-bold text-dark">Híbrido (Notion + Quiz)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-auto flex items-center justify-between pt-10 border-t border-gray-50">
          <button 
            @click="prevStep" 
            :disabled="currentStep === 1"
            class="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 disabled:opacity-0 transition-all flex items-center gap-2"
          >
            <ArrowLeft class="w-5 h-5" />
            Anterior
          </button>
          
          <button 
            @click="nextStep"
            class="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-premium hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
          >
            {{ currentStep === 4 ? 'Generar contenido con IA' : 'Siguiente' }}
            <ArrowRight v-if="currentStep < 4" class="w-6 h-6" />
            <Sparkles v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
