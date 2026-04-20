<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useCourseStore } from '../store'
import { 
  X, 
  Send, 
  BrainCircuit, 
  Sparkles,
  MessageCircle,
  Minimize2,
  Trash2,
  User,
  Bot
} from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const courseStore = useCourseStore()
const newMessage = ref('')
const scrollContainer = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

watch(() => courseStore.teacherChatHistory.length, () => {
  scrollToBottom()
})

watch(() => props.isOpen, (val) => {
  if (val) scrollToBottom()
})

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || courseStore.isAskingTutor) return
  
  const msg = newMessage.value
  newMessage.value = ''
  await courseStore.askMentorTeacher(msg)
}

const renderMarkdown = (text) => {
  return DOMPurify.sanitize(marked.parse(text))
}

const clearChat = () => {
  if (confirm('¿Estás seguro de que quieres limpiar el historial de chat?')) {
    courseStore.clearTeacherChat()
  }
}

onMounted(() => {
  if (courseStore.teacherChatHistory.length === 0) {
    // Welcome message
    courseStore.teacherChatHistory.push({
      role: 'assistant',
      content: '¡Hola! Soy tu **Mentor IA**. Estoy aquí para ayudarte a diseñar clases innovadoras, resolver dudas pedagógicas o darte ideas creativas para tu aula. ¿En qué puedo apoyarte hoy?',
      timestamp: new Date()
    })
  }
})
</script>

<template>
  <Transition name="premium-slide">
    <div v-if="isOpen" 
      class="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[480px] h-[100dvh] sm:h-[720px] glass-panel z-[100] flex flex-col overflow-hidden animate-premium-entry sm:rounded-[2.5rem] rounded-none border-0 sm:border border-white/5"
      role="dialog"
      aria-labelledby="chat-title"
    >
      <!-- Header Premium -->
      <div class="p-6 sm:p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/5 relative overflow-hidden shrink-0">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-4 sm:gap-5">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-7 h-7 object-contain" />
            </div>
            <div>
              <h3 id="chat-title" class="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">Mentor IA</h3>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                <p class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Motor Neuronal • Online</p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 sm:gap-3">
            <button @click="clearChat" 
              class="p-2 sm:p-3 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
              title="Limpiar chat"
              aria-label="Limpiar historial de chat"
            >
              <Trash2 class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button @click="$emit('close')" 
              class="p-2 sm:p-3 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
              aria-label="Cerrar chat"
            >
              <X class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Body -->
      <div ref="scrollContainer" 
        class="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar scroll-smooth"
        aria-live="polite"
      >
        <div 
          v-for="(msg, index) in courseStore.teacherChatHistory" 
          :key="index"
          class="flex flex-col"
          :class="msg.role === 'user' ? 'items-end' : 'items-start'"
        >
          <div 
            class="max-w-[85%] p-6 rounded-[2.5rem] text-sm leading-relaxed shadow-lg transition-all duration-500 hover:scale-[1.01]"
            :class="msg.role === 'user' 
              ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-none' 
              : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'"
          >
            <div 
              class="prose prose-invert prose-sm max-w-none font-medium"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </div>
          <span class="text-[9px] font-black uppercase tracking-widest text-white/20 mt-3 px-4 flex items-center gap-2">
            <User v-if="msg.role === 'user'" class="w-3 h-3" />
            <Bot v-else class="w-3 h-3" />
            {{ msg.role === 'user' ? 'Tú' : 'Mentor IA' }} • {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </span>
        </div>

        <!-- Typing Indicator -->
        <div v-if="courseStore.isAskingTutor" class="flex flex-col items-start animate-fade-in">
          <div class="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] rounded-bl-none flex items-center gap-4">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
            <span class="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Procesando con IA Avanzada...</span>
          </div>
        </div>
      </div>

      <!-- Footer / Input Premium -->
      <div class="p-6 sm:p-8 bg-white/5 border-t border-white/5 shrink-0">
        <div class="flex items-center gap-3 sm:gap-4 bg-white/5 p-2 pl-4 sm:pl-6 rounded-[2rem] border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-300">
          <input 
            v-model="newMessage"
            @keyup.enter="handleSendMessage"
            type="text" 
            placeholder="Escribe tu duda..."
            class="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-white placeholder:text-white/20"
            :disabled="courseStore.isAskingTutor"
            aria-label="Mensaje para el mentor"
          />
          <button 
            @click="handleSendMessage"
            class="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 shadow-glow shrink-0"
            :disabled="!newMessage.trim() || courseStore.isAskingTutor"
            aria-label="Enviar mensaje"
          >
            <Send class="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <p class="text-[8px] sm:text-[9px] text-center mt-4 sm:mt-5 text-white/20 font-black uppercase tracking-[0.3em]">IA Avanzada para la Educación</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.premium-slide-enter-active,
.premium-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.premium-slide-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}

.animate-premium-entry {
  animation: premiumEntry 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes premiumEntry {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

:deep(.prose) {
  font-family: inherit;
  color: inherit;
}

:deep(.prose p) {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

:deep(.prose strong) {
  color: var(--color-primary);
  filter: brightness(1.5);
  font-weight: 800;
}

:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
}

:deep(.prose li) {
  margin-top: 0.25em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
