<script setup>
import { onMounted } from 'vue'
import { useChatStore } from '../store/chat'
import { 
  History, 
  Trash2, 
  MessageSquare, 
  ChevronRight,
  Clock,
  Calendar,
  Sparkles
} from 'lucide-vue-next'

const chatStore = useChatStore()

onMounted(() => {
  chatStore.loadChats()
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este chat para siempre?')) {
    await chatStore.deleteChat(id)
  }
}

const openChat = (id) => {
  chatStore.selectChat(id)
  // Logic to open the floating chat is usually handled by the parent layout
  // We can emit or just wait for the user to open it manually.
  // Actually, selecting it is enough if DashboardLayout reacts to it.
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-12 animate-fade-in relative z-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          <History class="w-4 h-4" /> Centro de Memoria
        </div>
        <h1 class="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">Historial de <span class="text-primary tracking-normal">Chats</span></h1>
        <p class="text-white/40 text-lg font-bold max-w-xl">Gestiona tus sesiones previas de Mentoría. Nada de lo que compartas se pierde.</p>
      </div>
    </header>

    <!-- Content Grid -->
    <div v-if="chatStore.chats.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      <div 
        v-for="chat in chatStore.chats" 
        :key="chat.id"
        class="glass-panel group relative flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-glow border-white/5 hover:border-primary/30"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="p-8 space-y-6 relative z-10">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
              <MessageSquare class="w-6 h-6 text-white/40 group-hover:text-primary" />
            </div>
            <button 
              @click.stop="handleDelete(chat.id)"
              class="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Eliminar historial"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3">
            <h3 class="text-xl font-black text-white tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {{ chat.title || 'Conversación sin título' }}
            </h3>
            <div class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
              <Calendar class="w-3.5 h-3.5" />
              {{ formatDate(chat.created_at) }}
            </div>
          </div>

          <button 
            @click="openChat(chat.id)" 
            class="w-full flex items-center justify-center gap-3 py-4 bg-white/2 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow transition-all active:scale-95"
          >
            Reabrir Sesión <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-[500px] flex flex-col items-center justify-center text-center glass-panel border-dashed p-12">
      <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
        <Sparkles class="w-10 h-10 text-white/10" />
      </div>
      <h3 class="text-2xl font-black text-white mb-4 uppercase italic">Tu memoria está virgen</h3>
      <p class="text-white/40 max-w-sm font-bold">Aún no has guardado conversaciones. Inicia un chat con el Mentor IA para empezar a registrar tu legado pedagógico.</p>
    </div>
  </div>
</template>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2.5rem;
}

.shadow-glow:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
