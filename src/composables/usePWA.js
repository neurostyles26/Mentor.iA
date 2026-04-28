import { ref, onMounted, onUnmounted } from 'vue'

export function usePWA() {
  const installEvent = ref(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  const handleBeforeInstallPrompt = (e) => {
    // Evitar que el navegador muestre el prompt automático
    e.preventDefault()
    // Guardar el evento para dispararlo manualmente
    installEvent.value = e
    isInstallable.value = true
  }

  const handleAppInstalled = () => {
    isInstallable.value = false
    installEvent.value = null
    isInstalled.value = true
    console.log('MentorIA ha sido instalada con éxito.')
  }

  onMounted(() => {
    console.log('PWA: Buscando soporte de instalación...')
    
    // Si el evento ya fue capturado globalmente, lo usamos
    if (window.deferredPrompt) {
      handleBeforeInstallPrompt(window.deferredPrompt)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Detectar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      isInstalled.value = true
      console.log('PWA: Ya instalada en este dispositivo.')
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  })

  const installApp = async () => {
    if (!installEvent.value) return

    // Mostrar el prompt nativo
    installEvent.value.prompt()

    // Esperar la respuesta del usuario
    const { outcome } = await installEvent.value.userChoice
    console.log(`User response to install prompt: ${outcome}`)

    // Limpiar el evento
    installEvent.value = null
    isInstallable.value = false
  }

  return {
    isInstallable,
    isInstalled,
    installApp
  }
}
