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

    const systemPrompt = "Eres MentorIA, el asistente pedagógico más avanzado de Colombia. Responde siempre en Markdown elegante.";

    if (provider === 'openrouter' || provider === 'groq') {
      if (!OPENROUTER_KEY) throw new Error("Falta OPENROUTER_API_KEY.");

      const models = ['meta-llama/llama-3.1-8b-instruct:free', 'google/gemma-2-9b-it:free', 'mistralai/mistral-7b-instruct:free'];
      for (const model of models) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'system', content: systemPrompt }, ...(chatHistory || []).map((m: any) => ({ role: m.role, content: m.content })), { role: 'user', content: message || "Hola" }]
            })
          });
          const data = await response.json();
          if (data.choices?.[0]?.message?.content) return new Response(JSON.stringify({ reply: data.choices[0].message.content }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) { continue; }
      }
      throw new Error("OpenRouter no respondió.");
    } else {
      if (!GEMINI_KEY) throw new Error("Falta GEMINI_API_KEY.");
      const geminiModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      for (const model of geminiModels) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'Entendido.' }] }, ...(chatHistory || []).filter((m: any) => m.content).map((m: any) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: message || "Hola" }] }] })
          });
          const data = await response.json();
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) return new Response(JSON.stringify({ reply: data.candidates[0].content.parts[0].text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) { continue; }
      }
      throw new Error("Gemini no respondió.");
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ reply: `❌ **Error:** ${error.message}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

export {};
