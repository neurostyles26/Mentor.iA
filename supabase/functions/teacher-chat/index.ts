// @ts-nocheck
import { GoogleGenerativeAI } from "googlegenai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: string;
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { message, chatHistory } = body

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'El mensaje es requerido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API Key no configurada en Supabase Secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const PRIMARY_MODEL = "gemma-4-31b-it"
    const FALLBACK_MODEL = "gemini-1.5-flash"

    const systemPrompt = `Eres MentorIA, el asistente de inteligencia pedagógica más avanzado, especializado en el ecosistema educativo de Colombia.

Tu misión es asistir a docentes en:
1. Co-diseño curricular alineado con los DBA.
2. Creación de experiencias de aprendizaje innovadoras (Gamificación, CBL).
3. Diagnóstico pedagógico y remediación personalizada.

Siempre responde en español colombiano. Usa Markdown elegante con Tablas, Listas y Negritas.`

    const history = (chatHistory || []).map((m: Message) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    let reply = '';
    let modelUsed = 'primary';

    try {
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL })
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: "Entendido. Soy MentorIA, tu colaborador estratégico en innovación educativa para Colombia. ¿En qué trabajaremos hoy?" }] },
          ...history
        ]
      })
      const result = await chat.sendMessage(message)
      reply = result.response.text()
    } catch (primaryError) {
      console.warn('Primary model failed, using fallback:', primaryError)
      modelUsed = 'fallback'
      try {
        const model = genAI.getGenerativeModel({ model: FALLBACK_MODEL })
        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: "Entendido. Soy MentorIA (Motor de Respaldo). ¿En qué te puedo apoyar?" }] },
            ...history
          ]
        })
        const result = await chat.sendMessage(message)
        reply = result.response.text()
      } catch (fallbackError) {
        throw new Error(`Ambos modelos fallaron. Error: ${fallbackError}`)
      }
    }

    return new Response(
      JSON.stringify({ reply, model_used: modelUsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
