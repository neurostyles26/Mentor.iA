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
  Sparkles
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navItems = [
  { name: 'Mis Cursos', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Nueva Clase IA', icon: Sparkles, path: '/dashboard/create' },
  { name: 'Analíticas', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Configuraciones', icon: Settings, path: '/dashboard/settings' },
]

const handleLogout = () => {
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-background overflow-hidden font-sans">
    <!-- Premium Sidebar -->
    <aside class="w-80 bg-white flex flex-col border-r border-gray-100 z-50 shadow-soft">
      <div class="px-10 py-12 flex flex-col items-center">
        <div class="flex items-center gap-4 group cursor-pointer mb-2" @click="router.push('/dashboard')">
          <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-sm">
            <BrainCircuit class="w-7 h-7 text-primary" />
          </div>
          <span class="text-3xl font-black text-dark tracking-tighter uppercase">MentorIA</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">IA Pedagogical Suite</p>
      </div>

      <!-- Navigation Content -->
      <nav class="flex-1 px-6 space-y-3 mt-4">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all duration-300 relative group overflow-hidden"
          :class="route.path === item.path ? 'bg-dark text-white shadow-premium' : 'text-gray-400 hover:bg-gray-50 hover:text-dark'"
        >
          <component :is="item.icon" class="w-6 h-6" :class="route.path === item.path ? 'text-primary' : 'text-gray-400 group-hover:text-dark'" />
          {{ item.name }}
          <div v-if="route.path === item.path" class="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-full blur-[2px]"></div>
        </router-link>
      </nav>

      <!-- Bottom Card & Logout -->
      <div class="p-8 space-y-6">
        <div class="p-6 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-[2.5rem] shadow-premium relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Soporte IA Activo</p>
          <p class="text-sm font-bold text-white/90 leading-snug mb-5">¿Necesitas ayuda con el diseño curricular?</p>
          <button class="w-full py-3 bg-white text-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-soft">
            Consultar
          </button>
        </div>
        
        <button 
          @click="handleLogout"
          class="flex items-center gap-4 px-8 py-5 w-full rounded-[2rem] font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 group"
        >
          <LogOut class="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FBFDFF]">
      <!-- Refined Header -->
      <header class="h-24 bg-white/60 backdrop-blur-xl border-b border-gray-100 px-12 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-4 bg-gray-100 px-8 py-4 rounded-[2rem] w-[500px] border border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all duration-500">
          <Search class="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Encuentra asignaturas o lecciones..."
            class="bg-transparent border-0 outline-none text-sm font-bold w-full placeholder:text-gray-400"
          />
        </div>

        <div class="flex items-center gap-8">
          <button class="p-4 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-primary relative transition-all active:scale-95 shadow-soft hover:shadow-md">
            <Bell class="w-6 h-6" />
            <span class="absolute top-4 right-4 w-3 h-3 bg-primary border-4 border-white rounded-full animate-pulse"></span>
          </button>
          
          <div class="h-10 w-px bg-gray-100 mx-2"></div>

          <div class="flex items-center gap-4 cursor-pointer group p-2 rounded-3xl hover:bg-white hover:shadow-soft transition-all duration-500">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-black text-dark tracking-tight">Profesor García</p>
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Educador Nivel II</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-dark p-1 shadow-premium transform group-hover:rotate-3 transition-all duration-500">
               <div class="w-full h-full rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
                  <User class="w-8 h-8 text-white" />
               </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Dynamic Page Content -->
      <div class="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition 
            name="page-fade" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

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
