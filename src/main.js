import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import { useAuthStore } from './store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Auth before mounting
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})
