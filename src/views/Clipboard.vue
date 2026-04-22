<script setup>
import { onMounted, ref } from 'vue'
import { useClipboardStore } from '../store/clipboard'
import { exportService } from '../lib/exportService'
import { 
  ClipboardList, 
  Trash2, 
  FileDown, 
  ChevronDown,
  Sparkles,
  FileText,
  Table as TableIcon,
  Presentation,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar
} from 'lucide-vue-next'

const clipboardStore = useClipboardStore()
const showExportMenu = ref(false)

onMounted(() => {
  clipboardStore.loadItems()
})

const handleExport = (type) => {
  if (clipboardStore.items.length === 0) return
  
  const fileName = `MentorIA_Recortes_${new Date().toISOString().split('T')[0]}`
  
  if (type === 'pdf') {
    exportService.exportToPDF(clipboardStore.items, `${fileName}.pdf`)
  } else if (type === 'excel') {
    exportService.exportToExcel(clipboardStore.items, `${fileName}.xlsx`)
  } else if (type === 'slides') {
    exportService.exportToSlides(clipboardStore.items, `${fileName}.pptx`)
  }
  
  showExportMenu.value = false
}

const deleteItem = async (id) => {
  if (confirm('¿Deseas purgar este recorte de la base de datos?')) {
    await clipboardStore.deleteItem(id)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-16 animate-page-in">
    <!-- Sophisticated Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-12 border-b border-white/5 relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      
      <div class="space-y-6 relative z-10">
        <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] italic shadow-inner">
          <ClipboardList class="w-4 h-4 shadow-glow" /> Inventario de Ideas
        </div>
        <h1 class="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none uppercase">
          Mis <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Recortes</span>
        </h1>
        <p class="text-white/30 text-xl font-bold max-w-2xl leading-relaxed">Organiza los fragmentos guardados durante tus sesiones y expórtalos en formatos profesionales de alta gama.</p>
      </div>

      <div class="relative shrink-0 z-10">
        <button 
          @click="showExportMenu = !showExportMenu"
          :disabled="clipboardStore.items.length === 0"
          class="group relative flex items-center gap-4 px-12 py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-glow hover:bg-secondary transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-20 disabled:translate-y-0 overflow-hidden"
        >
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
          <FileDown class="w-5 h-5 relative z-10" /> 
          <span class="relative z-10">Exportar Todo</span>
          <ChevronDown class="w-4 h-4 transition-transform duration-500 relative z-10" :class="showExportMenu ? 'rotate-180' : ''" />
        </button>

        <!-- Export Elite Menu -->
        <Transition name="premium-pop">
          <div v-if="showExportMenu" class="absolute right-0 mt-6 w-72 bg-bg-card border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] z-50 overflow-hidden py-3">
            <button @click="handleExport('pdf')" class="w-full text-left px-7 py-5 text-[10px] font-black text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <FileText class="w-5 h-5" />
                 </div>
                 PDF Profesional
              </div>
              <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button @click="handleExport('excel')" class="w-full text-left px-7 py-5 text-[10px] font-black text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <TableIcon class="w-5 h-5" />
                 </div>
                 Hoja Excel
              </div>
              <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button @click="handleExport('slides')" class="w-full text-left px-7 py-5 text-[10px] font-black text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between group uppercase tracking-[0.2em]">
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <Presentation class="w-5 h-5" />
                 </div>
                 Presentación
              </div>
              <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Content List -->
    <div v-if="clipboardStore.items.length > 0" class="grid grid-cols-1 gap-8 pb-24">
      <div 
        v-for="item in clipboardStore.items" 
        :key="item.id"
        class="bg-bg-card border border-white/5 rounded-[3rem] group relative flex flex-col md:flex-row overflow-hidden transition-all duration-700 hover:border-primary/40 hover:shadow-glow shadow-2xl"
      >
        <!-- Tag/Label Column -->
        <div class="md:w-72 p-10 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] flex flex-col justify-between items-start gap-10">
          <div class="space-y-6">
             <div class="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-xl text-primary text-[9px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-inner">
               <ShieldCheck class="w-3.5 h-3.5" /> {{ item.tag || 'General' }}
             </div>
             <div class="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                <Calendar class="w-3.5 h-3.5" />
                {{ new Date(item.created_at).toLocaleDateString() }}
             </div>
          </div>
          <button @click="deleteItem(item.id)" class="w-12 h-12 bg-white/5 text-white/20 hover:text-red-400 rounded-2xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 transition-all flex items-center justify-center group-hover:rotate-6 shadow-inner">
            <Trash2 class="w-5 h-5" />
          </button>
        </div>

        <!-- Content Column -->
        <div class="flex-1 p-10 lg:p-14 relative flex flex-col justify-center">
          <div class="absolute top-10 right-10 text-primary/10 group-hover:text-primary/30 transition-colors">
            <CheckCircle2 class="w-10 h-10" />
          </div>
          <h3 class="text-2xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">{{ item.title || 'Recorte sin título' }}</h3>
          <p class="text-base text-white/50 leading-relaxed font-bold line-clamp-4 italic group-hover:text-white/70 transition-colors">"{{ item.content }}"</p>
          
          <div class="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
             <div class="w-1 h-1 bg-primary rounded-full"></div>
             <span class="text-[8px] font-black text-primary uppercase tracking-[0.5em]">Patrón Detectado por MentorIA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State Elite -->
    <div v-else class="h-[600px] flex flex-col items-center justify-center text-center bg-bg-card border-4 border-dashed border-white/5 rounded-[4rem] p-16 relative overflow-hidden group">
      <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[100px]"></div>
      
      <div class="w-32 h-32 bg-white/5 rounded-[3.5rem] flex items-center justify-center mb-12 border border-white/5 shadow-inner relative z-10 animate-float">
        <ClipboardList class="w-14 h-14 text-white/10" />
      </div>
      <div class="space-y-6 relative z-10">
        <h3 class="text-4xl font-black text-white italic tracking-tighter uppercase">Inventario Vacío</h3>
        <p class="text-white/30 max-w-md mx-auto font-bold text-lg leading-relaxed">Tu ecosistema de ideas aún no tiene fragmentos. Captura la esencia de tus sesiones usando la herramienta de guardado.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.premium-pop-enter-active,
.premium-pop-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-pop-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
  filter: blur(10px);
}

.premium-pop-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
  filter: blur(10px);
}

.shadow-glow {
  box-shadow: 0 0 30px -10px var(--color-primary-glow);
}

.shadow-glow-secondary:hover {
  box-shadow: 0 0 40px -10px rgba(var(--color-primary-rgb), 0.4);
}
</style>
