<script setup>
import { computed } from 'vue'

const props = defineProps({
  copy: { type: Object, required: true },
  language: { type: String, required: true },
  repositories: { type: Array, required: true },
  isLoading: { type: Boolean, required: true },
  isFallback: { type: Boolean, required: true },
  searchTerm: { type: String, required: true },
  activeLanguageFilter: { type: String, required: true },
})

const emit = defineEmits(['update:searchTerm', 'update:activeLanguageFilter'])

const languageOptions = computed(() => {
  const values = props.repositories
    .map((repo) => repo.language)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
  return ['All', ...new Set(values)]
})

const filteredRepositories = computed(() => {
  const query = props.searchTerm.trim().toLowerCase()
  return props.repositories
    .filter((repo) => !repo.fork)
    .filter((repo) => {
      const matchesLanguage =
        props.activeLanguageFilter === 'All' || repo.language === props.activeLanguageFilter
      const searchable =
        `${repo.name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase()
      return matchesLanguage && (!query || searchable.includes(query))
    })
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
})

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(props.language === 'es' ? 'es-ES' : 'en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

defineExpose({ filteredRepositories })
</script>

<template>
  <section id="repos" class="content-section repo-section">
    <span class="staged-bg-text" aria-hidden="true">REPOS</span>
    <div class="section-heading split" data-reveal>
      <div>
        <p class="eyebrow">GitHub</p>
        <h2>{{ copy.repos.title }}</h2>
        <p>{{ copy.repos.intro }}</p>
      </div>
      <div class="repo-count">
        <strong>{{ filteredRepositories.length }}</strong>
        <span>{{ copy.repos.count }}</span>
      </div>
    </div>

    <div class="repo-toolbar">
      <input
        :value="searchTerm"
        type="search"
        :placeholder="copy.repos.search"
        @input="emit('update:searchTerm', $event.target.value)"
      />
      <div class="filter-row" aria-label="Repository language filters">
        <button
          v-for="option in languageOptions"
          :key="option"
          type="button"
          :class="{ active: activeLanguageFilter === option }"
          :aria-pressed="activeLanguageFilter === option"
          @click="emit('update:activeLanguageFilter', option)"
        >
          {{ option === 'All' ? copy.repos.all : option }}
        </button>
      </div>
    </div>

    <p v-if="isFallback" class="inline-note">{{ copy.repos.fallback }}</p>
    <p v-if="isLoading" class="inline-note">{{ copy.labels.loading }}</p>

    <div class="repo-grid">
      <article v-for="repo in filteredRepositories" :key="repo.html_url" class="repo-card" data-reveal>
        <div class="repo-card-header">
          <h3>{{ repo.name }}</h3>
          <span v-if="repo.language">{{ repo.language }}</span>
        </div>
        <p>{{ repo.description || copy.labels.noDescription }}</p>
        <div class="repo-meta">
          <small>{{ copy.repos.updated }} {{ formatDate(repo.pushed_at) }}</small>
          <div>
            <a v-if="repo.homepage" :href="repo.homepage" target="_blank" rel="noreferrer">
              {{ copy.repos.sourceLive }}
            </a>
            <a :href="repo.html_url" target="_blank" rel="noreferrer">{{ copy.repos.sourceRepo }}</a>
          </div>
        </div>
      </article>
    </div>

    <p v-if="!filteredRepositories.length" class="empty-state">{{ copy.repos.empty }}</p>
  </section>
</template>
