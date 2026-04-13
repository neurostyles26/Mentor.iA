<script setup>
import { FileText, Pencil, Calendar, Settings } from 'lucide-vue-next'

const emit = defineEmits(['selectPrompt'])

const prompts = [
  {
    id: 'examen',
    label: 'Generar examen',
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary/10',
    text: 'Genera un examen de 5 preguntas sobre [tema] para el nivel [grado], siguiendo los DBA de Colombia.'
  },
  {
    id: 'actividad',
    label: 'Generar actividad',
    icon: Pencil,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    text: 'Diseña una actividad práctica de 45 minutos para el tema [tema] en el grado [grado].'
  },
  {
    id: 'plan',
    label: 'Generar plan de clase',
    icon: Calendar,
    color: 'text-accent',
    bg: 'bg-accent/10',
    text: 'Crea un plan de clase detallado para el tema [tema] cubriendo: objetivos, materiales, inicio, desarrollo y evaluación.'
  }
]
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <button 
      v-for="p in prompts" 
      :key="p.id"
      @click="emit('selectPrompt', p.text)"
      class="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-bg-card hover:border-white/20 hover:scale-105 transition-all text-sm font-medium"
    >
      <component :is="p.icon" :class="p.color" :size="16" />
      <span class="text-text-main">{{ p.label }}</span>
    </button>
  </div>
</template>
