const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt, grade = 'No especificado', subject = 'General', type = 'lesson', provider = 'gemini' } = await req.json().catch(() => ({}))
    
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY')

    let text = ""
    const systemPrompt = `Eres experto pedagógico. Materia: ${subject}. Grado: ${grade}. Tipo: ${type}. Genera contenido estructurado en Markdown.`

    if (provider === 'openrouter' || provider === 'groq') {
      if (!OPENROUTER_KEY) {
        return new Response(JSON.stringify({ text: "⚠️ **Falta OPENROUTER_API_KEY.** Agrégala en Supabase." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
        })
      }
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'MentorIA'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Tema: ${prompt}` }
          ]
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(`OpenRouter Error: ${data.error.message || JSON.stringify(data.error)}`)
      text = data.choices?.[0]?.message?.content || "No respuesta"

    } else {
      if (!GEMINI_KEY) {
        return new Response(JSON.stringify({ text: "⚠️ **Falta GEMINI_API_KEY.** Usa OpenRouter o configura la llave." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
        })
      }
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nTema: ${prompt}` }] }] 
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No respuesta"
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
