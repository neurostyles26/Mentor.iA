import { GoogleGenerativeAI } from "googlegenai"

const genCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  prompt: string;
  grade?: string;
  subject?: string;
  type?: 'lesson' | 'workshop' | 'exam';
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: genCorsHeaders })
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}))
    const { 
      prompt, 
      grade = 'No especificado', 
      subject = 'General',
      type = 'lesson' 
    } = body

    if (!prompt) {
      throw new Error('El tema a desarrollar es requerido.')
    }

    // --- Gemma 4 via Gemini API ---
    // Try both naming conventions for the secret
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

    let systemPrompt = ''
    if (type === 'lesson') {
      systemPrompt = `Eres un Mentor IA basado en Gemma 4, experto en diseño curricular. 
Materia: ${subject}. Grado: ${grade}. 
Diseña una LECCIÓN profesional con Objetivos de Aprendizaje, Contenido Base (con ejemplos detallados), Actividades Rápidas de refuerzo y Consejos Pedagógicos innovadores.`
    } else if (type === 'workshop') {
      systemPrompt = `Eres un Mentor IA basado en Gemma 4, especialista en TALLERES PRÁCTICOS. 
Materia: ${subject}. Grado: ${grade}. 
Crea un TALLER con Marco Teórico resumido, 5-10 Ejercicios Prácticos de dificultad progresiva, un Reto Creativo final y Criterios de Evaluación claros.`
    } else if (type === 'exam') {
      systemPrompt = `Eres un Mentor IA basado en Gemma 4, experto en EVALUACIÓN. 
Materia: ${subject}. Grado: ${grade}. 
Crea un EXAMEN que combine Selección Múltiple, Preguntas Abiertas de razonamiento y una LLAVE DE RESPUESTAS detallada al final.`
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
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 3000
        }
      })
      result = await model.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
    } catch (modelError: any) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed, trying fallback ${FALLBACK_MODEL}:`, modelError.message)
      const fallbackModel = genAI.getGenerativeModel({ 
        model: FALLBACK_MODEL,
        generationConfig: { 
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 3000
        }
      })
      result = await fallbackModel.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
    }

    const res = await result.response
    const generatedText = res.text()

    if (!generatedText) {
      throw new Error('La IA no devolvió ningún contenido. Intenta con otro tema.')
    }

    return new Response(
      JSON.stringify({ text: generatedText, model_used: result.response ? 'primary' : 'fallback' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in generate-lessons:', error)
    
    let errorType = 'UNKNOWN_ERROR'
    if (error.message?.includes('404')) errorType = 'MODEL_NOT_FOUND'
    if (error.message?.includes('401') || error.message?.includes('403')) errorType = 'AUTH_ERROR'
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error en Gemma 4',
        type: errorType,
        details: 'Verifica la GEMINI_API_KEY en Supabase Secrets.'
      }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('404') ? 404 : 500
      }
    )
  }
})
