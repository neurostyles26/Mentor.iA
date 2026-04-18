// @ts-nocheck
import { GoogleGenAI } from "googlegenai"

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

    const ai = new GoogleGenAI({ apiKey: API_KEY })

    const prompt = `Actúa como un Mentor Pedagógico experto en educación colombiana.
Contexto: ${contexto}
Pregunta: ${pregunta}

Instrucciones:
1. Proporciona una respuesta clara, profesional y motivadora.
2. Usa un lenguaje pedagógico moderno en español colombiano.
3. Si el usuario es un docente, ofrece consejos prácticos para el aula.
4. Mantén un tono empático y constructivo.
5. Usa Markdown para formatear tu respuesta (negritas, listas, tablas si aplica).`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return new Response(
      JSON.stringify({ text: response.text, model_used: 'gemini-2.5-flash' }),
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
