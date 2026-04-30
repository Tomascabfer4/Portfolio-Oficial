<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
})

const emit = defineEmits(['navigate', 'close'])

function handleKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div id="mobile-navigation" class="mobile-navigation">
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
