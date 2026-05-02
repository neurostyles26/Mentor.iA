// @ts-ignore: Deno namespace
const _Deno = (globalThis as any).Deno;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

_Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { prompt, grade = 'No especificado', subject = 'General', type = 'lesson', provider = 'gemini' } = await req.json().catch(() => ({}));
    
    const GEMINI_KEY = _Deno.env.get('GEMINI_API_KEY') || _Deno.env.get('GOOGLE_AI_KEY');
    const OPENROUTER_KEY = _Deno.env.get('OPENROUTER_API_KEY');

    let text = "";
    const systemPrompt = `Eres experto pedagógico. Materia: ${subject}. Grado: ${grade}. Tipo: ${type}. Genera contenido en Markdown.`;

    if (provider === 'openrouter' || provider === 'groq') {
      if (!OPENROUTER_KEY) {
        return new Response(JSON.stringify({ text: "⚠️ **Falta OPENROUTER_API_KEY.**" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'MentorIA'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Tema: ${prompt}` }
          ]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Error OpenRouter');
      text = data.choices?.[0]?.message?.content || "No respuesta";

    } else {
      if (!GEMINI_KEY) {
        return new Response(JSON.stringify({ text: "⚠️ **Falta GEMINI_API_KEY.**" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nTema: ${prompt}` }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Error Gemini');
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No respuesta";
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ text: `❌ **Error:** ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

export {};
