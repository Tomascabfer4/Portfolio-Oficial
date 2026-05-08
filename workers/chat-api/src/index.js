const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init.headers || {}),
    },
    status: init.status || 200,
  })
}

function buildSystemPrompt(context, locale) {
  const languageRule =
    locale === 'en'
      ? 'Answer in English unless the user clearly speaks Spanish.'
      : 'Responde en espanol salvo que el usuario escriba claramente en ingles.'

  return [
    'You are the portfolio assistant for Tomas Cabello, also branded as K1D T0M1.',
    languageRule,
    'Your job is to help visitors understand Tomas profile, his projects, whether he can help them, and what the next step should be.',
    'Be concise, practical, and honest. Never invent unavailable personal, pricing, or delivery details.',
    'If the user asks about the DJ side, mention that there is a separate DJ/producer site.',
    'When useful, suggest continuing on WhatsApp or email.',
    `Portfolio context: ${JSON.stringify(context)}`,
  ].join('\n')
}

function toGeminiContents(messages) {
  return messages
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim(),
    )
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content.trim() }],
    }))
}

function getGeminiReply(data) {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim() || ''
  )
}

async function callModel(env, body) {
  const baseUrl = env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'
  const model = env.GEMINI_MODEL || 'gemini-3-flash-preview'

  const response = await fetch(`${baseUrl}/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: body.systemPrompt }],
      },
      contents: toGeminiContents(body.messages),
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 700,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`provider_error:${response.status}:${errorText}`)
  }

  const data = await response.json()
  return getGeminiReply(data)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders, status: 204 })
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true })
    }

    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return json({ error: 'not_found' }, { status: 404 })
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: 'missing_api_key' }, { status: 500 })
    }

    try {
      const payload = await request.json()
      const locale = payload.locale === 'en' ? 'en' : 'es'
      const userMessages = Array.isArray(payload.messages) ? payload.messages : []
      const context = payload.context || {}

      const reply = await callModel(env, {
        systemPrompt: buildSystemPrompt(context, locale),
        messages: userMessages,
      })

      if (!reply) {
        return json({ error: 'empty_reply' }, { status: 502 })
      }

      return json({ reply })
    } catch (error) {
      return json(
        {
          error: 'chat_failed',
          detail: error instanceof Error ? error.message : 'unknown_error',
        },
        { status: 500 },
      )
    }
  },
}
