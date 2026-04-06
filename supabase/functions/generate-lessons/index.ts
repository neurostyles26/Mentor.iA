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

    // --- Gemini Only (100% Free & Powerful) ---
    // @ts-ignore
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('MentoriA2')

    if (!GEMINI_API_KEY) {
      throw new Error('DIAGNOSTICO: No se encontró la llave GEMINI_API_KEY en los secretos de Supabase.')
    }

    let systemPrompt = ''
    if (type === 'lesson') {
      systemPrompt = `Eres un Mentor IA experto en diseño curricular. 
Materia: ${subject}. Grado: ${grade}. 
Diseña una LECCIÓN profesional con Objetivos, Contenido Base (con ejemplos), Actividades Rápidas y Consejos Pedagógicos.`
    } else if (type === 'workshop') {
      systemPrompt = `Eres un Mentor IA especialista en TALLERES PRÁCTICOS. 
Materia: ${subject}. Grado: ${grade}. 
Crea un TALLER con Marco Teórico (Resumen), 5-10 Ejercicios Prácticos, un Reto Creativo y Criterios de Evaluación.`
    } else if (type === 'exam') {
      systemPrompt = `Eres un Mentor IA experto en EVALUACIÓN. 
Materia: ${subject}. Grado: ${grade}. 
Crea un EXAMEN con Selección Múltiple, Preguntas Abiertas y una LLAVE DE RESPUESTAS al final.`
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.7 }
    })

    const result = await generativeModel.generateContent(`${systemPrompt}\n\nTema: ${prompt}`)
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
    console.error('Error in generate-lessons:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
