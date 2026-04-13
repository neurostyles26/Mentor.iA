import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Clear stale session tokens from URL for a cleaner experience (OAuth callbacks)
if (window.location.hash || window.location.search.includes('access_token')) {
  window.history.replaceState(null, '', window.location.pathname)
}

app.mount('#app')
