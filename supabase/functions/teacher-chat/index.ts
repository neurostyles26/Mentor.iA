// @ts-ignore
import { GoogleGenerativeAI } from "googlegenai"
// @ts-ignore
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
    // @ts-ignore
    const API_KEY = Deno.env.get('GEMMA_API_KEY') || Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_AI_KEY')

    if (!API_KEY) {
      throw new Error('CONFIG_ERROR: Gemma API Key not found in Supabase secrets.')
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    
    // Using Gemma 4 model (31B MoE Performance)
    const model = genAI.getGenerativeModel({ 
      model: "gemma-4-31b-it",
      generationConfig: { 
        temperature: 0.8,
        maxOutputTokens: 4096,
        topP: 0.95,
      }
    })

    const systemPrompt = `
      Eres MentorIA, el asistente de inteligencia pedagógica más avanzado del mundo, especializado en el ecosistema educativo de Colombia (Contexto 2026).
      
      Tu misión es asistir a docentes en:
      1. Co-diseño curricular híbrido (presencial y digital).
      2. Alineación profunda con los Derechos Básicos de Aprendizaje (DBA) actualizados y las mallas curriculares del Ministerio de Educación.
      3. Creación de experiencias de aprendizaje basadas en retos (CBL), Gamificación y Pensamiento Crítico.
      4. Diagnóstico pedagógico y sugerencias de remediación personalizada.

      Reglas de Voz y Tono:
      - Tono: Altamente profesional, inspirador, empático y técnico-pedagógico.
      - Lenguaje: Español de Colombia, fluido y claro.
      - Estructura: Siempre que generes actividades, usa Markdown elegante con Tablas, Listas y Negritas.
      - Prioridad: La innovación pedagógica sin perder de vista la viabilidad en el aula colombiana real.
      
      Si el docente te pide una actividad, debes incluir:
      - Desempeño esperado.
      - Metodología sugerida.
      - Secuencia didáctica (Inicio, Desarrollo, Cierre).
      - Rúbrica de evaluación simplificada.
    `

    // Format chat history for Google AI SDK
    const history = (chatHistory || []).map((m: Message) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Entendido. Soy MentorIA, tu colaborador estratégico en innovación educativa para Colombia. Estoy listo para transformar tus ideas en experiencias de aprendizaje excepcionales. ¿En qué desafío pedagógico trabajaremos hoy?" }] },
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
