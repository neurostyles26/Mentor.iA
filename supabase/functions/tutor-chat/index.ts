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

    const finalPrompt = `Actúa como un Mentor Pedagógico experto en educación colombiana.
Contexto: ${contexto}
Pregunta: ${pregunta}

Instrucciones:
1. Proporciona una respuesta clara, profesional y motivadora.
2. Usa un lenguaje pedagógico moderno en español colombiano.
3. Si el usuario es un docente, ofrece consejos prácticos para el aula.
4. Mantén un tono empático y constructivo.
5. Usa Markdown para formatear tu respuesta (negritas, listas, tablas si aplica).`

    // Usar Gemini 3 Flash (2026) como modelo principal
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash",
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 2048,
      }
    })

    const result = await model.generateContent(finalPrompt)
    const responseText = result.response.text()

    return new Response(
      JSON.stringify({ text: responseText, model_used: 'gemini-3-flash' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error in tutor-chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
