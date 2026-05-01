import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.14.1"

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
    const { message, chatHistory } = body

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Mensaje requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Configuración pendiente: Falta GEMINI_API_KEY en Supabase' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const history = (chatHistory || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: 'Eres MentorIA, asistente pedagógico avanzado.' }] },
        { role: 'model', parts: [{ text: 'Entendido.' }] },
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ]
    })

    const text = result.response.text()

    return new Response(
      JSON.stringify({ reply: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
