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
  Sparkles
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
  <div class="max-w-7xl mx-auto pb-20 space-y-10 animate-fade-in">
    <!-- Header -->
    <header class="flex flex-col md:flex-row items-center justify-between gap-8 py-6">
      <div class="flex items-center gap-6">
        <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow transform rotate-3">
          <CalendarDays class="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">Agenda Digital</h1>
          <div class="flex items-center gap-3">
             <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
             <p class="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">Arquitectura de Tiempos v2.5</p>
          </div>
        </div>
      </div>

      <button 
        @click="showAddModal = true"
        class="flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 bg-primary text-white rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-premium hover:bg-secondary transition-all transform hover:-translate-y-1 active:scale-95 group w-full md:w-auto justify-center"
      >
        <Plus class="w-4 h-4 group-hover:rotate-90 transition-transform" />
        Agendar Clase
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Calendar Grid -->
      <div class="lg:col-span-8 space-y-6">
        <div class="glass-panel p-6 md:p-8">
          <!-- Calendar Controls -->
          <div class="flex items-center justify-between mb-10">
             <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">
               {{ currentMonthName }} <span class="text-primary not-italic tracking-tighter ml-2">{{ currentYear }}</span>
             </h2>
             <div class="flex items-center gap-3">
               <button @click="prevMonth" class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-primary hover:text-white transition-all">
                 <ChevronLeft class="w-5 h-5" />
               </button>
               <button @click="nextMonth" class="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-primary hover:text-white transition-all">
                 <ChevronRight class="w-5 h-5" />
               </button>
             </div>
          </div>

          <!-- Calendar Days Grid -->
          <div class="grid grid-cols-7 gap-2">
            <div 
              v-for="day in daysOfWeek" 
              :key="day" 
              class="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4"
            >
              {{ day }}
            </div>

            <div 
              v-for="(dayObj, idx) in calendarDays" 
              :key="idx"
              @click="selectDay(dayObj)"
              class="aspect-square rounded-2xl p-3 border border-transparent transition-all cursor-pointer relative group overflow-hidden"
              :class="[
                dayObj.currentMonth ? 'bg-white/2 hover:bg-white/5' : 'bg-transparent opacity-10 cursor-default',
                dayObj.isToday ? 'border-primary shadow-glow bg-primary/5' : 'border-white/5'
              ]"
            >
              <span 
                class="text-sm font-black transition-colors"
                :class="dayObj.currentMonth ? 'text-white' : 'text-white/20'"
              >
                {{ dayObj.day }}
              </span>
              
              <!-- Event Dots -->
              <div class="absolute bottom-3 left-3 flex gap-1">
                <div 
                  v-for="ev in getEventsForDay(dayObj).slice(0, 3)" 
                  :key="ev.id"
                  class="w-1.5 h-1.5 rounded-full bg-primary"
                ></div>
              </div>

              <!-- Selection Highlight -->
              <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Agenda Side Details -->
      <div class="lg:col-span-4 space-y-8">
        <div class="glass-panel p-6 md:p-8 relative overflow-hidden group border-primary/20">
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <CalendarIcon :size="120" />
          </div>

          <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8">Itinerario del Día</h3>
          <p class="text-white text-xl font-black mb-10 tracking-tight">{{ selectedDateLabel }}</p>

          <div v-if="selectedDayEvents.length === 0" class="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-30">
            <Sparkles class="w-12 h-12 text-primary/50" />
            <p class="text-[10px] font-black uppercase tracking-widest leading-relaxed">Sin compromisos<br/>agendados</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="event in selectedDayEvents" 
              :key="event.id"
              class="p-5 bg-white/2 rounded-2xl border border-white/5 group relative hover:border-primary/30 transition-all animate-slide-right"
            >
               <div class="flex justify-between items-start mb-4">
                 <h4 class="font-black text-white text-sm uppercase tracking-tight">{{ event.title }}</h4>
                 <button @click.stop="deleteEvent(event.id)" class="text-white/10 hover:text-red-400 transition-colors">
                   <Trash2 class="w-4 h-4" />
                 </button>
               </div>
               
               <div class="flex items-center gap-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                 <div class="flex items-center gap-2">
                   <Clock class="w-3.5 h-3.5 text-primary" />
                   {{ event.start_time || '--:--' }}
                 </div>
                 <div v-if="event.description" class="flex items-center gap-2">
                   <MapPin class="w-3.5 h-3.5 text-secondary" />
                   Aula Virtual
                 </div>
               </div>

               <p v-if="event.description" class="mt-4 text-xs text-white/50 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                 {{ event.description }}
               </p>
            </div>
          </div>
        </div>

        <!-- Productivity Note -->
        <div class="p-6 md:p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 border-dashed">
          <p class="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-4">Consejo Pedagógico</p>
          <p class="text-xs text-white/40 font-bold leading-relaxed italic">
            "Sincronizar tus momentos de ideación con tu agenda reduce la carga cognitiva. Tu cerebro IA se encarga de los recordatorios."
          </p>
        </div>
      </div>
    </div>

    <!-- ADD EVENT MODAL -->
    <Transition name="modal-fade">
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" @click="showAddModal = false"></div>
        
        <div class="glass-panel w-full max-w-xl p-8 lg:p-10 relative z-10 border-primary/20 shadow-2xl animate-scale-up">
          <header class="flex items-center justify-between mb-10">
            <div>
              <h2 class="text-3xl font-black text-white uppercase tracking-tighter italic">Nueva Sesión</h2>
              <p class="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-2">Arquitectura de Agendamiento</p>
            </div>
            <button @click="showAddModal = false" class="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <X class="w-6 h-6" />
            </button>
          </header>

          <form @submit.prevent="handleAddEvent" class="space-y-8">
            <div class="space-y-6">
              <div class="space-y-3">
                <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Título del Compromiso</label>
                <input v-model="newEvent.title" type="text" placeholder="Ej: Clase de Filosofía Moderna" class="input-field w-full py-5" required />
              </div>

              <div class="grid grid-cols-2 gap-6">
                 <div class="space-y-3">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Fecha de Evento</label>
                    <input v-model="newEvent.event_date" type="date" class="input-field w-full py-5" required />
                 </div>
                 <div class="space-y-3">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Color del Marcador</label>
                    <select v-model="newEvent.color" class="input-field w-full py-5 appearance-none">
                      <option value="primary">Cian Neuronal</option>
                      <option value="secondary">Violeta Cuántico</option>
                      <option value="accent">Oro Pedagógico</option>
                    </select>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                 <div class="space-y-3">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Hora de Inicio</label>
                    <input v-model="newEvent.start_time" type="time" class="input-field w-full py-5 text-sm" />
                 </div>
                 <div class="space-y-3">
                    <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Hora de Fin</label>
                    <input v-model="newEvent.end_time" type="time" class="input-field w-full py-5 text-sm" />
                 </div>
              </div>

              <div class="space-y-3">
                <label class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Descripción Breve</label>
                <textarea v-model="newEvent.description" placeholder="Objetivos o recursos necesarios..." class="input-field w-full h-24 py-5 resize-none text-xs"></textarea>
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full py-5 md:py-6 bg-primary text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-glow hover:bg-secondary hover:-translate-y-1.5 transition-all active:scale-95"
            >
              Confirmar en la Agenda
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "../style.css";

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-slide-right {
  animation: slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  @apply opacity-20 hover:opacity-100 transition-opacity cursor-pointer invert;
}
</style>
