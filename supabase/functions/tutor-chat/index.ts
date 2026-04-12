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
    
    // Using Gemma 4 model
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemma-4-31b-it",
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

    console.log(`Asking tutor question: ${pregunta.substring(0, 50)}... using Gemma 4`)

    const result = await generativeModel.generateContent(finalPrompt)
    const res = await result.response
    const generatedText = res.text()

    if (!generatedText) {
      throw new Error('Gemma 4 no pudo generar una respuesta. Intenta reformular tu pregunta.')
    }

    return new Response(
      JSON.stringify({ text: generatedText }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in tutor-chat (Gemma 4):', error)
    
    const statusCode = error.message?.includes('404') || error.message?.includes('not found') ? 404 : 400

    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error desconocido en Tutor Chat',
        stack: error.stack
      }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: statusCode 
      }
    )
  }
})
