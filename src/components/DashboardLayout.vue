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
  User
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const navItems = [
  { name: 'Cursos', icon: BookOpen, path: '/dashboard' },
  { name: 'Crear curso', icon: PlusCircle, path: '/dashboard/create' },
  { name: 'Analíticas', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'Configuración', icon: Settings, path: '/dashboard/settings' },
]

const handleLogout = () => {
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-[#F8FAFC]">
    <!-- Sidebar -->
    <aside class="w-72 bg-white flex flex-col border-r border-gray-100 shadow-sm z-10 transition-all duration-300">
      <div class="px-8 py-10">
        <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/dashboard')">
          <div class="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <BrainCircuit class="w-7 h-7 text-primary" />
          </div>
          <span class="text-2xl font-bold text-dark tracking-tight">MentorIA</span>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-200 group relative"
          :class="route.path === item.path ? 'bg-primary text-white shadow-premium' : 'text-gray-500 hover:bg-gray-100 hover:text-dark'"
        >
          <component :is="item.icon" class="w-6 h-6" />
          {{ item.name }}
          <div v-if="route.path === item.path" class="absolute left-0 w-1 h-6 bg-white rounded-r-full -ml-4"></div>
        </router-link>
      </nav>

      <div class="p-4 mt-auto">
        <div class="p-6 bg-gradient-to-br from-primary to-blue-500 rounded-[1.5rem] shadow-soft mb-4 text-white">
          <p class="text-xs font-bold uppercase opacity-80 mb-2">Plan Pro</p>
          <p class="text-sm font-semibold mb-4 text-white/90 leading-relaxed">Libera el poder de la IA con el plan educativo ilimitado.</p>
          <button class="w-full py-2 bg-white text-primary rounded-xl font-bold text-sm hover:scale-105 transition-transform active:scale-95">
            Upgrade
          </button>
        </div>
        
        <button 
          @click="handleLogout"
          class="flex items-center gap-4 px-4 py-4 w-full rounded-2xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut class="w-6 h-6" />
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
      <!-- Header -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-10 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-2xl w-96 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <Search class="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar cursos, lecciones..."
            class="bg-transparent border-0 outline-none text-sm font-semibold w-full placeholder:text-gray-400"
          />
        </div>

        <div class="flex items-center gap-6">
          <button class="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-dark relative transition-all active:scale-95 shadow-sm">
            <Bell class="w-6 h-6" />
            <span class="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div class="h-10 w-px bg-gray-200"></div>

          <div class="flex items-center gap-4 cursor-pointer group">
            <div class="text-right">
              <p class="text-sm font-bold text-dark group-hover:text-primary transition-colors">Prof. García</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Grado 6º - 11º</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-secondary/10 border-2 border-white shadow-soft overflow-hidden p-1 transition-transform group-hover:scale-105">
              <div class="w-full h-full rounded-xl bg-secondary flex items-center justify-center">
                <User class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: theme('colors.primary');
  color: white;
  box-shadow: theme('boxShadow.premium');
}
</style>
