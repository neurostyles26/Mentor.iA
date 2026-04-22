import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    subscription: null
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => !n.is_read).length,
    sortedNotifications: (state) => [...state.notifications].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    )
  },

  actions: {
    async fetchNotifications() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      this.notifications = data
    },

    async markAsRead(id) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      if (error) {
        console.error('Error marking notification as read:', error)
        return
      }

      const notif = this.notifications.find(n => n.id === id)
      if (notif) notif.is_read = true
    },

    async markAllAsRead() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false)

      if (error) {
        console.error('Error marking all as read:', error)
        return
      }

      this.notifications.forEach(n => n.is_read = true)
    },

    async deleteNotification(id) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting notification:', error)
        return
      }

      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    initializeRealtime() {
      if (this.subscription) return

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) return

        this.subscription = supabase
          .channel('realtime_notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${session.user.id}`
            },
            (payload) => {
              this.notifications.unshift(payload.new)
              // Play a subtle sound or trigger a browser notification if needed
              this.playNotificationSound()
            }
          )
          .subscribe()
      })
    },

    playNotificationSound() {
      // Subtle elegant sound for a premium app
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3')
      audio.volume = 0.2
      audio.play().catch(e => console.log('Audio play blocked'))
    },

    stopRealtime() {
      if (this.subscription) {
        supabase.removeChannel(this.subscription)
        this.subscription = null
      }
    }
  }
})
