<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Mic, MicOff, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'result'])

const isRecording = ref(false)
const isSupported = ref(true)
let recognition = null

onMounted(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    isSupported.value = false
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'es-CO'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onstart = () => {
    isRecording.value = true
  }

  recognition.onend = () => {
    isRecording.value = false
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    if (transcript) {
      const newValue = props.modelValue ? `${props.modelValue} ${transcript}` : transcript
      emit('update:modelValue', newValue)
      emit('result', transcript)
    }
  }

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error)
    isRecording.value = false
    if (event.error === 'not-allowed') {
      alert('Permiso de micrófono denegado. Por favor, habilítalo en la configuración de tu navegador.')
    }
  }
})

onUnmounted(() => {
  if (recognition) recognition.stop()
})

const toggleRecording = () => {
  if (!recognition) return
  
  if (isRecording.value) {
    recognition.stop()
  } else {
    try {
      recognition.start()
    } catch (e) {
      console.error('Error starting recognition:', e)
    }
  }
}
</script>

<template>
  <div v-if="isSupported" class="relative flex items-center justify-center">
    <!-- Ripple Effect -->
    <div 
      v-if="isRecording"
      class="absolute inset-0 bg-primary/40 rounded-full animate-ping-slow pointer-events-none"
    ></div>
    
    <button
      type="button"
      @click="toggleRecording"
      :disabled="disabled"
      :class="[
        'relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border focus:outline-none',
        isRecording 
          ? 'bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
          : 'bg-white/5 border-white/5 text-white/40 hover:text-primary hover:border-primary/30 hover:bg-primary/5'
      ]"
      :title="isRecording ? 'Detener dictado' : 'Activar dictado por voz'"
    >
      <Mic v-if="!isRecording" :size="18" />
      <MicOff v-else :size="18" class="animate-pulse" />
    </button>
  </div>
</template>

<style scoped>
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
