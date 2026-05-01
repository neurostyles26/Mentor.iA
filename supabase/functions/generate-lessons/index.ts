import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.14.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { prompt, grade = 'No especificado', subject = 'General', type = 'lesson' } = await req.json().catch(() => ({}))
    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY en Supabase' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const modelsToTry = ['gemini-1.5-flash', 'gemini-pro']
    let lastError = null
    let text = ''

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const systemPrompt = `Eres un experto pedagógico. Materia: ${subject}. Grado: ${grade}. Tipo: ${type}.`
        const finalPrompt = `${systemPrompt}\n\nTema: ${prompt}`
        const result = await model.generateContent(finalPrompt)
        text = result.response.text()
        if (text) break
      } catch (err) {
        lastError = err
        continue
      }
    }

    if (!text && lastError) throw lastError

    return new Response(JSON.stringify({ text: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
