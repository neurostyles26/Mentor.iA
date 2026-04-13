import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useClipboardStore = defineStore('clipboard', () => {
  const items = ref([])
  const isLoading = ref(false)

  const loadItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    isLoading.value = true
    const { data, error } = await supabase.from('clipboard_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else items.value = data
    isLoading.value = false
  }

  const addItem = async (content, title = 'Fragmento guardado', tag = 'Clase') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('clipboard_items')
      .insert([{ user_id: user.id, title, content, tag }])
      .select()
      .single()

    if (error) throw error
    items.value.unshift(data)
  }

  const updateItem = async (id, updates) => {
    const { data, error } = await supabase.from('clipboard_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) items.value[index] = data
  }

  const deleteItem = async (id) => {
    const { error } = await supabase.from('clipboard_items').delete().eq('id', id)
    if (error) throw error
    items.value = items.value.filter(item => item.id !== id)
  }

  return {
    items,
    isLoading,
    loadItems,
    addItem,
    updateItem,
    deleteItem
  }
})
