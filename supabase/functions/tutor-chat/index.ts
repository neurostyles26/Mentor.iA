import { GoogleGenerativeAI } from "googlegenai"

const tutorCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TutorRequest {
  pregunta: string;
  contexto?: string;
  model?: 'gemini' | 'openai';
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: tutorCorsHeaders })
  }

  try {
    const body: TutorRequest = await req.json().catch(() => ({}))
    const { pregunta, contexto, model = 'gemini' } = body

    if (!pregunta) {
      throw new Error('La pregunta es requerida')
    }

    const systemPromptOrigin = `Eres un Mentor IA Tutor. Tu objetivo es explicar conceptos de forma clara, sencilla y pedagógica.
Explica paso a paso, usa ejemplos prácticos y adapta el lenguaje.
Contexto del curso: ${contexto || 'Sin contexto específico.'}`

    let generatedText = ''

    if (model === 'gemini') {
      // @ts-ignore
      const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('MentoriA2')
      if (!GEMINI_API_KEY) throw new Error('Gemini API Key no configurada.')

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const generativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { temperature: 0.7 }
      })

      const result = await generativeModel.generateContent(`${systemPromptOrigin}\n\nPregunta del alumno: ${pregunta}`)
      const res = await result.response
      generatedText = res.text()
    } else {
      // @ts-ignore
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('Mentoria')
      if (!OPENAI_API_KEY) throw new Error('OpenAI API Key no configurada.')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPromptOrigin },
            { role: 'user', content: pregunta }
          ],
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(`OpenAI Error: ${err}`)
      }

      const data = await response.json()
      generatedText = data.choices[0].message.content
    }

    return new Response(
      JSON.stringify({ text: generatedText }),
      { 
        headers: { ...tutorCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in tutor-chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { 
        headers: { ...tutorCorsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
