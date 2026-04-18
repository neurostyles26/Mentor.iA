// @ts-nocheck
import { GoogleGenerativeAI } from "googlegenai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  prompt: string;
  grade?: string;
  subject?: string;
  type?: 'lesson' | 'workshop' | 'exam';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}))
    const { prompt, grade = 'No especificado', subject = 'General', type = 'lesson' } = body

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'El tema es requerido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API Key no configurada en Supabase Secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const PRIMARY_MODEL = "gemma-4-31b-it"
    const FALLBACK_MODEL = "gemini-1.5-flash"

    let systemPrompt = ''
    if (type === 'lesson') {
      systemPrompt = `Eres un Mentor IA experto en diseño curricular.
Materia: ${subject}. Grado: ${grade}.
Diseña una LECCIÓN profesional con Objetivos de Aprendizaje, Contenido Base (con ejemplos detallados), Actividades Rápidas de refuerzo y Consejos Pedagógicos innovadores.
Usa Markdown elegante con Tablas, Listas y Negritas.`
    } else if (type === 'workshop') {
      systemPrompt = `Eres un Mentor IA especialista en TALLERES PRÁCTICOS.
Materia: ${subject}. Grado: ${grade}.
Crea un TALLER con Marco Teórico resumido, 5-10 Ejercicios Prácticos de dificultad progresiva, un Reto Creativo final y Criterios de Evaluación claros.
Usa Markdown elegante.`
    } else {
      systemPrompt = `Eres un Mentor IA experto en EVALUACIÓN.
Materia: ${subject}. Grado: ${grade}.
Crea un EXAMEN que combine Selección Múltiple, Preguntas Abiertas de razonamiento y una LLAVE DE RESPUESTAS detallada al final.
Usa Markdown elegante.`
    }

    let responseText = '';
    let modelUsed = 'primary';

    try {
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL })
      const result = await model.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
      responseText = result.response.text()
    } catch (primaryError) {
      console.warn('Primary model failed, using fallback:', primaryError)
      modelUsed = 'fallback'
      try {
        const model = genAI.getGenerativeModel({ model: FALLBACK_MODEL })
        const result = await model.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
        responseText = result.response.text()
      } catch (fallbackError) {
        throw new Error(`Ambos modelos fallaron. Error: ${fallbackError}`)
      }
    }

    return new Response(
      JSON.stringify({ text: responseText, model_used: modelUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('Error in generate-lessons:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
