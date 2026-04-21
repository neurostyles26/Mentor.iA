import { ref } from 'vue'

export function useTextToSpeech() {
  const isSpeaking = ref(false)
  const synth = window.speechSynthesis
  let utterance = null

  const stop = () => {
    if (synth.speaking) {
      synth.cancel()
      isSpeaking.value = false
    }
  }

  const speak = (text) => {
    if (!text || !synth) return

    stop()

    utterance = new SpeechSynthesisUtterance(text)
    
    // Configuración de voz
    const voices = synth.getVoices()
    // Buscar la mejor voz en español
    const spanishVoice = voices.find(v => v.lang.includes('es-') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Helena') || v.name.includes('Microsoft'))) 
                        || voices.find(v => v.lang.includes('es'))
    
    if (spanishVoice) {
      utterance.voice = spanishVoice
    }
    
    utterance.lang = 'es-ES'
    utterance.rate = 1.0
    utterance.pitch = 1.0

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

    synth.speak(utterance)
  }

  return {
    isSpeaking,
    speak,
    stop
  }
}
