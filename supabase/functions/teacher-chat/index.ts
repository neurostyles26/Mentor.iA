// @ts-ignore
import { GoogleGenerativeAI } from "googlegenai"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: string;
  content: string;
}

serve(async (req: Request) => {
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

    // Support multiple possible secret names
    // @ts-ignore: Deno is available at runtime in Supabase Edge Functions
    const API_KEY = Deno.env.get('GEMMA_API_KEY') || Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!API_KEY) {
      throw new Error('CONFIG_ERROR: Gemma API Key not found in Supabase secrets.')
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    
    // Using Gemma 4 model (31B is high-performance MoE)
    const model = genAI.getGenerativeModel({ 
      model: "gemma-4-31b-it",
      generationConfig: { 
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })

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

    // Format chat history for Google AI SDK
    const history = (chatHistory || []).map((m: Message) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Entendido. Soy MentorIA, tu asistente experto para la educación en Colombia. ¿En qué puedo ayudarte hoy?" }] },
        ...history
      ]
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const reply = response.text()

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
