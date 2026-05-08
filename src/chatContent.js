export const chatContent = {
  es: {
    aiButton: 'Chat IA',
    whatsappButton: 'WhatsApp',
    modalTitle: 'Habla conmigo',
    modalSubtitle:
      'Puedo orientarte sobre proyectos, automatizacion, colaboraciones, portfolio o la parte creativa/DJ.',
    statusReady: 'IA disponible',
    statusOffline: 'Chat sin configurar',
    intro:
      'Hola. Soy el asistente del portfolio de Tomas. Cuéntame que necesitas y te ayudo a aterrizarlo.',
    placeholder: 'Escribe tu mensaje...',
    send: 'Enviar',
    sending: 'Pensando...',
    close: 'Cerrar',
    retry: 'Reintentar',
    emptyState:
      'Todavia no hay backend configurado para el chat. Puedes seguir por WhatsApp o por email.',
    error:
      'Ha habido un problema al hablar con la IA. Si quieres, puedes seguir por WhatsApp o email.',
    errors: {
      provider_auth_failed:
        'La IA no puede responder porque la clave de Gemini no esta bien configurada en el Worker.',
      provider_model_not_found:
        'El modelo de Gemini configurado no esta disponible para esta API key. Revisa GEMINI_MODEL en Cloudflare.',
      provider_rate_limited:
        'Gemini ha limitado temporalmente las peticiones. Prueba de nuevo en un momento o continua por WhatsApp.',
      bad_provider_request:
        'Gemini ha rechazado el formato de la peticion. Estoy revisando el contrato del chat.',
    },
    promptLabel: 'Ideas para empezar',
    prompts: [
      'Quiero una web profesional',
      'Quiero automatizar un proceso',
      'Que tipo de proyectos haces',
      'Quiero colaborar contigo',
      'Tambien quiero ver la parte DJ',
    ],
    ctaTitle: 'Continuamos por donde prefieras',
    ctaBody:
      'Si ya tienes claro lo que buscas, puedes seguir la conversacion por WhatsApp o enviarme un email.',
    ctaWhatsapp: 'Continuar por WhatsApp',
    ctaEmail: 'Enviar email',
    sourceTag: 'Portfolio',
  },
  en: {
    aiButton: 'AI Chat',
    whatsappButton: 'WhatsApp',
    modalTitle: 'Talk to me',
    modalSubtitle:
      'I can help with projects, automation, collaborations, portfolio questions, or the creative/DJ side.',
    statusReady: 'AI available',
    statusOffline: 'Chat not configured',
    intro:
      'Hi. I am Tomas portfolio assistant. Tell me what you need and I will help you shape it.',
    placeholder: 'Write your message...',
    send: 'Send',
    sending: 'Thinking...',
    close: 'Close',
    retry: 'Retry',
    emptyState:
      'The chat backend is not configured yet. You can still continue on WhatsApp or by email.',
    error:
      'There was a problem contacting the AI. You can still continue on WhatsApp or by email.',
    errors: {
      provider_auth_failed:
        'The AI cannot reply because the Gemini key is not configured correctly in the Worker.',
      provider_model_not_found:
        'The configured Gemini model is not available for this API key. Check GEMINI_MODEL in Cloudflare.',
      provider_rate_limited:
        'Gemini has temporarily rate-limited requests. Try again shortly or continue on WhatsApp.',
      bad_provider_request:
        'Gemini rejected the request format. I am checking the chat contract.',
    },
    promptLabel: 'Ways to start',
    prompts: [
      'I need a professional website',
      'I want to automate a process',
      'What kind of projects do you build',
      'I want to collaborate with you',
      'Show me the DJ side too',
    ],
    ctaTitle: 'Continue however you prefer',
    ctaBody:
      'If you already know what you need, continue the conversation on WhatsApp or send me an email.',
    ctaWhatsapp: 'Continue on WhatsApp',
    ctaEmail: 'Send email',
    sourceTag: 'Portfolio',
  },
}
