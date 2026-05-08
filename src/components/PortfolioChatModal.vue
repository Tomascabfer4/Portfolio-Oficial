<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  copy: { type: Object, required: true },
  chatCopy: { type: Object, required: true },
  whatsAppUrl: { type: String, required: true },
  emailHref: { type: String, required: true },
  chatApiUrl: { type: String, default: '' },
  portfolioContext: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const composerRef = ref(null)

const chatAvailable = computed(() => Boolean(props.chatApiUrl))
const showLeadCtas = computed(() => messages.value.length > 1)
const whatsAppBaseUrl = computed(() => props.whatsAppUrl.split('?')[0] || props.whatsAppUrl)

function getChatErrorMessage(data) {
  return props.chatCopy.errors?.[data?.error] || props.chatCopy.error
}

function createAssistantMessage(content) {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: 'assistant',
    content,
  }
}

function createUserMessage(content) {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: 'user',
    content,
  }
}

function resetConversation() {
  messages.value = [createAssistantMessage(props.chatCopy.intro)]
  input.value = ''
  errorMessage.value = ''
  isLoading.value = false
}

function closeChat() {
  emit('close')
}

function handleKeydown(event) {
  if (event.key === 'Escape' && props.isOpen) {
    closeChat()
  }
}

function buildMailtoFromMessages() {
  const summary = messages.value
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => `- ${message.content}`)
    .join('\n')

  const subject = encodeURIComponent('Consulta desde mi portfolio')
  const body = encodeURIComponent(
    `Hola Tomas,\n\nVengo desde tu portfolio.\n\nResumen rapido de lo que necesito:\n${summary || '- Quiero hablar contigo'}\n\nGracias.`,
  )

  return `mailto:tomascabfer4@gmail.com?subject=${subject}&body=${body}`
}

function buildWhatsAppUrlFromMessages() {
  const summary = messages.value
    .filter((message) => message.role === 'user')
    .slice(-3)
    .map((message) => message.content)
    .join(' | ')

  const text = encodeURIComponent(
    summary
      ? `Hola Tomas, vengo de tu portfolio. Te escribo por esto: ${summary}`
      : 'Hola Tomas, vengo de tu portfolio y me gustaria hablar contigo.',
  )

  return `${whatsAppBaseUrl.value}?text=${text}`
}

async function sendMessage(nextMessage) {
  const trimmed = nextMessage.trim()
  if (!trimmed || isLoading.value) return

  const userMessage = createUserMessage(trimmed)
  messages.value = [...messages.value, userMessage]
  input.value = ''
  errorMessage.value = ''

  if (!chatAvailable.value) {
    messages.value = [...messages.value, createAssistantMessage(props.chatCopy.emptyState)]
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(props.chatApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'floating_button',
        locale: document.documentElement.lang || 'es',
        messages: messages.value.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        context: props.portfolioContext,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      throw new Error(getChatErrorMessage(data))
    }

    const data = await response.json()
    const assistantReply = (data.reply || '').trim()

    if (!assistantReply) {
      throw new Error('chat_empty_reply')
    }

    messages.value = [...messages.value, createAssistantMessage(assistantReply)]
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : props.chatCopy.error
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (nextOpen) => {
    if (nextOpen) {
      if (!messages.value.length) {
        resetConversation()
      }

      document.body.classList.add('chat-modal-open')
      setTimeout(() => composerRef.value?.focus(), 40)
    } else {
      document.body.classList.remove('chat-modal-open')
    }
  },
)

watch(
  () => props.chatCopy,
  () => {
    resetConversation()
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('chat-modal-open')
})
</script>

<template>
  <Transition name="chat-modal">
    <div v-if="isOpen" class="chat-modal-shell" role="dialog" aria-modal="true">
      <button class="chat-modal-backdrop" type="button" aria-label="Close" @click="closeChat" />

      <section class="chat-modal-panel">
        <header class="chat-modal-header">
          <div>
            <p class="eyebrow">{{ chatCopy.aiButton }}</p>
            <h2>{{ chatCopy.modalTitle }}</h2>
            <p>{{ chatCopy.modalSubtitle }}</p>
          </div>

          <div class="chat-modal-header-actions">
            <span :class="['chat-modal-status', chatAvailable ? 'ready' : 'offline']">
              {{ chatAvailable ? chatCopy.statusReady : chatCopy.statusOffline }}
            </span>
            <button type="button" class="chat-modal-close" :aria-label="chatCopy.close" @click="closeChat">
              <span />
              <span />
            </button>
          </div>
        </header>

        <div class="chat-modal-prompts">
          <span>{{ chatCopy.promptLabel }}</span>
          <div>
            <button
              v-for="prompt in chatCopy.prompts"
              :key="prompt"
              type="button"
              class="chat-prompt-chip"
              @click="sendMessage(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <div class="chat-modal-messages" data-lenis-prevent>
          <article
            v-for="message in messages"
            :key="message.id"
            :class="['chat-message', message.role]"
          >
            <span class="chat-message-role">
              {{ message.role === 'assistant' ? chatCopy.aiButton : chatCopy.sourceTag }}
            </span>
            <p>{{ message.content }}</p>
          </article>

          <article v-if="isLoading" class="chat-message assistant pending">
            <span class="chat-message-role">{{ chatCopy.aiButton }}</span>
            <p>{{ chatCopy.sending }}</p>
          </article>

          <article v-if="errorMessage" class="chat-inline-error">
            <p>{{ errorMessage }}</p>
            <button type="button" @click="sendMessage(input || chatCopy.prompts[0])">
              {{ chatCopy.retry }}
            </button>
          </article>

          <aside v-if="showLeadCtas" class="chat-modal-cta">
            <div>
              <h3>{{ chatCopy.ctaTitle }}</h3>
              <p>{{ chatCopy.ctaBody }}</p>
            </div>
            <div class="chat-modal-cta-actions">
              <a :href="buildWhatsAppUrlFromMessages()" target="_blank" rel="noreferrer">
                {{ chatCopy.ctaWhatsapp }}
              </a>
              <a :href="buildMailtoFromMessages()">
                {{ chatCopy.ctaEmail }}
              </a>
            </div>
          </aside>
        </div>

        <form
          class="chat-modal-composer"
          @submit.prevent="sendMessage(input)"
        >
          <textarea
            ref="composerRef"
            v-model="input"
            :placeholder="chatCopy.placeholder"
            rows="3"
          />
          <button type="submit" :disabled="isLoading || !input.trim()">
            {{ isLoading ? chatCopy.sending : chatCopy.send }}
          </button>
        </form>
      </section>
    </div>
  </Transition>
</template>
