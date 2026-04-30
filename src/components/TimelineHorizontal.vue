<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

defineProps({
  copy: { type: Object, required: true },
  items: { type: Array, required: true },
})

const sectionRef = ref(null)
const viewportRef = ref(null)
const stripRef = ref(null)
const progressRef = ref(null)

let mm = null
let horizTween = null

function buildHorizontal() {
  const section = sectionRef.value
  const viewport = viewportRef.value
  const strip = stripRef.value
  const progress = progressRef.value
  if (!section || !viewport || !strip) return

  const scrollLength = Math.max(0, strip.scrollWidth - viewport.offsetWidth)
  if (scrollLength <= 0) return

  horizTween?.scrollTrigger?.kill()
  horizTween?.kill()

  gsap.set(strip, { x: 0 })
  if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' })

  horizTween = gsap.to(strip, {
    x: -scrollLength,
    ease: 'none',
    force3D: true,
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${scrollLength + window.innerHeight * 0.3}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (progress) gsap.set(progress, { scaleX: self.progress })
      },
    },
  })
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  mm = gsap.matchMedia()
  mm.add('(min-width: 981px)', () => {
    buildHorizontal()
    ScrollTrigger.addEventListener('refreshInit', buildHorizontal)
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', buildHorizontal)
      horizTween?.scrollTrigger?.kill()
      horizTween?.kill()
    }
  })
})

onUnmounted(() => {
  ScrollTrigger.removeEventListener('refreshInit', buildHorizontal)
  horizTween?.scrollTrigger?.kill()
  horizTween?.kill()
  mm?.revert()
})
</script>

<template>
  <section id="path" ref="sectionRef" class="timeline-horizontal-section">
    <div class="timeline-horizontal-intro">
      <p class="eyebrow">{{ copy.labels.background }}</p>
      <h2>{{ copy.timeline.title }}</h2>
      <div class="timeline-progress-track">
        <span ref="progressRef" class="timeline-progress-bar" />
      </div>
    </div>

    <div ref="viewportRef" class="timeline-horizontal-viewport">
      <div ref="stripRef" class="timeline-horizontal-strip">
        <article
          v-for="(item, idx) in items"
          :key="item.key"
          class="timeline-h-card"
          :class="{ accent: idx % 2 === 0 }"
        >
          <div class="timeline-h-card-top">
            <span class="timeline-h-period">{{ item.period }}</span>
            <span class="timeline-h-index">0{{ idx + 1 }}</span>
          </div>
          <div class="timeline-h-card-body">
            <h3>{{ copy.timeline[item.key].title }}</h3>
            <p>{{ copy.timeline[item.key].body }}</p>
          </div>
          <div class="timeline-h-card-foot">
            <span class="timeline-h-tag">{{ copy.labels.background }}</span>
          </div>
        </article>
        <div class="timeline-h-spacer" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>
