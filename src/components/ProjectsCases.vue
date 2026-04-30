<script setup>
defineProps({
  copy: { type: Object, required: true },
  projects: { type: Array, required: true },
})
</script>

<template>
  <section id="projects" class="content-section">
    <span class="staged-bg-text" aria-hidden="true">WORK</span>
    <div class="section-heading" data-reveal>
      <p class="eyebrow">{{ copy.labels.selectedWork }}</p>
      <h2>{{ copy.nav.projects }}</h2>
    </div>

    <div class="case-grid">
      <article v-for="project in projects" :key="project.key" class="case-card" data-reveal>
        <div class="case-media">
          <img
            :src="project.image"
            :alt="copy.cases[project.key].title"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="case-body">
          <div class="case-title-row">
            <h3>{{ copy.cases[project.key].title }}</h3>
            <div class="case-tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>

          <dl class="case-points">
            <div>
              <dt>{{ copy.highlights.problem }}</dt>
              <dd>{{ copy.cases[project.key].problem }}</dd>
            </div>
            <div>
              <dt>{{ copy.highlights.solution }}</dt>
              <dd>{{ copy.cases[project.key].solution }}</dd>
            </div>
            <div>
              <dt>{{ copy.highlights.result }}</dt>
              <dd>{{ copy.cases[project.key].result }}</dd>
            </div>
          </dl>

          <div class="card-actions">
            <a :href="project.repo" target="_blank" rel="noreferrer">{{ copy.highlights.repo }}</a>
            <a v-if="project.live" :href="project.live" target="_blank" rel="noreferrer">
              {{ copy.highlights.live }}
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
