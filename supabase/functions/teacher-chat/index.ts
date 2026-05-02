const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { message, chatHistory, provider = 'gemini' } = await req.json().catch(() => ({}))
    
    // Configuración de Proveedores
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY')

    let reply = ""
    const systemPrompt = "Eres MentorIA, el asistente pedagógico más avanzado de Colombia. Responde siempre en Markdown elegante."

    if (provider === 'openrouter' || (provider === 'groq' && OPENROUTER_KEY)) {
      // --- LÓGICA DE OPENROUTER (Modelos Gratuitos) ---
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(chatHistory || []).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mentoria.vercel.app', // Opcional pero recomendado
          'X-Title': 'MentorIA'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(`OpenRouter Error: ${data.error.message || JSON.stringify(data.error)}`)
      reply = data.choices?.[0]?.message?.content || "Lo siento, OpenRouter no pudo responder."

    } else {
      // --- LÓGICA DE GEMINI (Por defecto) ---
      if (!GEMINI_KEY) throw new Error('Falta la API Key de Gemini en Supabase')
      
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

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message || 'Error en Gemini')
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, Gemini no pudo responder."
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
