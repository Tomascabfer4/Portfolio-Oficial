<script setup>
defineProps({
  copy: { type: Object, required: true },
})
</script>

<template>
  <section class="music-section" data-reveal>
    <div>
      <p class="eyebrow">{{ copy.labels.creativeSide }}</p>
      <h2>{{ copy.music.title }}</h2>
      <p>{{ copy.music.body }}</p>
    </div>
    <button type="button" class="button ghost disabled-link" disabled aria-disabled="true">
      {{ copy.music.cta }}
    </button>
  </section>
</template>
