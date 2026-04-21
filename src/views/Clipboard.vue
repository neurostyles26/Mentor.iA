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
  MoreVertical
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
  if (confirm('¿Deseas eliminar este recorte del inventario?')) {
    await clipboardStore.deleteItem(id)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-12 animate-fade-in relative z-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.3em]">
          <ClipboardList class="w-4 h-4" /> Inventario de Ideas
        </div>
        <h1 class="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">Mis <span class="text-secondary tracking-normal">Recortes</span></h1>
        <p class="text-white/40 text-lg font-bold max-w-xl">Organiza los fragmentos guardados durante tus sesiones y expórtalos en formatos profesionales.</p>
      </div>

      <div class="relative shrink-0">
        <button 
          @click="showExportMenu = !showExportMenu"
          :disabled="clipboardStore.items.length === 0"
          class="btn-primary flex items-center gap-3 px-10 py-5 rounded-2xl bg-secondary hover:bg-secondary/80 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-glow-secondary disabled:opacity-20 transition-all active:scale-95"
        >
          <FileDown class="w-5 h-5" /> Exportar Todo
          <ChevronDown class="w-4 h-4 transition-transform" :class="showExportMenu ? 'rotate-180' : ''" />
        </button>

        <!-- Export Menu -->
        <Transition name="premium-pop">
          <div v-if="showExportMenu" class="absolute right-0 mt-4 w-64 glass-panel border-white/10 shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
            <button @click="handleExport('pdf')" class="w-full text-left px-5 py-4 text-[10px] font-black text-white/70 hover:bg-white/5 transition-colors flex items-center gap-4 group uppercase tracking-widest">
              <div class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <FileText class="w-4 h-4" />
              </div>
              PDF Profesional
            </button>
            <button @click="handleExport('excel')" class="w-full text-left px-5 py-4 text-[10px] font-black text-white/70 hover:bg-white/5 transition-colors flex items-center gap-4 group uppercase tracking-widest">
              <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <TableIcon class="w-4 h-4" />
              </div>
              Hoja Excel (XLSX)
            </button>
            <button @click="handleExport('slides')" class="w-full text-left px-5 py-4 text-[10px] font-black text-white/70 hover:bg-white/5 transition-colors flex items-center gap-4 group uppercase tracking-widest">
              <div class="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Presentation class="w-4 h-4" />
              </div>
              Presentación (PPTX)
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Content List -->
    <div v-if="clipboardStore.items.length > 0" class="space-y-6 pb-20">
      <div 
        v-for="item in clipboardStore.items" 
        :key="item.id"
        class="glass-panel group relative flex flex-col md:flex-row overflow-hidden transition-all duration-500 border-white/5 hover:border-secondary/30"
      >
        <!-- Tag/Label Column -->
        <div class="md:w-64 p-8 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] flex flex-col justify-between">
          <div class="space-y-4">
             <div class="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-lg text-secondary text-[8px] font-black uppercase tracking-widest border border-secondary/20">
               {{ item.tag || 'General' }}
             </div>
             <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">{{ new Date(item.created_at).toLocaleDateString() }}</p>
          </div>
          <button @click="deleteItem(item.id)" class="text-white/20 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all self-start md:self-auto">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <!-- Content Column -->
        <div class="flex-1 p-8 lg:p-10 relative">
          <div class="absolute top-8 right-8 text-secondary/30">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-black text-white/90 mb-4 tracking-tight uppercase italic">{{ item.title || 'Recorte sin título' }}</h3>
          <p class="text-sm text-gray-400 leading-relaxed font-medium line-clamp-4">{{ item.content }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-[500px] flex flex-col items-center justify-center text-center glass-panel border-dashed p-12">
      <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5">
        <ClipboardList class="w-10 h-10 text-white/10" />
      </div>
      <h3 class="text-2xl font-black text-white mb-4 uppercase italic">Tu inventario está vacío</h3>
      <p class="text-white/40 max-w-sm font-bold">Guarda fragmentos del chat o del generador usando el icono de "Guardar" para verlos aquí y exportarlos profesionalmente.</p>
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

.shadow-glow-secondary:hover {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.premium-pop-enter-active,
.premium-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.premium-pop-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.premium-pop-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
