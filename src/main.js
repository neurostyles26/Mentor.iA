import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

import { useRegisterSW } from 'virtual:pwa-register/vue'

const app = createApp(App)
const pinia = createPinia()

// Registro automático de Service Worker
useRegisterSW()

app.use(pinia)
app.use(router)

// Mount the application
app.mount('#app')
