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
      console.error('API Key missing in environment')
      return new Response(
        JSON.stringify({ error: 'API Key no configurada. Ejecuta: supabase secrets set GEMINI_API_KEY=tu_llave' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `${contexto}

Pregunta del docente: ${pregunta}

IMPORTANTE: Responde de forma directa y concisa. Si el usuario pide algo "corto" o "breve", limítate a 2-3 párrafos máximo. No agregues secciones extras que no se pidieron. Usa español colombiano y Markdown para formatear.`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const response = await result.response
    
    if (response.promptFeedback?.blockReason) {
      throw new Error(`Contenido bloqueado: ${response.promptFeedback.blockReason}`)
    }

    const text = response.text()

    return new Response(
      JSON.stringify({ text: text, model_used: 'gemini-1.5-flash' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error in tutor-chat:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: error.toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
