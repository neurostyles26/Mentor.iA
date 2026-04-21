import { ref } from 'vue'

export function useTextToSpeech() {
  const isSpeaking = ref(false)
  const synth = window.speechSynthesis
  let utterance = null

  // Refuerzo para cargar voces asíncronamente (especial para Chrome/Edge)
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => synth.getVoices()
  }

  const stop = () => {
    if (synth.speaking) {
      synth.cancel()
      isSpeaking.value = false
    }
  }

  const getBestVoice = () => {
    const voices = synth.getVoices()
    if (voices.length === 0) return null

    // PRIORIDADES GOURMET:
    const priorities = [
      v => v.lang.includes('es') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')), // Calidad Premium (Edge/Safari)
      v => v.lang.includes('es') && v.name.includes('Google'), // Calidad Chrome
      v => v.lang.includes('es-ES') && v.name.includes('Microsoft'), // Calidad Microsoft Local
      v => v.lang.includes('es') // Cualquier español
    ]

    for (const priority of priorities) {
      const voice = voices.find(priority)
      if (voice) return voice
    }
    return null
  }

  const speak = (text) => {
    if (!text || !synth) return

    stop()

    utterance = new SpeechSynthesisUtterance(text)
    
    // Configuración de voz refinada
    const bestVoice = getBestVoice()
    if (bestVoice) {
      utterance.voice = bestVoice
      utterance.lang = bestVoice.lang
    } else {
      utterance.lang = 'es-ES'
    }
    
    // AFINACIÓN ELEGANTE:
    // Un pitch de 0.9 lo hace sonar más maduro y profesional.
    // Un rate de 0.95 le da una cadencia más elocuente y pausada.
    utterance.rate = 0.95 
    utterance.pitch = 0.9
    utterance.volume = 1.0

    utterance.onstart = () => {
      isSpeaking.value = true
    }

    utterance.onend = () => {
      isSpeaking.value = false
    }

    utterance.onerror = (e) => {
      console.error('Speech synthesis error', e)
      isSpeaking.value = false
    }

    // Pequeño delay para asegurar que el motor esté listo
    setTimeout(() => {
      // Forzar liberación de pausa del navegador si quedó trabado
      if (synth.paused) synth.resume()
      
      try {
        synth.speak(utterance)
      } catch (e) {
        console.error('Error al iniciar síntesis:', e)
        isSpeaking.value = false
      }
    }, 50)
  }

  return {
    isSpeaking,
    speak,
    stop
  }
}
