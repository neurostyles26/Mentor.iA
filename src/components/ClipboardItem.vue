<script setup>
import { ref } from 'vue'
import { Copy, Trash2, Edit2, Check, Tag } from 'lucide-vue-next'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['delete', 'update'])

const isEditing = ref(false)
const editedContent = ref(props.item.content)
const copied = ref(false)

const tags = ['Clase', 'Examen', 'Actividad', 'Tarea']

const copyContent = () => {
  navigator.clipboard.writeText(props.item.content)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const saveEdit = () => {
  emit('update', props.item.id, { content: editedContent.value })
  isEditing.value = false
}

const updateTag = (tag) => {
  emit('update', props.item.id, { tag })
}
</script>

<template>
  <div class="glass-panel p-4 mb-4 group hover:border-primary/20 transition-all flex flex-col gap-3">
    <div class="flex justify-between items-start">
      <!-- Tag Select -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="t in tags" 
          :key="t"
          @click="updateTag(t)"
          class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border transition-all"
          :class="item.tag === t ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20'"
        >
          {{ t }}
        </button>
      </div>

      <div class="flex gap-2">
        <button @click="copyContent" class="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors">
          <Check v-if="copied" :size="16" class="text-secondary" />
          <Copy v-else :size="16" />
        </button>
        <button @click="isEditing = !isEditing" class="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors">
          <Edit2 :size="16" />
        </button>
        <button @click="emit('delete', item.id)" class="p-1.5 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-500 transition-colors">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <div v-if="isEditing" class="space-y-2">
      <textarea 
        v-model="editedContent"
        class="input-field w-full text-sm min-h-[100px] resize-none"
      ></textarea>
      <div class="flex justify-end gap-2">
        <button @click="isEditing = false" class="text-xs text-text-muted hover:text-white">Cancelar</button>
        <button @click="saveEdit" class="text-xs text-primary font-bold">Guardar</button>
      </div>
    </div>
    <div v-else class="text-sm text-text-main line-clamp-4 leading-relaxed whitespace-pre-wrap">
      {{ item.content }}
    </div>

    <div class="text-[10px] text-text-muted mt-2">
      {{ new Date(item.created_at).toLocaleDateString('es-CO') }}
    </div>
  </div>
</template>
