// @ts-nocheck
import { GoogleGenerativeAI } from "googlegenai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
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

    let systemPrompt = ''
    if (type === 'lesson') {
      systemPrompt = `Eres un Mentor IA experto en diseño curricular colombiano.
Materia: ${subject}. Grado: ${grade}.
Diseña una LECCIÓN profesional con:
- Objetivos de Aprendizaje alineados con los DBA
- Contenido Base con ejemplos detallados
- Actividades Rápidas de refuerzo
- Consejos Pedagógicos innovadores
Usa Markdown elegante con Tablas, Listas y Negritas.`
    } else if (type === 'workshop') {
      systemPrompt = `Eres un Mentor IA especialista en TALLERES PRÁCTICOS.
Materia: ${subject}. Grado: ${grade}.
Crea un TALLER con:
- Marco Teórico resumido
- 5-10 Ejercicios Prácticos de dificultad progresiva
- Un Reto Creativo final
- Criterios de Evaluación claros
Usa Markdown elegante.`
    } else {
      systemPrompt = `Eres un Mentor IA experto en EVALUACIÓN.
Materia: ${subject}. Grado: ${grade}.
Crea un EXAMEN que incluya:
- Selección Múltiple (5-10 preguntas)
- Preguntas Abiertas de razonamiento (3-5)
- LLAVE DE RESPUESTAS detallada al final
Usa Markdown elegante.`
    }

    // Usar Gemini 3 Flash (2026) como modelo principal
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.95,
      }
    })

    const result = await model.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
    const responseText = result.response.text()

    return new Response(
      JSON.stringify({ text: responseText, model_used: 'gemini-3-flash' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error in generate-lessons:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
