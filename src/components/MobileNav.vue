<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
  language: { type: String, required: true },
})

const emit = defineEmits(['navigate', 'close', 'set-language'])

function handleKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div id="mobile-navigation" class="mobile-navigation">
    <div class="mobile-navigation-head">
      <p>{{ language === 'es' ? 'Idioma' : 'Language' }}</p>
      <div class="mobile-language-switcher" aria-label="Language selector">
        <button
          type="button"
          :class="{ active: language === 'es' }"
          :aria-pressed="language === 'es'"
          @click="emit('set-language', 'es')"
        >
          ES
        </button>
        <button
          type="button"
          :class="{ active: language === 'en' }"
          :aria-pressed="language === 'en'"
          @click="emit('set-language', 'en')"
        >
          EN
        </button>
      </div>
    </div>

    <a
      v-for="(item, index) in items"
      :key="item.href"
      :href="item.href"
      :class="{ active: activeIndex === index }"
      @click="emit('navigate', { event: $event, href: item.href, index })"
    >
      <span>{{ item.label }}</span>
      <i v-if="activeIndex === index" />
    </a>
  </div>
</template>
