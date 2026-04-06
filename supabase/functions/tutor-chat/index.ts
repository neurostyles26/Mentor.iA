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

    // --- Gemini Only (100% Free & Powerful) ---
    // @ts-ignore
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('MentoriA2')

    if (!GEMINI_API_KEY) {
      throw new Error('DIAGNOSTICO: No se encontró la llave GEMINI_API_KEY en los secretos de Supabase.')
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.7 }
    })

    const finalPrompt = `Actúa como un Mentor Pedagógico IA. 
Contexto: ${contexto}
Pregunta: ${pregunta}

Responde de forma clara, motivadora y pedagógica.`

    const result = await generativeModel.generateContent(finalPrompt)
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
    console.error('Error in tutor-chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
