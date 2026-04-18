// @ts-nocheck
import { GoogleGenerativeAI } from "googlegenai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  pregunta: string;
  contexto?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}))
    const { pregunta, contexto = 'General' } = body

    if (!pregunta) {
      return new Response(
        JSON.stringify({ error: 'La pregunta es requerida.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API Key no configurada en Supabase Secrets.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const PRIMARY_MODEL = "gemma-4-31b-it"
    const FALLBACK_MODEL = "gemini-1.5-flash"

    const finalPrompt = `Actúa como un Mentor Pedagógico experto en educación colombiana.
Contexto: ${contexto}
Pregunta: ${pregunta}

Instrucciones:
1. Proporciona una respuesta clara, profesional y motivadora.
2. Usa un lenguaje pedagógico moderno.
3. Si el usuario es un docente, ofrece consejos prácticos para el aula.
4. Mantén un tono empático y constructivo.
5. Usa Markdown para formatear tu respuesta.`

    let responseText = '';
    let modelUsed = 'primary';

    try {
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL })
      const result = await model.generateContent(finalPrompt)
      responseText = result.response.text()
    } catch (primaryError) {
      console.warn('Primary model failed, using fallback:', primaryError)
      modelUsed = 'fallback'
      try {
        const model = genAI.getGenerativeModel({ model: FALLBACK_MODEL })
        const result = await model.generateContent(finalPrompt)
        responseText = result.response.text()
      } catch (fallbackError) {
        throw new Error(`Ambos modelos fallaron. Último error: ${fallbackError}`)
      }
    }

    return new Response(
      JSON.stringify({ text: responseText, model_used: modelUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('Error in tutor-chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
