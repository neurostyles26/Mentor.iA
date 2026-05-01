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
    const { prompt, grade = 'No especificado', subject = 'General', type = 'lesson' } = body

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'El tema es requerido.' }),
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

    const systemPrompt = `Eres un experto pedagógico. Materia: ${subject}. Grado: ${grade}. Tipo: ${type}.`
    const finalPrompt = `${systemPrompt}\n\nTema: ${prompt}`

    const result = await model.generateContent(finalPrompt)
    const text = result.response.text()

    return new Response(
      JSON.stringify({ text: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
