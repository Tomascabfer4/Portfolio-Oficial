<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const numPoints = 10
const numPaths = 2
const delayPointsMax = 0.3
const delayPerPath = 0.25

const svgRef = ref(null)
const path0 = ref(null)
const path1 = ref(null)

let triggerInstance = null
let timeline = null

function buildInitialPath() {
  let d = `M 0 0 V 100 C`
  for (let j = 0; j < numPoints - 1; j++) {
    const p = ((j + 1) / (numPoints - 1)) * 100
    const cp = p - (1 / (numPoints - 1) * 100) / 2
    d += ` ${cp} 100 ${cp} 100 ${p} 100`
  }
  d += ` V 0 H 0`
  return d
}

const initialPath = buildInitialPath()

onMounted(() => {
  if (!svgRef.value || !svgRef.value.parentElement) return

  const paths = [path0.value, path1.value]
  const points = Array.from({ length: numPaths }, () =>
    Array.from({ length: numPoints }, () => ({ val: 100 })),
  )

  const render = () => {
    for (let i = 0; i < numPaths; i++) {
      const path = paths[i]
      if (!path) continue
      let d = `M 0 0 V ${points[i][0].val} C`
      for (let j = 0; j < numPoints - 1; j++) {
        const p = ((j + 1) / (numPoints - 1)) * 100
        const cp = p - (1 / (numPoints - 1) * 100) / 2
        d += ` ${cp} ${points[i][j].val} ${cp} ${points[i][j + 1].val} ${p} ${points[i][j + 1].val}`
      }
      d += ` V 0 H 0`
      path.setAttribute('d', d)
    }
  }

  timeline = gsap.timeline({
    onUpdate: render,
    scrollTrigger: {
      trigger: svgRef.value.parentElement,
      start: 'top bottom',
      end: 'top 0%',
      scrub: 1.1,
      invalidateOnRefresh: true,
      refreshPriority: -1,
    },
  })

  triggerInstance = timeline.scrollTrigger

  for (let i = 0; i < numPaths; i++) {
    const pathDelay = delayPerPath * i
    for (let j = 0; j < numPoints; j++) {
      const delay = Math.random() * delayPointsMax
      timeline.to(
        points[i][j],
        { val: 0, ease: 'power2.inOut', duration: 0.9 },
        delay + pathDelay,
      )
    }
  }
})

onUnmounted(() => {
  triggerInstance?.kill()
  timeline?.kill()
})
</script>

<template>
  <svg
    ref="svgRef"
    class="shape-overlays"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="shape-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0c" />
        <stop offset="20%" stop-color="#16080a" />
        <stop offset="55%" stop-color="#7a1f1c" />
        <stop offset="100%" stop-color="#ff5448" />
      </linearGradient>
      <linearGradient id="shape-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0a0a0c" />
        <stop offset="20%" stop-color="#1a0d0d" />
        <stop offset="55%" stop-color="#a83b34" />
        <stop offset="100%" stop-color="#ff7a70" />
      </linearGradient>
    </defs>
    <path ref="path0" fill="url(#shape-gradient-2)" :d="initialPath" />
    <path ref="path1" fill="url(#shape-gradient-1)" :d="initialPath" />
  </svg>
</template>

<style scoped>
.shape-overlays {
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
