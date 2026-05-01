// @ts-nocheck
import { GoogleGenerativeAI } from "googlegenai"

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
        JSON.stringify({ error: 'El mensaje es requerido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')
    if (!API_KEY) {
      console.error('API Key missing in environment')
      return new Response(
        JSON.stringify({ error: 'API Key no configurada. Ejecuta: supabase secrets set GEMINI_API_KEY=tu_llave' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `Eres MentorIA, el asistente de inteligencia pedagógica más avanzado, especializado en el ecosistema educativo de Colombia.

Tu misión es asistir a docentes en:
1. Co-diseño curricular alineado con los Derechos Básicos de Aprendizaje (DBA).
2. Creación de experiencias de aprendizaje innovadoras (Gamificación, CBL, Pensamiento Crítico).
3. Diagnóstico pedagógico y remediación personalizada.
4. Secuencias didácticas (Inicio, Desarrollo, Cierre) con rúbricas.

Reglas:
- Tono profesional, inspirador y empático.
- Español colombiano fluido y claro.
- Siempre usa Markdown elegante con Tablas, Listas y Negritas.`

    const history = (chatHistory || []).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido. Soy MentorIA, tu colaborador estratégico en innovación educativa para Colombia. ¿En qué desafío pedagógico trabajaremos hoy?' }] },
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ]

    const result = await model.generateContent({ contents })
    const response = await result.response
    
    if (response.promptFeedback?.blockReason) {
      throw new Error(`Contenido bloqueado: ${response.promptFeedback.blockReason}`)
    }

    const text = response.text()

    return new Response(
      JSON.stringify({ reply: text, model_used: 'gemini-1.5-flash' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor',
        details: error.toString() 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
