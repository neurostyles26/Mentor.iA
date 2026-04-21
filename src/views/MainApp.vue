<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../store/auth'
import { useChatStore } from '../store/chat'
import { useClipboardStore } from '../store/clipboard'
import { 
  BrainCircuit, Send, LogOut, MessageSquare, 
  ClipboardList, History, Loader2, Sparkles, Plus,
  FileDown, ChevronDown
} from 'lucide-vue-next'

import { exportService } from '../lib/exportService'
import ChatMessage from '../components/ChatMessage.vue'
import ClipboardItem from '../components/ClipboardItem.vue'
import PromptButtons from '../components/PromptButtons.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const clipboardStore = useClipboardStore()

const inputText = ref('')
const scrollArea = ref(null)
const activeTab = ref('chat') // 'chat' | 'clipboard' | 'history' (for mobile)
const selectedItemIds = ref([])
const showExportMenu = ref(false)
const windowWidth = ref(window.innerWidth)

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth
})

onMounted(async () => {
  await Promise.all([
    chatStore.loadChats(),
    clipboardStore.loadItems()
  ])
})

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value) {
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight
    }
  })
}

const handleSend = async () => {
  if (!inputText.value.trim() || chatStore.isLoading) return
  const text = inputText.value
  inputText.value = ''
  await chatStore.sendMessage(text)
  scrollToBottom()
}

const selectPrompt = (text) => {
  inputText.value = text
}

const saveMessageToClipboard = async (content) => {
  await clipboardStore.addItem(content)
}

const startNewChat = () => {
  chatStore.currentChatId = null
  chatStore.messages = []
}

const toggleSelectItem = (id) => {
  const index = selectedItemIds.value.indexOf(id)
  if (index === -1) selectedItemIds.value.push(id)
  else selectedItemIds.value.splice(index, 1)
}

const toggleSelectAll = () => {
  if (selectedItemIds.value.length === clipboardStore.items.length) {
    selectedItemIds.value = []
  } else {
    selectedItemIds.value = clipboardStore.items.map(i => i.id)
  }
}

const handleExport = (format) => {
  const selectedItems = clipboardStore.items.filter(i => selectedItemIds.value.includes(i.id))
  if (selectedItems.length === 0) {
    alert('Por favor, selecciona al menos un elemento para exportar.')
    return
  }

  const filename = `MentorIA_Export_${new Date().toISOString().slice(0,10)}`
  
  try {
    if (format === 'pdf') {
      exportService.exportToPDF(selectedItems, `${filename}.pdf`)
    } else if (format === 'excel') {
      exportService.exportToExcel(selectedItems, `${filename}.xlsx`)
    } else if (format === 'slides') {
      exportService.exportToSlides(selectedItems, `${filename}.pptx`)
    }
    showExportMenu.value = false
  } catch (error) {
    console.error('Error exporting:', error)
    alert('Hubo un error al generar el archivo. Por favor intenta de nuevo.')
  }
}
</script>

<template>
  <div class="h-screen flex flex-col bg-bg-deep overflow-hidden">
    <!-- Header -->
    <header class="h-16 border-b border-white/5 bg-bg-card/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <BrainCircuit class="text-white" :size="20" />
        </div>
        <span class="font-bold text-lg hidden sm:block">MentorIA App</span>
      </div>

      <div class="flex items-center gap-4">
        <button 
          @click="authStore.logout(); $router.push('/')" 
          class="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut :size="18" />
          <span class="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar (Desktop History) -->
      <aside class="w-64 border-r border-white/5 bg-bg-card/30 hidden lg:flex flex-col">
        <div class="p-4">
          <button @click="startNewChat" class="btn-primary w-full gap-2">
            <Plus :size="18" /> Nueva clase
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <p class="text-[10px] uppercase font-bold text-text-muted mt-4 mb-2 tracking-widest pl-2">Recientes</p>
          <button 
            v-for="chat in chatStore.chats" 
            :key="chat.id"
            @click="chatStore.selectChat(chat.id)"
            class="w-full text-left p-2.5 rounded-xl text-sm transition-all truncate group"
            :class="chatStore.currentChatId === chat.id ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/5'"
          >
            {{ chat.title }}
          </button>
        </div>
      </aside>

      <!-- Chat Panel -->
      <main 
        class="flex-1 flex flex-col min-w-0"
        v-show="activeTab === 'chat' || windowWidth >= 1024"
      >
        <!-- Messages Area -->
        <div 
          ref="scrollArea"
          class="flex-1 overflow-y-auto p-4 md:p-8 space-y-4"
        >
          <div v-if="chatStore.messages.length === 0" class="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <Sparkles :size="32" />
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">¿Qué prepararemos hoy?</h2>
            <p class="text-text-muted">Selecciona una plantilla o escribe tu consulta para empezar a trabajar con MentorIA.</p>
          </div>

          <ChatMessage 
            v-for="(msg, idx) in chatStore.messages" 
            :key="idx" 
            v-bind="msg" 
            @save-to-clipboard="saveMessageToClipboard"
          />
          
          <div v-if="chatStore.isLoading" class="flex gap-4 animate-pulse">
             <div class="w-10 h-10 rounded-xl bg-primary/20 shrink-0"></div>
             <div class="p-4 rounded-2xl bg-bg-card/50 w-2/3 h-12"></div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 md:p-8 shrink-0 bg-gradient-to-t from-bg-deep to-transparent">
          <div class="max-w-4xl mx-auto space-y-4">
            <PromptButtons @select-prompt="selectPrompt" />
            
            <div class="relative glass-panel p-2 flex items-end gap-2 focus-within:border-primary/30 transition-all shadow-2xl">
              <textarea 
                v-model="inputText"
                @keydown.enter.prevent="handleSend"
                rows="1"
                placeholder="Pregunta algo o usa una plantilla..."
                class="flex-1 bg-transparent border-none focus:ring-0 p-3 text-text-main placeholder:text-text-muted resize-none max-h-48"
              ></textarea>
              <button 
                @click="handleSend"
                :disabled="chatStore.isLoading || !inputText.trim()"
                class="btn-primary p-3 rounded-xl shrink-0"
              >
                <Loader2 v-if="chatStore.isLoading" class="animate-spin" :size="20" />
                <Send v-else :size="20" />
              </button>
            </div>
            <p class="text-[10px] text-center text-text-muted uppercase tracking-tighter">Potenciado por Gemma 4 para Docentes</p>
          </div>
        </div>
      </main>

      <!-- Clipboard Panel (Portapapeles) -->
      <aside 
        class="w-full lg:w-96 border-l border-white/5 bg-bg-card/20 flex flex-col"
        v-show="activeTab === 'clipboard' || windowWidth >= 1024"
      >
        <div class="p-6 border-b border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button 
              @click="toggleSelectAll"
              class="w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer"
              :class="selectedItemIds.length > 0 && selectedItemIds.length === clipboardStore.items.length ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/20 text-transparent hover:border-white/40'"
              title="Seleccionar todo"
            >
              <Check :size="12" stroke-width="4" />
            </button>
            <div class="flex items-center gap-2">
              <ClipboardList class="text-secondary" :size="20" />
              <h2 class="font-bold">Portapapeles</h2>
            </div>
          </div>
          
          <div class="relative">
            <button 
              @click="showExportMenu = !showExportMenu" 
              class="btn-outline text-[10px] px-3 py-1.5 gap-1.5 uppercase font-bold"
              :disabled="selectedItemIds.length === 0"
              :class="selectedItemIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-primary/5'"
            >
              <FileDown :size="14" /> Exportar ({{ selectedItemIds.length }})
              <ChevronDown :size="14" class="transition-transform duration-300" :class="showExportMenu ? 'rotate-180' : ''" />
            </button>

            <!-- Export Dropdown -->
            <div v-if="showExportMenu" class="absolute right-0 mt-3 w-56 glass-panel border border-white/10 shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
              <button @click="handleExport('pdf')" class="w-full text-left px-4 py-3 text-xs hover:bg-white/5 transition-colors flex items-center gap-3 group">
                <div class="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <div class="flex flex-col">
                  <span class="font-bold text-white">Documento PDF</span>
                  <span class="text-[10px] text-text-muted">Formato profesional</span>
                </div>
              </button>
              <button @click="handleExport('excel')" class="w-full text-left px-4 py-3 text-xs hover:bg-white/5 transition-colors flex items-center gap-3 group">
                <div class="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <div class="flex flex-col">
                  <span class="font-bold text-white">Hoja de Cálculo</span>
                  <span class="text-[10px] text-text-muted">Excel (XLSX)</span>
                </div>
              </button>
              <button @click="handleExport('slides')" class="w-full text-left px-4 py-3 text-xs hover:bg-white/5 transition-colors flex items-center gap-3 group">
                <div class="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <div class="flex flex-col">
                  <span class="font-bold text-white">Diapositivas</span>
                  <span class="text-[10px] text-text-muted">PowerPoint (PPTX)</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div v-if="clipboardStore.items.length === 0" class="text-center py-20 opacity-30 select-none">
            <ClipboardList :size="48" class="mx-auto mb-4" />
            <p class="text-sm">No hay fragmentos guardados.</p>
          </div>
          <ClipboardItem 
            v-for="item in clipboardStore.items" 
            :key="item.id" 
            :item="item" 
            :isSelected="selectedItemIds.includes(item.id)"
            @delete="clipboardStore.deleteItem"
            @update="clipboardStore.updateItem"
            @toggle-select="toggleSelectItem"
          />
        </div>
      </aside>
    </div>

    <!-- Mobile Navigation -->
    <nav class="lg:hidden h-16 bg-bg-card border-t border-white/5 flex items-center justify-around shrink-0 px-2">
      <button 
        @click="activeTab = 'history'" 
        class="flex flex-col items-center gap-1 transition-colors"
        :class="activeTab === 'history' ? 'text-primary' : 'text-text-muted'"
      >
        <History :size="20" />
        <span class="text-[10px] font-bold uppercase">Historial</span>
      </button>
      <button 
        @click="activeTab = 'chat'" 
        class="flex flex-col items-center gap-1 transition-colors"
        :class="activeTab === 'chat' ? 'text-primary' : 'text-text-muted'"
      >
        <MessageSquare :size="20" />
        <span class="text-[10px] font-bold uppercase">Chat</span>
      </button>
      <button 
        @click="activeTab = 'clipboard'" 
        class="flex flex-col items-center gap-1 transition-colors"
        :class="activeTab === 'clipboard' ? 'text-primary' : 'text-text-muted'"
      >
        <ClipboardList :size="20" />
        <span class="text-[10px] font-bold uppercase">Portapapeles</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
</style>
