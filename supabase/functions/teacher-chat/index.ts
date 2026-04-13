import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMMA_API_KEY = Deno.env.get('GEMMA_API_KEY')
const GEMMA_API_URL = Deno.env.get('GEMMA_API_URL') || 'https://api.google.com/v1/gemma/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, chatHistory } = await req.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = `
      Eres un asistente de IA experto diseñado específicamente para docentes en Colombia. 
      Tu objetivo es ayudar a los profesores a:
      1. Generar actividades pedagógicas alineadas con los Derechos Básicos de Aprendizaje (DBA).
      2. Crear exámenes y planes de clase creativos y efectivos.
      3. Responder dudas pedagógicas con un tono profesional, amable y motivador.
      
      Reglas:
      - Usa un lenguaje claro y adaptado al contexto educativo colombiano.
      - Si el docente pide una actividad, estructúrala con: Título, Objetivo, Materiales, Inicio, Desarrollo y Cierre.
      - Si pide un examen, incluye al menos 5 preguntas de opción múltiple con justificación.
      - Sé conciso pero exhaustivo en la calidad pedagógica.
    `

    // Mock/Generic call using fetch to the provider
    // In a real scenario, this would be an OpenAI-compatible call or Google AI call
    const response = await fetch(GEMMA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gemma-4", // Assuming the model name
        messages: [
          { role: "system", content: systemPrompt },
          ...(chatHistory || []),
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error calling Gemma API')
    }

    // Adapt response based on the provider's structure
    // This assumes OpenAI-compatible response format
    const reply = data.choices?.[0]?.message?.content || data.reply || "Lo siento, no pude procesar tu solicitud."

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
