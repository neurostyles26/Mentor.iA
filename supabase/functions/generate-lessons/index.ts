import { GoogleGenerativeAI } from "googlegenai"

const genCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  prompt: string;
  model?: 'gemini' | 'openai';
  grade?: string;
  subject?: string;
  type?: 'lesson' | 'workshop' | 'exam';
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: genCorsHeaders })
  }

  try {
    const body: RequestBody = await req.json().catch(() => ({}))
    const { 
      prompt, 
      model = 'gemini', 
      grade = 'Nivel inicial', 
      subject = 'General',
      type = 'lesson' 
    } = body

    if (!prompt) {
      throw new Error('El tema a desarrollar es requerido.')
    }

    // --- Diagnostic Stage ---
    // @ts-ignore
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('MentoriA2')
    // @ts-ignore
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('Mentoria')

    if (model === 'gemini' && !GEMINI_API_KEY) {
      throw new Error('DIAGNOSTICO: No se encontró la llave GEMINI_API_KEY en los secretos de Supabase.')
    }
    if (model === 'openai' && !OPENAI_API_KEY) {
      throw new Error('DIAGNOSTICO: No se encontró la llave OPENAI_API_KEY en los secretos de Supabase.')
    }

    let systemPrompt = ''
    
    if (type === 'lesson') {
      systemPrompt = `Eres un Mentor IA experto en diseño curricular. 
Tu misión es diseñar una LECCIÓN profesional para la materia ${subject}, dirigida a alumnos de ${grade}.

Estructura (Markdown):
# Título: [Nombre creativo]
## 🎯 Objetivos
- [Objetivos claros]
## 📚 Contenido Base
[Desarrollo pedagógico con ejemplos y analogías]
## ✍️ Actividades Rápidas
[Ejercicios simples para clase]
## 💡 Consejo Pedagógico
[Tips para el docente]`
    } else if (type === 'workshop') {
      systemPrompt = `Eres un Mentor IA especializado en diseño de TALLERES PRÁCTICOS.
Crea un TALLER dinámico de la materia ${subject} para el grado ${grade}.

Estructura (Markdown):
# Taller de Aplicación: [Tema]
## 🔍 Marco Teórico (Resumen)
[Breve repaso de conceptos clave]
## 🛠️ Ejercicios Prácticos
[Lista de 5-10 ejercicios prácticos, problemas o retos paso a paso]
## 🧩 Reto Creativo
[Un proyecto o actividad grupal para aplicar lo aprendido]
## 📏 Criterios de Evaluación
[Cómo calificar este taller]`
    } else if (type === 'exam') {
      systemPrompt = `Eres un Mentor IA experto en EVALUACIÓN EDUCATIVA.
Crea un EXAMEN profesional de la materia ${subject} para el grado ${grade}.

Estructura (Markdown):
# Examen de Período: [Tema]
## 📎 Datos Identificativos
[Espacio para nombre, fecha, grado]
## 📝 Sección 1: Selección Múltiple (4-5 preguntas)
[Preguntas con opciones A, B, C, D]
## 🖋️ Sección 2: Preguntas Abiertas (2-3 preguntas)
[Preguntas de desarrollo o análisis]
## 🔑 LLAVE DE RESPUESTAS (Final)
[Incluye la solución correcta de todas las preguntas para el docente]`
    }

    let generatedText = ''

    if (model === 'gemini') {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const generativeModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { temperature: 0.7 }
      })

      const result = await generativeModel.generateContent(`${systemPrompt}\n\nTema: ${prompt}`)
      const res = await result.response
      generatedText = res.text()
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Tema: ${prompt}` }
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
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: any) {
    console.error('Error in generate-lessons:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { 
        headers: { ...genCorsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
