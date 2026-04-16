<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  BarChart3, 
  BookOpen, 
  PlusCircle, 
  Settings, 
  LogOut,
  BrainCircuit,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  X
} from 'lucide-vue-next'
import ChatMentor from './ChatMentor.vue'

const router = useRouter()
const route = useRoute()

const isChatOpen = ref(false)

const navItems = [
  { name: 'Mis Cursos', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Nueva Clase IA', icon: Sparkles, path: '/dashboard/create' },
  { name: 'Analíticas', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Configuraciones', icon: Settings, path: '/dashboard/settings' },
]

const handleLogout = () => {
  router.push('/login')
}

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-bg-deep overflow-hidden font-sans">
    <!-- Premium Sidebar -->
    <aside class="w-80 bg-bg-card flex flex-col border-r border-white/5 z-50 shadow-premium relative">
      <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
      
      <div class="px-10 py-12 flex flex-col items-center relative z-10">
        <div class="flex items-center gap-4 group cursor-pointer mb-2" @click="router.push('/dashboard')">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-glow border border-primary/20">
            <BrainCircuit class="w-8 h-8 text-primary" />
          </div>
          <span class="text-3xl font-black text-white tracking-tighter uppercase">MentorIA</span>
        </div>
        <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Intelligence Suite v4</p>
      </div>

      <!-- Navigation Content -->
      <nav class="flex-1 px-6 space-y-4 mt-8 relative z-10">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-5 px-8 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 relative group overflow-hidden"
          :class="route.path === item.path ? 'bg-white/5 text-white shadow-glow border border-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'"
        >
          <component :is="item.icon" class="w-6 h-6 transition-transform group-hover:scale-110" :class="route.path === item.path ? 'text-primary' : 'text-white/20 group-hover:text-primary'" />
          {{ item.name }}
          <div v-if="route.path === item.path" class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-full blur-[1px]"></div>
        </router-link>
      </nav>

      <!-- Bottom Card & Logout -->
      <div class="p-8 space-y-6 relative z-10">
        <div class="p-8 bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] shadow-premium relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">AI Engine: Gemma 4</p>
          <p class="text-sm font-bold text-white leading-snug mb-6">Optimiza tus clases con IA de vanguardia</p>
          <button 
            @click="toggleChat"
            class="w-full py-4 bg-white text-dark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-bg-deep hover:text-white transition-all transform hover:-translate-y-1 shadow-lg active:scale-95"
          >
            Consultar al Mentor
          </button>
        </div>
        
        <button 
          @click="handleLogout"
          class="flex items-center gap-5 px-10 py-5 w-full rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95 group border border-transparent hover:border-red-500/20"
        >
          <LogOut class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <!-- Refined Header -->
      <header class="h-28 bg-bg-deep/50 backdrop-blur-2xl border-b border-white/5 px-14 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-5 bg-white/5 px-10 py-5 rounded-[2.5rem] w-[550px] border border-white/5 focus-within:border-primary/30 focus-within:bg-white/10 transition-all duration-700">
          <Search class="w-6 h-6 text-white/20" />
          <input 
            type="text" 
            placeholder="Buscar lecciones, talleres o exámenes..."
            class="bg-transparent border-0 outline-none text-sm font-bold w-full text-white placeholder:text-white/20"
          />
        </div>

        <div class="flex items-center gap-10">
          <button class="p-5 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-primary relative transition-all active:scale-90 hover:bg-white/10">
            <Bell class="w-6 h-6" />
            <span class="absolute top-5 right-5 w-3 h-3 bg-primary border-4 border-bg-deep rounded-full shadow-glow"></span>
          </button>
          
          <div class="h-12 w-px bg-white/5"></div>

          <div class="flex items-center gap-5 cursor-pointer group p-3 rounded-[2rem] hover:bg-white/5 transition-all duration-500">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-black text-white tracking-tight">Profesor García</p>
              <p class="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Master Nivel IV</p>
            </div>
            <div class="w-16 h-16 rounded-[1.5rem] bg-white/5 p-1 transform group-hover:rotate-6 transition-all duration-700 shadow-glow border border-white/5">
               <div class="w-full h-full rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User class="w-9 h-9 text-white" />
               </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic Page Content -->
      <div class="flex-1 overflow-y-auto p-14 custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition 
            name="page-premium" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Floating Chat Button Premium -->
      <button 
        v-if="!isChatOpen"
        @click="toggleChat"
        class="fixed bottom-10 right-10 w-24 h-24 bg-primary text-white rounded-[2.5rem] flex items-center justify-center shadow-premium hover:bg-secondary transition-all duration-700 z-50 active:scale-90 group overflow-hidden"
      >
        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
        <MessageCircle class="w-9 h-9 relative z-10 group-hover:rotate-12 transition-transform" />
        <Sparkles class="absolute top-5 right-5 w-5 h-5 text-white/50 animate-pulse" />
      </button>

      <!-- Chat Component -->
      <ChatMentor :is-open="isChatOpen" @close="isChatOpen = false" />
    </main>
  </div>
</template>

<style scoped>
.page-premium-enter-active,
.page-premium-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-premium-enter-from {
  opacity: 0;
  transform: translateY(30px);
  filter: blur(10px);
}

.page-premium-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  filter: blur(10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
</style>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.4s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
</style>
