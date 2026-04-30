<script setup>
defineProps({
  copy: { type: Object, required: true },
  groups: { type: Array, required: true },
})
</script>

<template>
  <section id="skills" class="content-section skill-section">
    <span class="staged-bg-text" aria-hidden="true">STACK</span>
    <div class="section-heading" data-reveal>
      <p class="eyebrow">{{ copy.labels.capabilities }}</p>
      <h2>{{ copy.skills.title }}</h2>
      <p>{{ copy.skills.intro }}</p>
    </div>

    <div class="skill-grid">
      <article v-for="group in groups" :key="group.key" class="skill-card" data-reveal>
        <h3>{{ copy.skills[group.key] }}</h3>
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
