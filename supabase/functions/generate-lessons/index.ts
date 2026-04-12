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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!GEMINI_API_KEY) {
      throw new Error('CONFIG_ERROR: No se encontró la API Key. Por favor, configura GEMINI_API_KEY en los secretos de Supabase.')
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
    
    // Using Gemma 4 model
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemma-4-31b-it",
      generationConfig: { 
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    })

    const result = await generativeModel.generateContent(`${systemPrompt}\n\nTema a desarrollar: ${prompt}`)
    const res = await result.response
    const generatedText = res.text()

    return new Response(
      JSON.stringify({ text: generatedText }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in generate-lessons (Gemma 4):', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
