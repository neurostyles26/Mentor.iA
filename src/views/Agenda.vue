<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '../store'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  X, 
  Trash2,
  CalendarDays,
  Sparkles,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-vue-next'

const courseStore = useCourseStore()
const currentDate = ref(new Date())
const showAddModal = ref(false)

// Form State
const newEvent = ref({
  title: '',
  description: '',
  event_date: '',
  start_time: '',
  end_time: '',
  color: 'primary'
})

onMounted(async () => {
  await courseStore.fetchCourses()
  await courseStore.fetchSchedules()
})

// Calendar Logic
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const currentMonthName = computed(() => months[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = []
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: month - 1,
      year: year,
      currentMonth: false
    })
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      currentMonth: true,
      isToday: new Date().toDateString() === new Date(year, month, i).toDateString()
    })
  }
  
  // Next month padding
  const totalCells = 42 // 6 weeks
  const paddingNext = totalCells - days.length
  for (let i = 1; i <= paddingNext; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: year,
      currentMonth: false
    })
  }
  
  return days
})

const getEventsForDay = (dayObj) => {
  const dateStr = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`
  return courseStore.schedules.filter(s => s.event_date === dateStr)
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}

const handleAddEvent = async () => {
  try {
    await courseStore.addSchedule(newEvent.value)
    showAddModal.value = false
    // Reset form
    newEvent.value = {
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      color: 'primary'
    }
  } catch (err) {
    alert('Error al agendar evento. ¿Creaste la tabla en Supabase?')
  }
}

const deleteEvent = async (id) => {
  if (confirm('¿Eliminar este compromiso de la agenda?')) {
    await courseStore.deleteSchedule(id)
  }
}

const selectedDayEvents = ref([])
const selectedDateLabel = ref('')

const selectDay = (dayObj) => {
  const events = getEventsForDay(dayObj)
  selectedDayEvents.value = events
  selectedDateLabel.value = `${dayObj.day} de ${months[dayObj.month]}, ${dayObj.year}`
}

// Initial selection today
onMounted(() => {
  const today = new Date()
  selectDay({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  })
})

</script>

<template>
  <div class="max-w-7xl mx-auto pb-24 space-y-16 animate-page-in">
    <!-- Sophisticated Header -->
    <header class="flex flex-col md:flex-row items-center justify-between gap-12 py-10 relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      
      <div class="flex items-center gap-8 relative z-10">
        <div class="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-glow transform rotate-6 hover:rotate-0 transition-transform duration-700">
          <CalendarDays class="w-9 h-9 text-primary" />
        </div>
        <div>
          <h1 class="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">Agenda Digital</h1>
          <div class="flex items-center gap-3">
             <ShieldCheck class="w-4 h-4 text-primary" />
             <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.5em]">Arquitectura de Tiempos v4.0</p>
          </div>
        </div>
      </div>

      <button 
        @click="showAddModal = true"
        class="group relative flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 overflow-hidden w-full md:w-auto justify-center"
      >
        <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
        <Plus class="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 relative z-10" />
        <span class="relative z-10">Agendar Sesión</span>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
      <!-- Calendar Grid Area -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-bg-card border border-white/10 rounded-[4rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
          
          <!-- Calendar Header -->
          <div class="flex flex-wrap items-center justify-between mb-12 relative z-10 gap-6">
             <h2 class="text-3xl font-black text-white uppercase italic tracking-tighter">
               {{ currentMonthName }} <span class="text-primary not-italic tracking-tighter ml-3 font-bold">{{ currentYear }}</span>
             </h2>
             <div class="flex items-center gap-4 bg-white/5 p-2 rounded-[1.5rem] border border-white/5 shadow-inner">
               <button @click="prevMonth" class="w-12 h-12 flex items-center justify-center bg-transparent rounded-xl text-white/30 hover:bg-primary hover:text-white transition-all shadow-inner">
                 <ChevronLeft class="w-6 h-6" />
               </button>
               <button @click="nextMonth" class="w-12 h-12 flex items-center justify-center bg-transparent rounded-xl text-white/30 hover:bg-primary hover:text-white transition-all shadow-inner">
                 <ChevronRight class="w-6 h-6" />
               </button>
             </div>
          </div>

          <!-- Calendar Days Layout -->
          <div class="grid grid-cols-7 gap-3 relative z-10">
            <div 
              v-for="day in daysOfWeek" 
              :key="day" 
              class="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6"
            >
              {{ day }}
            </div>

            <div 
              v-for="(dayObj, idx) in calendarDays" 
              :key="idx"
              @click="selectDay(dayObj)"
              class="aspect-square rounded-[1.5rem] p-4 border border-transparent transition-all duration-500 cursor-pointer relative group overflow-hidden flex flex-col justify-between"
              :class="[
                dayObj.currentMonth ? 'bg-white/[0.03] hover:bg-white/[0.08] hover:scale-105' : 'bg-transparent opacity-10 cursor-default',
                dayObj.isToday ? 'border-primary bg-primary/10 shadow-glow-primary scale-110' : 'border-white/5'
              ]"
            >
              <span 
                class="text-base font-black transition-colors"
                :class="dayObj.currentMonth ? (dayObj.isToday ? 'text-primary' : 'text-white/60 group-hover:text-white') : 'text-white/10'"
              >
                {{ dayObj.day }}
              </span>
              
              <!-- Indicator Dots -->
              <div class="flex flex-wrap gap-1 mt-auto">
                <div 
                  v-for="ev in getEventsForDay(dayObj).slice(0, 3)" 
                  :key="ev.id"
                  class="w-1.5 h-1.5 rounded-full bg-primary shadow-glow animate-neural-pulse"
                ></div>
              </div>

              <!-- Selection Shine -->
              <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Area -->
      <div class="lg:col-span-4 space-y-10">
        <div class="bg-bg-card border border-primary/20 rounded-[4rem] p-10 lg:p-12 relative overflow-hidden shadow-2xl min-h-[500px]">
          <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <CalendarIcon :size="160" class="text-primary" />
          </div>

          <header class="mb-12 relative z-10">
             <h4 class="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 italic">Itinerario de Sesión</h4>
             <p class="text-white text-3xl font-black tracking-tighter leading-none italic">{{ selectedDateLabel }}</p>
          </header>

          <div v-if="selectedDayEvents.length === 0" class="flex flex-col items-center justify-center py-20 text-center space-y-8 opacity-20 relative z-10">
            <div class="w-20 h-20 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5 animate-float shadow-inner">
               <Sparkles class="w-10 h-10 text-primary" />
            </div>
            <p class="text-[11px] font-black uppercase tracking-[0.5em] leading-relaxed">Sin Compromisos<br/>Neuronal</p>
          </div>

          <div v-else class="space-y-6 relative z-10">
            <div 
              v-for="event in selectedDayEvents" 
              :key="event.id"
              class="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 group relative hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-700 animate-slide-right shadow-inner"
            >
               <div class="flex justify-between items-start mb-6">
                 <h4 class="font-black text-white text-base uppercase tracking-tight italic group-hover:text-primary transition-colors">{{ event.title }}</h4>
                 <button @click.stop="deleteEvent(event.id)" class="w-10 h-10 bg-white/5 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center border border-white/5 hover:border-red-500/20 shadow-inner">
                   <Trash2 class="w-4 h-4" />
                 </button>
               </div>
               
               <div class="flex flex-wrap items-center gap-8 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                 <div class="flex items-center gap-3">
                   <Clock class="w-4 h-4 text-primary animate-pulse" />
                   {{ event.start_time || '--:--' }}
                 </div>
                 <div class="flex items-center gap-3">
                   <MapPin class="w-4 h-4 text-secondary" />
                   Aula MentorIA
                 </div>
               </div>

               <div v-if="event.description" class="mt-8 p-6 bg-primary/5 rounded-2xl border-l-4 border-primary/40 text-xs text-white/50 leading-relaxed font-bold italic transition-all group-hover:text-white/70">
                 "{{ event.description }}"
               </div>
            </div>
          </div>
        </div>

        <!-- AI Productivity Note -->
        <div class="p-10 bg-primary/5 rounded-[3.5rem] border border-primary/20 border-dashed relative group overflow-hidden shadow-inner">
          <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <p class="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6 italic">
             <Zap class="w-5 h-5 inline-block mr-2" /> Telemetría de Productividad
          </p>
          <p class="text-sm text-white/30 font-black leading-relaxed italic group-hover:text-white/60 transition-colors">
            "Sincronizar tus momentos de ideación con tu agenda reduce la entropía cognitiva. Deja que MentorIA gestione los hitos."
          </p>
        </div>
      </div>
    </div>

    <!-- ELITE ADD EVENT MODAL -->
    <Transition name="modal-fade">
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-bg-deep/90 backdrop-blur-3xl" @click="showAddModal = false"></div>
        
        <div class="bg-bg-card w-full max-w-2xl p-12 lg:p-16 relative z-10 border border-primary/20 rounded-[4rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.8)] animate-scale-up overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          
          <header class="flex items-center justify-between mb-16 relative z-10">
            <div>
              <h2 class="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Nueva Sesión</h2>
              <div class="flex items-center gap-3 mt-4">
                 <div class="w-1.5 h-1.5 rounded-full bg-primary animate-neural-pulse"></div>
                 <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Arquitectura de Agendamiento</p>
              </div>
            </div>
            <button @click="showAddModal = false" class="w-14 h-14 bg-white/5 rounded-2xl hover:bg-white/10 text-white/20 hover:text-white transition-all flex items-center justify-center border border-white/5 shadow-inner">
              <X class="w-7 h-7" />
            </button>
          </header>

          <form @submit.prevent="handleAddEvent" class="space-y-10 relative z-10">
            <div class="space-y-8">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Título de la Sesión</label>
                <input v-model="newEvent.title" type="text" placeholder="Ej: Clase de Filosofía Moderna" class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-bold text-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all duration-500 shadow-inner" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="space-y-4">
                    <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Fecha Cronológica</label>
                    <input v-model="newEvent.event_date" type="date" class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-bold text-base focus:border-primary/50 outline-none transition-all duration-500 shadow-inner invert-calendar" required />
                 </div>
                 <div class="space-y-4">
                    <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Identificador Visual</label>
                    <div class="relative">
                       <select v-model="newEvent.color" class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-black text-[11px] uppercase tracking-widest focus:border-primary/50 outline-none appearance-none cursor-pointer shadow-inner">
                        <option value="primary">Cian Neuronal</option>
                        <option value="secondary">Violeta Cuántico</option>
                        <option value="accent">Oro Pedagógico</option>
                      </select>
                      <ChevronDown class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                 </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="space-y-4">
                    <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Inicio</label>
                    <input v-model="newEvent.start_time" type="time" class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-black text-base focus:border-primary/50 outline-none transition-all duration-500 shadow-inner invert-calendar" />
                 </div>
                 <div class="space-y-4">
                    <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Finalización</label>
                    <input v-model="newEvent.end_time" type="time" class="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-black text-base focus:border-primary/50 outline-none transition-all duration-500 shadow-inner invert-calendar" />
                 </div>
              </div>

              <div class="space-y-4">
                <label class="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Metadatos / Notas</label>
                <textarea v-model="newEvent.description" placeholder="Objetivos o recursos de la sesión..." class="w-full h-32 bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-bold text-sm focus:border-primary/50 outline-none resize-none transition-all duration-500 shadow-inner custom-scrollbar"></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              class="relative group w-full py-7 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 overflow-hidden"
            >
               <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
               <div class="flex items-center justify-center gap-4 relative z-10">
                  <Check class="w-6 h-6" />
                  <span>Sincronizar en Agenda</span>
               </div>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "../style.css";

.animate-page-in {
  animation: pageIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(40px); filter: blur(15px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-neural-pulse {
  animation: neuralPulse 3s ease-in-out infinite;
}

@keyframes neuralPulse {
  0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
  50% { opacity: 0.7; transform: scale(1.1); filter: brightness(1.5); }
}

.animate-slide-right {
  animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-30px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0); }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
}

.invert-calendar::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(2);
  cursor: pointer;
  @apply hover:scale-110 transition-transform;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
}

.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}

.shadow-glow-primary {
  box-shadow: 0 10px 40px -10px rgba(var(--color-primary-rgb), 0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0.2;
  transition: opacity 0.3s ease;
  cursor: pointer;
  filter: invert(1);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
