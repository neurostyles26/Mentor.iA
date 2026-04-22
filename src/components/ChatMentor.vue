<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useCourseStore } from '../store'
import { useChatStore } from '../store/chat'
import { 
  X, 
  Send, 
  BrainCircuit, 
  Sparkles,
  MessageCircle,
  Minimize2,
  Trash2,
  User,
  Bot,
  Volume2,
  VolumeX,
  ChevronDown
} from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import VoiceAssistant from './VoiceAssistant.vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const courseStore = useCourseStore()
const chatStore = useChatStore()
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

watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

watch(() => props.isOpen, (val) => {
  if (val) {
    chatStore.loadChats()
    scrollToBottom()
  }
})

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || chatStore.isLoading) return
  
  const msg = newMessage.value
  newMessage.value = ''
  await chatStore.sendMessage(msg)
  
  // Auto-play voice if enabled
  if (courseStore.isVoiceOutputEnabled && chatStore.messages.length > 0) {
    const lastMsg = chatStore.messages[chatStore.messages.length - 1]
    if (lastMsg.role === 'assistant') {
      try {
        const { useTextToSpeech } = await import('../composables/useTextToSpeech')
        const { speak } = useTextToSpeech()
        speak(lastMsg.content)
      } catch (e) { console.error(e) }
    }
  }
}

const renderMarkdown = (text) => {
  return DOMPurify.sanitize(marked.parse(text))
}

const clearChat = async () => {
  if (chatStore.currentChatId && confirm('¿Deseas purgar esta línea de tiempo?')) {
    await chatStore.deleteChat(chatStore.currentChatId)
  }
}

onMounted(() => {
  chatStore.loadChats()
})
</script>

<template>
  <Transition name="premium-chat">
    <div v-if="isOpen" 
      class="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 w-full sm:w-[500px] h-[100dvh] sm:h-[750px] bg-bg-card z-[100] flex flex-col overflow-hidden sm:rounded-[3rem] border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]"
      role="dialog"
    >
      <!-- Premium Header -->
      <header class="p-8 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 border-b border-white/5 relative overflow-hidden shrink-0">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
        
        <div class="flex items-center justify-between relative z-10">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-glow relative group">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-bg-card shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div>
              <h3 class="text-2xl font-black tracking-tight text-white leading-none italic mb-2">Mentor IA</h3>
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Neuronal Core v4.0</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="courseStore.isVoiceOutputEnabled = !courseStore.isVoiceOutputEnabled"
              class="w-10 h-10 hover:bg-white/5 rounded-xl transition-all flex items-center justify-center border border-transparent"
              :class="courseStore.isVoiceOutputEnabled ? 'text-primary bg-primary/10 border-primary/20' : 'text-white/20'"
            >
              <Volume2 v-if="courseStore.isVoiceOutputEnabled" class="w-4 h-4 shadow-glow" />
              <VolumeX v-else class="w-4 h-4" />
            </button>

            <button @click="clearChat" class="w-10 h-10 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400">
              <Trash2 class="w-4 h-4" />
            </button>
            
            <button @click="$emit('close')" class="w-10 h-10 hover:bg-white/5 rounded-xl transition-all text-white/20 hover:text-white">
              <ChevronDown class="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <!-- Chat Body -->
      <div ref="scrollContainer" class="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar scroll-smooth bg-white/[0.01]">
        <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center justify-center h-full text-center space-y-6">
           <div class="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary border border-primary/20 animate-float">
             <BrainCircuit class="w-10 h-10" />
           </div>
           <div class="space-y-2">
             <p class="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Inicia la Secuencia</p>
             <p class="text-white/20 font-medium text-sm">Tu mentor está listo para asistirte.</p>
           </div>
        </div>

        <div 
          v-for="(msg, index) in chatStore.messages" 
          :key="index"
          class="flex flex-col"
          :class="msg.role === 'user' ? 'items-end' : 'items-start'"
        >
          <div 
            class="max-w-[90%] p-6 rounded-[2.5rem] text-sm leading-relaxed transition-all duration-700"
            :class="msg.role === 'user' 
              ? 'bg-primary text-white rounded-br-none shadow-glow-primary' 
              : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-none'"
          >
            <div 
              class="prose prose-invert prose-sm max-w-none"
              v-html="renderMarkdown(msg.content)"
            ></div>
          </div>
          <div class="flex items-center gap-3 mt-4 px-4">
             <div class="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <User v-if="msg.role === 'user'" class="w-3 h-3 text-white/40" />
                <Bot v-else class="w-3 h-3 text-primary" />
             </div>
             <span class="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                {{ msg.role === 'user' ? 'Tú' : 'Mentor IA' }} • {{ new Date(msg.created_at || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
             </span>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="chatStore.isLoading" class="flex flex-col items-start">
          <div class="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-bl-none flex items-center gap-4">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
            <span class="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Procesando Neuronas...</span>
          </div>
        </div>
      </div>

      <!-- Footer / Input -->
      <footer class="p-8 bg-bg-card border-t border-white/5">
        <div class="flex items-center gap-4 bg-white/5 p-2.5 pl-6 rounded-[2.5rem] border border-white/10 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-500 shadow-inner group">
          <input 
            v-model="newMessage"
            @keyup.enter="handleSendMessage"
            type="text" 
            placeholder="Introduce tu consulta..."
            class="flex-1 bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-white/20"
            :disabled="chatStore.isLoading"
          />
          <VoiceAssistant v-model="newMessage" :disabled="chatStore.isLoading" />
          <button 
            @click="handleSendMessage"
            class="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 shadow-glow group-hover:rotate-12"
            :disabled="!newMessage.trim() || chatStore.isLoading"
          >
            <Send class="w-6 h-6" />
          </button>
        </div>
        <div class="mt-6 flex items-center justify-center gap-3">
           <div class="w-1 h-1 bg-primary rounded-full"></div>
           <p class="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">Elite Pedagogical Engine</p>
           <div class="w-1 h-1 bg-primary rounded-full"></div>
        </div>
      </footer>
    </div>
  </Transition>
</template>

<style scoped>
@reference "../style.css";
.premium-chat-enter-active,
.premium-chat-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-chat-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(10px);
}

.premium-chat-leave-to {
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  filter: blur(10px);
}

:deep(.prose) {
  font-family: inherit;
  color: inherit;
}

:deep(.prose strong) {
  color: var(--color-primary);
  filter: brightness(1.2);
  font-weight: 900;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.shadow-glow {
  box-shadow: 0 0 20px -5px var(--color-primary-glow);
}

.shadow-glow-primary {
  box-shadow: 0 10px 30px -10px rgba(var(--color-primary-rgb), 0.5);
}
</style>
