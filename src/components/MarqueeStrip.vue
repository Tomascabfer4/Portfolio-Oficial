<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref(null)
const textRef = ref(null)
let mm = null

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || !sectionRef.value || !textRef.value) return

  mm = gsap.matchMedia()
  mm.add('(min-width: 981px)', () => {
    const tween = gsap.fromTo(
      textRef.value,
      { xPercent: 7 },
      {
        xPercent: -48,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      },
    )
    return () => tween.scrollTrigger?.kill()
  })
})

onUnmounted(() => {
  mm?.revert()
})
</script>

<template>
  <section ref="sectionRef" class="marquee-section" aria-hidden="true">
    <h2 ref="textRef">
      <span>K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;</span><span>K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;K1D&nbsp;T0M1&nbsp;</span>
    </h2>
  </section>
</template>
