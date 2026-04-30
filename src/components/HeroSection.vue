<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps({
  copy: { type: Object, required: true },
  featuredReposCount: { type: Number, required: true },
})

const emit = defineEmits(['navigate'])

const sectionRef = ref(null)
const titleRef = ref(null)
const panelRef = ref(null)

let parallaxTriggers = []

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !sectionRef.value) return

  if (panelRef.value) {
    const tween = gsap.to(panelRef.value, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
    parallaxTriggers.push(tween)
  }

  if (titleRef.value) {
    const tween = gsap.to(titleRef.value, {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
    parallaxTriggers.push(tween)
  }
})

onUnmounted(() => {
  parallaxTriggers.forEach((tween) => {
    tween.scrollTrigger?.kill()
    tween.kill()
  })
  parallaxTriggers = []
})

defineExpose({ sectionRef })
</script>

<template>
  <section ref="sectionRef" class="hero-section section-grid">
    <div class="hero-copy">
      <p class="eyebrow">{{ copy.hero.eyebrow }}</p>
      <h1 ref="titleRef">{{ copy.hero.title }}</h1>
      <p class="identity">{{ copy.hero.name }} · {{ copy.hero.role }}</p>
      <p class="hero-summary">{{ copy.hero.summary }}</p>

      <div class="hero-actions">
        <a
          class="button primary"
          href="#projects"
          @click="emit('navigate', { event: $event, href: '#projects', index: 0 })"
        >
          {{ copy.hero.primaryCta }}
        </a>
        <a class="button ghost" href="https://github.com/Tomascabfer4" target="_blank" rel="noreferrer">
          {{ copy.hero.secondaryCta }}
        </a>
      </div>
    </div>

    <aside ref="panelRef" class="status-panel" aria-label="Profile summary">
      <div class="portrait-wrap">
        <img
          src="/portfolio-assets/Tomas.png"
          alt="Tomás Cabello"
          width="360"
          height="360"
          loading="eager"
          decoding="async"
        />
      </div>
      <div class="metric-grid">
        <div>
          <strong>{{ featuredReposCount }}</strong>
          <span>{{ copy.hero.metricRepos }}</span>
        </div>
        <div>
          <strong>8+</strong>
          <span>{{ copy.hero.metricStacks }}</span>
        </div>
        <div>
          <strong>10+</strong>
          <span>{{ copy.hero.metricDeploys }}</span>
        </div>
      </div>
    </aside>
  </section>
</template>
