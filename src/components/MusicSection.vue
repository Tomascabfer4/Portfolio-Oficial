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
    <a class="button ghost" :href="copy.music.url" target="_blank" rel="noreferrer">
      {{ copy.music.cta }}
    </a>
  </section>
</template>

