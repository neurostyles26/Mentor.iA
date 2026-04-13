import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useChatStore = defineStore('chat', () => {
  const chats = ref([])
  const currentChatId = ref(null)
  const messages = ref([])
  const isLoading = ref(false)

  const loadChats = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else chats.value = data
  }

  const selectChat = async (chatId) => {
    currentChatId.value = chatId
    isLoading.value = true
    const { data, error } = await supabase.from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) console.error(error)
    else messages.value = data
    isLoading.value = false
  }

  const sendMessage = async (content) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Create chat if doesn't exist
    if (!currentChatId.value) {
      const { data: newChat, error: chatError } = await supabase.from('chats')
        .insert([{ user_id: user.id, title: content.substring(0, 30) + '...' }])
        .select()
        .single()
      
      if (chatError) throw chatError
      currentChatId.value = newChat.id
      chats.value.unshift(newChat)
    }

    // 2. Add user message to DB
    const { data: userMsg, error: userMsgError } = await supabase.from('messages')
      .insert([{ chat_id: currentChatId.value, role: 'user', content }])
      .select()
      .single()
    
    if (userMsgError) throw userMsgError
    messages.value.push(userMsg)

    // 3. Call Edge Function
    isLoading.value = true
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('teacher-chat', {
        body: { 
          message: content,
          chatHistory: messages.value.slice(-6).map(m => ({ role: m.role, content: m.content }))
        }
      })

      if (functionError) throw functionError

      // 4. Add assistant message to DB
      const { data: assistantMsg, error: assistantMsgError } = await supabase.from('messages')
        .insert([{ 
          chat_id: currentChatId.value, 
          role: 'assistant', 
          content: functionData.reply 
        }])
        .select()
        .single()
      
      if (assistantMsgError) throw assistantMsgError
      messages.value.push(assistantMsg)
    } finally {
      isLoading.value = false
    }
  }

  const deleteChat = async (chatId) => {
    const { error } = await supabase.from('chats').delete().eq('id', chatId)
    if (error) throw error
    chats.value = chats.value.filter(c => c.id !== chatId)
    if (currentChatId.value === chatId) {
      currentChatId.value = null
      messages.value = []
    }
  }

  return {
    chats,
    currentChatId,
    messages,
    isLoading,
    loadChats,
    selectChat,
    sendMessage,
    deleteChat
  }
})
