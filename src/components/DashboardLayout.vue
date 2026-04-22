<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useNotificationStore } from '../store/notifications'
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
  X,
  Calendar,
  Heart,
  History,
  ClipboardList,
  LifeBuoy,
  ShieldCheck,
  Check,
  Trash2,
  AlertCircle,
  Info
} from 'lucide-vue-next'
import ChatMentor from './ChatMentor.vue'
import SupportDeveloper from './SupportDeveloper.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isChatOpen = ref(false)
const isSupportOpen = ref(false)
const isNotificationOpen = ref(false)

const navItems = [
  { name: 'Mis Cursos', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Nueva Clase IA', icon: Sparkles, path: '/dashboard/create' },
  { name: 'Laboratorio Docente', icon: BrainCircuit, path: '/dashboard/analyzer' },
  { name: 'Historial de Chats', icon: History, path: '/dashboard/history' },
  { name: 'Mis Recortes', icon: ClipboardList, path: '/dashboard/clipboard' },
  { name: 'Agenda', icon: Calendar, path: '/dashboard/agenda' },
  { name: 'Centro de Ayuda', icon: LifeBuoy, path: '/dashboard/help' },
  { name: 'Configuraciones', icon: Settings, path: '/dashboard/settings' },
]

onMounted(async () => {
  await notificationStore.fetchNotifications()
  notificationStore.initializeRealtime()
})

onUnmounted(() => {
  notificationStore.stopRealtime()
})

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

const toggleNotifications = () => {
  isNotificationOpen.value = !isNotificationOpen.value
}

const markRead = (id) => {
  notificationStore.markAsRead(id)
}
</script>

<template>
  <div class="flex h-screen bg-bg-deep overflow-hidden font-sans relative w-full max-w-full selection:bg-primary/30">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden animate-fade-in"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Premium Sidebar -->
    <aside 
      class="sidebar-transition bg-bg-card flex flex-col border-r border-white/5 z-[70] shadow-[10px_0_50px_-20px_rgba(0,0,0,0.5)] h-full"
      :class="[
        isSidebarCollapsed ? 'w-24' : 'w-80',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative'
      ]"
    >
      <!-- Sidebar Toggle (Desktop) -->
      <button 
        @click="toggleSidebar"
        class="absolute -right-4 top-12 w-8 h-8 bg-primary rounded-full hidden lg:flex items-center justify-center text-white shadow-glow hover:scale-110 transition-transform z-[80] border border-white/10"
      >
        <ChevronLeft v-if="!isSidebarCollapsed" class="w-5 h-5" />
        <ChevronRight v-else class="w-5 h-5" />
      </button>

      <!-- Logo Section -->
      <div class="p-10 flex flex-col items-center relative z-10 transition-all duration-500 overflow-hidden">
        <div 
          class="flex items-center gap-4 group cursor-pointer" 
          @click="router.push('/dashboard')"
          :class="isSidebarCollapsed ? 'flex-col' : ''"
        >
          <div class="w-14 h-14 bg-gradient-to-br from-primary to-secondary p-0.5 rounded-2xl transform group-hover:rotate-12 transition-all duration-700 shadow-glow shrink-0">
            <div class="w-full h-full rounded-[14px] bg-bg-card flex items-center justify-center">
              <img src="/App_Icon_MentoriA.png" alt="Logo" class="w-9 h-9 object-contain" />
            </div>
          </div>
          <div v-if="!isSidebarCollapsed" class="flex flex-col animate-fade-in">
            <span class="text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap">MentorIA</span>
            <span class="text-[8px] font-black text-primary uppercase tracking-[0.4em] leading-none">Intelligence Suite</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar relative z-10">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative group overflow-hidden border border-transparent"
          :class="[
            route.path === item.path ? 'bg-primary/10 text-primary border-primary/20 shadow-inner' : 'text-white/40 hover:bg-white/5 hover:text-white/80',
            isSidebarCollapsed ? 'justify-center px-0' : ''
          ]"
          @click="isMobileMenuOpen = false"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
          <span v-if="!isSidebarCollapsed" class="whitespace-nowrap animate-fade-in">{{ item.name }}</span>
          
          <!-- Indicator for active -->
          <div v-if="route.path === item.path && !isSidebarCollapsed" class="absolute left-0 w-1 h-6 bg-primary rounded-r-full"></div>
          
          <!-- Tooltip for collapsed mode -->
          <div v-if="isSidebarCollapsed" class="absolute left-full ml-4 px-4 py-2 bg-primary text-white text-[9px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-glow">
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <!-- Bottom Profile / Support -->
      <div class="p-6 space-y-4 relative z-10 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div class="flex flex-col gap-3">
           <button 
             @click="isSupportOpen = true"
             class="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] text-primary bg-primary/5 hover:bg-primary/20 hover:shadow-glow transition-all group border border-primary/10"
             :class="isSidebarCollapsed ? 'justify-center px-0' : ''"
           >
             <Heart class="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform animate-pulse" />
             <span v-if="!isSidebarCollapsed" class="whitespace-nowrap animate-fade-in">Apoyar Proyecto</span>
           </button>

           <button 
             @click="handleLogout"
             class="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent"
             :class="isSidebarCollapsed ? 'justify-center px-0' : ''"
           >
             <LogOut class="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
             <span v-if="!isSidebarCollapsed" class="whitespace-nowrap animate-fade-in">Desconectar</span>
           </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 h-full relative">
      <!-- Elite Header -->
      <header class="h-20 bg-bg-deep/80 backdrop-blur-2xl border-b border-white/5 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-6">
          <!-- Mobile Toggle -->
          <button @click="isMobileMenuOpen = true" class="p-3 bg-white/5 rounded-2xl lg:hidden text-white/40 hover:text-primary transition-colors">
            <Menu class="w-6 h-6" />
          </button>

          <!-- Elite Search -->
          <div class="hidden md:flex items-center gap-4 bg-white/[0.03] px-6 py-3.5 rounded-2xl w-[350px] lg:w-[500px] border border-white/5 focus-within:border-primary/50 focus-within:bg-white/[0.05] transition-all duration-500 group shadow-inner">
            <Search class="w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en el ecosistema..."
              class="bg-transparent border-0 outline-none text-xs font-bold w-full text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div class="flex items-center gap-6 lg:gap-10">
          <div class="flex items-center gap-4 relative">
             <button 
               @click="toggleNotifications"
               class="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/30 hover:text-primary relative transition-all active:scale-90 group"
             >
              <Bell class="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span v-if="notificationStore.unreadCount > 0" class="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full shadow-glow"></span>
            </button>

            <!-- Elite Notification Dropdown -->
            <Transition name="premium-pop">
              <div v-if="isNotificationOpen" class="absolute right-0 mt-2 top-full w-80 lg:w-96 bg-bg-card border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col">
                <header class="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                   <h3 class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Notificaciones</h3>
                   <button 
                     v-if="notificationStore.unreadCount > 0" 
                     @click="notificationStore.markAllAsRead"
                     class="text-[8px] font-black text-primary uppercase tracking-widest hover:text-secondary transition-colors"
                   >
                     Marcar todo
                   </button>
                </header>

                <div class="max-h-[400px] overflow-y-auto custom-scrollbar py-2">
                   <div v-if="notificationStore.notifications.length === 0" class="p-12 text-center flex flex-col items-center gap-4 opacity-20">
                      <Bell class="w-10 h-10" />
                      <p class="text-[10px] font-black uppercase tracking-widest">Silencio Neuronal</p>
                   </div>

                   <div 
                     v-for="notif in notificationStore.sortedNotifications" 
                     :key="notif.id"
                     class="px-6 py-5 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-all group flex items-start gap-4 relative"
                     :class="!notif.is_read ? 'bg-primary/[0.02]' : ''"
                   >
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
                           :class="notif.is_read ? 'bg-white/5 text-white/20' : 'bg-primary/10 text-primary shadow-glow'">
                         <Sparkles v-if="notif.type === 'ai'" class="w-5 h-5" />
                         <AlertCircle v-else-if="notif.type === 'warning'" class="w-5 h-5" />
                         <Info v-else class="w-5 h-5" />
                      </div>

                      <div class="flex-1 min-w-0 pr-6">
                         <h4 class="text-[11px] font-black text-white/80 leading-tight uppercase tracking-tight mb-1" :class="!notif.is_read ? 'text-white' : ''">
                           {{ notif.title }}
                         </h4>
                         <p class="text-[10px] text-white/40 leading-relaxed font-bold italic truncate">
                           {{ notif.content }}
                         </p>
                         <span class="text-[8px] text-white/10 font-black uppercase tracking-widest mt-2 block">
                           {{ new Date(notif.created_at).toLocaleTimeString() }}
                         </span>
                      </div>

                      <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button v-if="!notif.is_read" @click="markRead(notif.id)" class="p-1.5 hover:text-primary transition-colors">
                           <Check class="w-3.5 h-3.5" />
                         </button>
                         <button @click="notificationStore.deleteNotification(notif.id)" class="p-1.5 hover:text-red-400 transition-colors">
                           <Trash2 class="w-3.5 h-3.5" />
                         </button>
                      </div>

                      <!-- Unread Indicator -->
                      <div v-if="!notif.is_read" class="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                   </div>
                </div>

                <footer class="p-4 bg-white/[0.01] border-t border-white/5 text-center">
                   <p class="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Fin del Historial</p>
                </footer>
              </div>
            </Transition>

            <div class="h-8 w-px bg-white/5 hidden sm:block"></div>
          </div>
          
          <!-- Premium Profile Widget -->
          <div class="flex items-center gap-4 group p-1 pr-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all duration-700 cursor-pointer">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 transform group-hover:scale-105 transition-all duration-500 shadow-glow shrink-0">
               <div class="w-full h-full rounded-[10px] bg-bg-card flex items-center justify-center">
                  <User class="w-6 h-6 text-primary" />
               </div>
            </div>
            <div class="text-right hidden sm:block overflow-hidden max-w-[120px]">
              <p class="text-xs font-black text-white tracking-tight leading-none mb-1 truncate">{{ authStore.displayName }}</p>
              <div class="flex items-center justify-end gap-1.5">
                <ShieldCheck class="w-2.5 h-2.5 text-primary" />
                <p class="text-[8px] font-black text-primary uppercase tracking-[0.2em] leading-none">Elite Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic Page Content -->
      <div class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-12 custom-scrollbar scroll-smooth">
        <router-view v-slot="{ Component }">
          <transition 
            name="page-premium" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- AI Assistant Float -->
      <ChatMentor :is-open="isChatOpen" @close="isChatOpen = false" />
      
      <!-- Support Modal -->
      <SupportDeveloper :is-open="isSupportOpen" @close="isSupportOpen = false" />
    </main>
  </div>
</template>

<style scoped>
@reference "../style.css";
.sidebar-transition {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.page-premium-enter-active,
.page-premium-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-premium-enter-from {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(10px);
}

.page-premium-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  filter: blur(10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  transition: background-color 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-primary-glow);
}

.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}
</style>

