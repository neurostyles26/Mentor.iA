// @ts-ignore: Deno namespace
const _Deno = (globalThis as any).Deno;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

_Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { message, chatHistory, provider = 'gemini' } = await req.json().catch(() => ({}));
    
    const GEMINI_KEY = _Deno.env.get('GEMINI_API_KEY') || _Deno.env.get('GOOGLE_AI_KEY');
    const OPENROUTER_KEY = _Deno.env.get('OPENROUTER_API_KEY');

    let reply = "";
    const systemPrompt = "Eres MentorIA, el asistente pedagógico más avanzado de Colombia. Responde siempre en Markdown elegante.";

    if (provider === 'openrouter' || provider === 'groq') {
      if (!OPENROUTER_KEY) {
        return new Response(JSON.stringify({ reply: "⚠️ **Configuración faltante:** No se encontró la `OPENROUTER_API_KEY` en Supabase." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...(chatHistory || []).map((m: any) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message || "Hola" }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'X-Title': 'MentorIA'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      reply = data.choices?.[0]?.message?.content || "Sin respuesta de OpenRouter";

    } else {
      if (!GEMINI_KEY) {
        return new Response(JSON.stringify({ reply: "⚠️ **Configuración faltante:** Falta la llave de Gemini." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const history = (chatHistory || [])
        .filter((m: any) => m.content && m.content.trim() !== "")
        .map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Soy MentorIA.' }] },
        ...history,
        { role: 'user', parts: [{ text: message || "Hola" }] }
      ];

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Error Gemini');
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini";
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      reply: `❌ **Error:** ${error.message}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

export {};
