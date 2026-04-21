<script setup>
import { computed } from 'vue'
import { BrainCircuit, User, Copy, ClipboardPlus, Check, Volume2, Square } from 'lucide-vue-next'
import { ref } from 'vue'
import { useTextToSpeech } from '../composables/useTextToSpeech'

const { speak, stop, isSpeaking } = useTextToSpeech()

const props = defineProps({
  role: String,
  content: String,
  timestamp: String
})

const emit = defineEmits(['saveToClipboard'])

const isAssistant = computed(() => props.role === 'assistant')
const copied = ref(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.content)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="flex gap-4 mb-6 group" :class="isAssistant ? 'flex-row' : 'flex-row-reverse'">
    <!-- Avatar -->
    <div 
      class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
      :class="isAssistant ? 'bg-primary shadow-primary/20' : 'bg-accent shadow-accent/20'"
    >
      <BrainCircuit v-if="isAssistant" class="text-white" :size="20" />
      <User v-else class="text-white" :size="20" />
    </div>

    <!-- Message Bubble -->
    <div class="flex flex-col max-w-[85%]" :class="isAssistant ? 'items-start' : 'items-end'">
      <div 
        class="p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
        :class="isAssistant ? 'bg-bg-card border border-white/5 text-text-main' : 'bg-primary text-white'"
      >
        {{ content }}
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click="copyToClipboard"
          class="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
          title="Copiar texto"
        >
          <Check v-if="copied" :size="14" class="text-secondary" />
          <Copy v-else :size="14" />
          {{ copied ? 'Copiado' : 'Copiar' }}
        </button>
        
          Guardar en Portapapeles
        </button>

        <!-- Speaker Button -->
        <button 
          v-if="isAssistant"
          @click="isSpeaking ? stop() : speak(content)"
          class="flex items-center gap-1.5 text-xs transition-colors"
          :class="isSpeaking ? 'text-primary' : 'text-text-muted hover:text-white'"
          title="Escuchar mensaje"
        >
          <Volume2 v-if="!isSpeaking" :size="14" />
          <Square v-else :size="12" class="fill-current" />
          {{ isSpeaking ? 'Detener' : 'Escuchar' }}
        </button>
      </div>
    </div>
  </div>
</template>
