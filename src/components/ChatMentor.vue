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
  User
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
      content: '¡Hola! Soy tu **Mentor IA (Gemma 4)** local. Estoy aquí para ayudarte a diseñar clases innovadoras, resolver dudas pedagógicas o simplemente darte algunas ideas creativas para tu aula. ¿En qué puedo apoyarte hoy?',
      timestamp: new Date()
    })
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="fixed bottom-10 right-10 w-[450px] h-[650px] bg-white rounded-[3rem] shadow-premium z-[100] border border-gray-100 flex flex-col overflow-hidden animate-premium-entry">
      <!-- Header -->
      <div class="p-8 bg-dark text-white flex items-center justify-between relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div class="flex items-center gap-4 relative z-10">
          <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <BrainCircuit class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 class="text-xl font-black tracking-tight leading-none mb-1 text-white">Mentor IA</h3>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p class="text-[10px] font-black uppercase tracking-widest text-primary">Gemma 4 Activo</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2 relative z-10">
          <button @click="clearChat" class="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white" title="Limpiar chat">
            <Trash2 class="w-5 h-5" />
          </button>
          <button @click="$emit('close')" class="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
            <X class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Chat Body -->
      <div ref="scrollContainer" class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/50">
        <div 
          v-for="(msg, index) in courseStore.teacherChatHistory" 
          :key="index"
          class="flex flex-col"
          :class="msg.role === 'user' ? 'items-end' : 'items-start'"
        >
          <div 
            class="max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm transition-all duration-300 hover:shadow-md"
            :class="msg.role === 'user' 
              ? 'bg-primary text-white rounded-br-none' 
              : 'bg-white text-dark rounded-bl-none border border-gray-100'"
          >
            <div 
              class="prose prose-sm max-w-none"
              :class="msg.role === 'user' ? 'text-white' : 'text-dark'"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </div>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2 mx-4">
            {{ msg.role === 'user' ? 'Tú' : 'Mentor IA' }} • {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </span>
        </div>

        <div v-if="courseStore.isAskingTutor" class="flex flex-col items-start animate-fade-in">
          <div class="bg-white p-5 rounded-[2rem] rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-3">
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
            <span class="text-xs font-black text-primary uppercase tracking-widest">Gemma 4 pensando...</span>
          </div>
        </div>
      </div>

      <!-- Footer / Input -->
      <div class="p-8 bg-white border-t border-gray-100">
        <div class="flex items-center gap-3 bg-gray-50 p-2 pl-6 rounded-[2rem] border border-gray-100 focus-within:border-primary/30 focus-within:bg-white transition-all duration-300">
          <input 
            v-model="newMessage"
            @keyup.enter="handleSendMessage"
            type="text" 
            placeholder="Escribe tu duda pedagógica..."
            class="flex-1 bg-transparent border-none outline-none text-sm font-bold text-dark placeholder:text-gray-400"
            :disabled="courseStore.isAskingTutor"
          />
          <button 
            @click="handleSendMessage"
            class="w-12 h-12 bg-dark rounded-full flex items-center justify-center text-white hover:bg-primary transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
            :disabled="!newMessage.trim() || courseStore.isAskingTutor"
          >
            <Send class="w-5 h-5" />
          </button>
        </div>
        <p class="text-[9px] text-center mt-4 text-gray-400 font-bold uppercase tracking-widest">Impulsado por Tecnología Gemma 4 de Google AI</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100px) scale(0.9);
}

.animate-premium-entry {
  animation: premiumEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes premiumEntry {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

:deep(.prose) {
  font-family: inherit;
}

:deep(.prose p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose strong) {
  color: inherit;
  font-weight: 800;
}
</style>
