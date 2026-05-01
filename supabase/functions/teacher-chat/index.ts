import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.14.1"

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
      return new Response(JSON.stringify({ error: 'Falta la API Key en Supabase Secrets.' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    
    // Lista de modelos a intentar por orden de preferencia
    const modelsToTry = ['gemini-1.5-flash', 'gemini-pro']
    let lastError = null
    let text = ''

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: 'Eres MentorIA, asistente pedagógico experto.' }] },
            ... (chatHistory || []).map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: message }] }
          ]
        })
        text = result.response.text()
        if (text) break // Si obtuvimos respuesta, salimos del bucle
      } catch (err) {
        lastError = err
        console.error(`Fallo con modelo ${modelName}:`, err.message)
        continue // Intentamos con el siguiente modelo
      }
    }

    if (!text && lastError) {
      throw lastError
    }

    return new Response(JSON.stringify({ reply: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error final en la función:', error.message)
    return new Response(
      JSON.stringify({ 
        error: "Error en la IA", 
        message: error.message,
        suggestion: "Verifica tu API Key en AI Studio o la cuota de uso."
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
