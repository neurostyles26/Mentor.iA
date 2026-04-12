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
    
    // Using Gemma 4 model - Ensuring standard ID format
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemma-4-31b-it", 
      generationConfig: { 
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 3000 // Increased for more detailed content
      }
    })

    console.log(`Generating ${type} for topic: ${prompt} using Gemma 4...`)

    const result = await generativeModel.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
    const res = await result.response
    const generatedText = res.text()

    if (!generatedText) {
      throw new Error('La IA no devolvió ningún contenido. Intenta con otro tema.')
    }

    return new Response(
      JSON.stringify({ text: generatedText }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in generate-lessons (Gemma 4):', error)
    
    // Differentiate between API errors and internal errors
    const statusCode = error.message?.includes('404') || error.message?.includes('not found') ? 404 : 400
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error desconocido en Gemma 4',
        stack: error.stack
      }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: statusCode 
      }
    )
  }
})
