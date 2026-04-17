import { GoogleGenerativeAI } from "googlegenai"

const genCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  pregunta: string;
  contexto?: string;
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: genCorsHeaders })
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}))
    const { pregunta, contexto = 'General' } = body

    if (!pregunta) {
      throw new Error('La pregunta es requerida.')
    }

    // --- Gemma 4 via Gemini API ---
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!GEMINI_API_KEY) {
      console.error('Edge Function Error: Missing GEMINI_API_KEY secret')
      return new Response(
        JSON.stringify({ 
          error: 'CONFIG_ERROR: La API Key de Gemma 4 no está configurada en Supabase.',
          details: 'Debes ejecutar: supabase secrets set GEMINI_API_KEY=tu_llave'
        }),
        { headers: { ...genCorsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    
    // Model Selection with Fallback logic
    const PRIMARY_MODEL = "gemma-4-31b-it" 
    const FALLBACK_MODEL = "gemini-1.5-flash"
    
    let result;
    try {
      console.log(`Attempting to use primary model: ${PRIMARY_MODEL}`)
      const model = genAI.getGenerativeModel({ 
        model: PRIMARY_MODEL,
        generationConfig: { 
          temperature: 0.75,
          maxOutputTokens: 2048
        }
      })
      
      const finalPrompt = `Actúa como un Mentor Pedagógico de Vanguardia (impulsado por Gemma 4). 
Contexto: ${contexto}
Pregunta: ${pregunta}

Instrucciones:
1. Proporciona una respuesta clara, profesional y motivadora.
2. Usa un lenguaje pedagógico moderno.
3. Si el usuario es un docente, ofrece consejos prácticos para el aula.
4. Mantén un tono empático y constructivo.`

      result = await model.generateContent(finalPrompt)
    } catch (modelError: any) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed, trying fallback ${FALLBACK_MODEL}:`, modelError.message)
      
      const fallbackModel = genAI.getGenerativeModel({ 
        model: FALLBACK_MODEL,
        generationConfig: { 
          temperature: 0.75,
          maxOutputTokens: 2048
        }
      })
      
      const finalPrompt = `Actúa como un Mentor Pedagógico de Vanguardia (usando motor de respaldo). 
Contexto: ${contexto}
Pregunta: ${pregunta}

Instrucciones:
1. Proporciona una respuesta clara, profesional y motivadora.
2. Usa un lenguaje pedagógico moderno.
3. Si el usuario es un docente, ofrece consejos prácticos para el aula.
4. Mantén un tono empático y constructivo.`

      result = await fallbackModel.generateContent(finalPrompt)
    }

    const res = await result.response
    const generatedText = res.text()

    if (!generatedText) {
      throw new Error('La IA no pudo generar una respuesta. Intenta reformular tu pregunta.')
    }

    return new Response(
      JSON.stringify({ text: generatedText, model_used: result.response ? 'primary' : 'fallback' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in tutor-chat:', error)
    
    let errorType = 'UNKNOWN_ERROR'
    if (error.message?.includes('404')) errorType = 'MODEL_NOT_FOUND'
    if (error.message?.includes('401') || error.message?.includes('403')) errorType = 'AUTH_ERROR'
    if (error.message?.includes('API_KEY_INVALID')) errorType = 'INVALID_API_KEY'

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error en el Tutor Chat',
        type: errorType,
        details: 'Asegúrate de que GEMINI_API_KEY esté configurada correctamente en Supabase Secrets.'
      }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('404') ? 404 : 500
      }
    )
  }
})
