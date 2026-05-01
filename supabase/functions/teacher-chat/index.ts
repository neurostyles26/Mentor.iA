const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { message, chatHistory } = await req.json().catch(() => ({}))
    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'Falta la API Key en Supabase' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const systemPrompt = "Eres MentorIA, el asistente pedagógico más avanzado de Colombia. Responde siempre en Markdown elegante."
    
    const history = (chatHistory || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido. Soy MentorIA.' }] },
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ]

    // LLAMADA DIRECTA A LA API DE GOOGLE (Sin librerías, nivel gratuito)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || 'Error en la API de Google')
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta."

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
