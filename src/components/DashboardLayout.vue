<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { 
  BarChart3, 
  Settings, 
  LogOut,
  BrainCircuit,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-vue-next'
import ChatMentor from './ChatMentor.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isChatOpen = ref(false)

const navItems = [
  { name: 'Mis Cursos', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Nueva Clase IA', icon: Sparkles, path: '/dashboard/create' },
  { name: 'Analíticas', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Configuraciones', icon: Settings, path: '/dashboard/settings' },
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-bg-deep overflow-hidden font-sans">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="sidebar-transition bg-bg-card flex flex-col border-r border-white/5 z-[70] shadow-premium relative h-full"
      :class="[
        isSidebarCollapsed ? 'w-24' : 'w-80',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative'
      ]"
    >
      <!-- Toggle Button (Desktop) -->
      <button 
        @click="toggleSidebar"
        class="absolute -right-4 top-12 w-8 h-8 bg-primary rounded-full hidden lg:flex items-center justify-center text-white shadow-glow hover:scale-110 transition-transform z-50 border border-white/10"
      >
        <ChevronLeft v-if="!isSidebarCollapsed" class="w-5 h-5" />
        <ChevronRight v-else class="w-5 h-5" />
      </button>

      <!-- Logo Section -->
      <div class="px-6 py-10 flex flex-col items-center relative z-10 transition-all duration-500 overflow-hidden">
        <div 
          class="flex items-center gap-4 group cursor-pointer" 
          @click="router.push('/dashboard')"
          :class="isSidebarCollapsed ? 'flex-col' : ''"
        >
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-glow border border-primary/20 shrink-0">
            <BrainCircuit class="w-7 h-7 text-primary" />
          </div>
          <span 
            v-if="!isSidebarCollapsed" 
            class="text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap animate-fade-in"
          >
            MentorIA
          </span>
        </div>
        <p v-if="!isSidebarCollapsed" class="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mt-3 animate-fade-in">Intelligence Suite v2.5</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar relative z-10">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative group overflow-hidden"
          :class="[
            route.path === item.path ? 'bg-primary/10 text-primary shadow-sm border border-primary/10' : 'text-white/40 hover:bg-white/5 hover:text-white',
            isSidebarCollapsed ? 'justify-center px-0' : ''
          ]"
          @click="isMobileMenuOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap animate-fade-in">{{ item.name }}</span>
          
          <!-- Tooltip for collapsed mode -->
          <div v-if="isSidebarCollapsed" class="absolute left-full ml-4 px-4 py-2 bg-primary text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-glow">
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <!-- Bottom Profile / Logout -->
      <div class="p-4 space-y-4 relative z-10 border-t border-white/5 bg-white/2">
        <!-- AI Assistant Mini Banner -->
        <div 
          v-if="!isSidebarCollapsed"
          class="p-5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-white/5 mb-2 relative overflow-hidden group cursor-pointer"
          @click="toggleChat"
        >
           <div class="flex items-center gap-3">
             <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-glow">
               <Sparkles class="w-4 h-4" />
             </div>
             <p class="text-[9px] font-black text-white uppercase tracking-widest">Mentor Online</p>
           </div>
        </div>

        <div class="flex items-center flex-col gap-2">
           <button 
             @click="handleLogout"
             class="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-black text-[9px] uppercase tracking-widest text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent"
             :class="isSidebarCollapsed ? 'justify-center' : ''"
           >
             <LogOut class="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
             <span v-if="!isSidebarCollapsed" class="whitespace-nowrap">Cerrar Sesión</span>
           </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <!-- Refined Header -->
      <header class="h-20 bg-bg-deep/80 backdrop-blur-xl border-b border-white/5 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40">
        <!-- Mobile Menu Toggle -->
        <button @click="isMobileMenuOpen = true" class="p-3 bg-white/5 rounded-xl lg:hidden text-white/60">
          <Menu class="w-6 h-6" />
        </button>

        <!-- Search Bar (Responsive) -->
        <div class="hidden sm:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl w-[300px] lg:w-[450px] border border-white/5 focus-within:border-primary/50 transition-all duration-500">
          <Search class="w-5 h-5 text-white/20" />
          <input 
            type="text" 
            placeholder="Buscar en mi ecosistema..."
            class="bg-transparent border-0 outline-none text-xs font-bold w-full text-white placeholder:text-white/20"
          />
        </div>

        <div class="flex items-center gap-4 lg:gap-8">
          <button class="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-primary relative transition-all active:scale-90">
            <Bell class="w-5 h-5" />
            <span class="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-glow"></span>
          </button>
          
          <div class="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div class="flex items-center gap-4 group p-1 pr-3 rounded-2xl hover:bg-white/5 transition-all duration-500">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 transform group-hover:rotate-6 transition-all duration-700">
               <div class="w-full h-full rounded-[10px] bg-bg-card flex items-center justify-center">
                  <User class="w-6 h-6 text-primary" />
               </div>
            </div>
            <div class="text-right hidden md:block">
              <p class="text-xs font-black text-white tracking-tight leading-none mb-1">{{ authStore.displayName }}</p>
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none">Miembro Premium</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic Page Content -->
      <div class="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar scroll-smooth">
        <router-view v-slot="{ Component }">
          <transition 
            name="page-premium" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Floating Chat Component -->
      <ChatMentor :is-open="isChatOpen" @close="isChatOpen = false" />
    </main>
  </div>
</template>

<style scoped>
@reference "../style.css";

.sidebar-transition {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.page-premium-enter-active,
.page-premium-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-premium-enter-from {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(5px);
}

.page-premium-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  filter: blur(5px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-white/5 rounded-full;
}
</style>
