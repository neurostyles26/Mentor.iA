import { ref } from 'vue'

export function useTextToSpeech() {
  const isSpeaking = ref(false)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  let utterance = null
  let voices = []

  // Inicialización proactiva de voces
  const loadVoices = () => {
    if (!synth) return
    voices = synth.getVoices()
  }

  if (synth) {
    loadVoices()
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices
    }
  }

  const stop = () => {
    if (synth?.speaking) {
      synth.cancel()
      isSpeaking.value = false
    }
  }

  const getBestVoice = () => {
    if (voices.length === 0) loadVoices()
    if (voices.length === 0) return null

    const priorities = [
      v => v.lang.includes('es') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')),
      v => v.lang.includes('es') && v.name.includes('Google'),
      v => v.lang.includes('es-ES') && v.name.includes('Microsoft'),
      v => v.lang.includes('es')
    ]

    for (const priority of priorities) {
      const voice = voices.find(priority)
      if (voice) return voice
    }
    return null
  }

  // Función para dividir el texto en fragmentos (chunks)
  // Esto ayuda a que el navegador empiece a hablar mucho más rápido en móviles.
  const chunkText = (text) => {
    const maxLength = 200 // Longitud óptima para móviles
    const chunks = []
    let current = text

    while (current.length > 0) {
      if (current.length <= maxLength) {
        chunks.push(current)
        break
      }

      let cutAt = current.lastIndexOf('.', maxLength)
      if (cutAt === -1) cutAt = current.lastIndexOf(',', maxLength)
      if (cutAt === -1) cutAt = current.lastIndexOf(' ', maxLength)
      if (cutAt === -1) cutAt = maxLength

      chunks.push(current.substring(0, cutAt + 1).trim())
      current = current.substring(cutAt + 1).trim()
    }
    return chunks
  }

  const speak = (text) => {
    if (!text || !synth) return

    stop()
    
    // Forzar reanudación del motor (fix crítico para móviles)
    if (synth.paused) synth.resume()

    const chunks = chunkText(text)
    let currentChunkIndex = 0

    const speakNextChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        isSpeaking.value = false
        return
      }

      const chunk = chunks[currentChunkIndex]
      utterance = new SpeechSynthesisUtterance(chunk)
      
      const bestVoice = getBestVoice()
      if (bestVoice) {
        utterance.voice = bestVoice
        utterance.lang = bestVoice.lang
      } else {
        utterance.lang = 'es-ES'
      }
      
      utterance.rate = 0.95 
      utterance.pitch = 1.0 // Pitch neutro es más rápido de procesar
      utterance.volume = 1.0

      utterance.onstart = () => {
        isSpeaking.value = true
      }

      utterance.onend = () => {
        currentChunkIndex++
        speakNextChunk()
      }

      utterance.onerror = (e) => {
        console.error('Speech synthesis error', e)
        isSpeaking.value = false
      }

      // Ejecución inmediata (sin setTimeout)
      synth.speak(utterance)
    }

    speakNextChunk()
  }

  // Función para "desbloquear" la voz en móviles (debe llamarse en un evento de usuario)
  const unlock = () => {
    if (!synth) return
    const silent = new SpeechSynthesisUtterance('')
    silent.volume = 0
    synth.speak(silent)
  }

  return {
    isSpeaking,
    speak,
    stop,
    unlock
  }
}

