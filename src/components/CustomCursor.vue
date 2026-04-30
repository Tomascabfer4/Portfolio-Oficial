<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const haloRef = ref(null)
const dotRef = ref(null)

let raf = 0
let pointerMoveHandler = null
let pointerDownHandler = null
let pointerUpHandler = null
let mouseLeaveHandler = null
let active = false

onMounted(() => {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!isFinePointer || prefersReducedMotion || !haloRef.value || !dotRef.value) return

  active = true
  const halo = haloRef.value
  const dot = dotRef.value
  document.body.classList.add('landing-cursor-active')

  const state = {
    tx: window.innerWidth / 2,
    ty: window.innerHeight / 2,
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2,
  }

  const setState = (visible, interactive = false, pressed = false) => {
    halo.dataset.visible = String(visible)
    dot.dataset.visible = String(visible)
    halo.dataset.interactive = String(interactive)
    dot.dataset.interactive = String(interactive)
    halo.dataset.pressed = String(pressed)
    dot.dataset.pressed = String(pressed)
  }

  const render = () => {
    state.cx += (state.tx - state.cx) * 0.16
    state.cy += (state.ty - state.cy) * 0.16
    halo.style.transform = `translate3d(${state.cx}px, ${state.cy}px, 0) translate(-50%, -50%)`
    dot.style.transform = `translate3d(${state.tx}px, ${state.ty}px, 0) translate(-50%, -50%)`
    raf = window.requestAnimationFrame(render)
  }

  const interactiveSelector =
    'a,button,input,textarea,select,[role="button"],[data-cursor="interactive"]'

  pointerMoveHandler = (event) => {
    state.tx = event.clientX
    state.ty = event.clientY
    const el = event.target instanceof Element ? event.target : null
    const isInteractive = Boolean(el?.closest(interactiveSelector))
    setState(true, isInteractive, event.buttons > 0)
  }
  pointerDownHandler = () => {
    halo.dataset.pressed = 'true'
    dot.dataset.pressed = 'true'
  }
  pointerUpHandler = () => {
    halo.dataset.pressed = 'false'
    dot.dataset.pressed = 'false'
  }
  mouseLeaveHandler = () => setState(false)

  raf = window.requestAnimationFrame(render)
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true })
  window.addEventListener('pointerdown', pointerDownHandler, { passive: true })
  window.addEventListener('pointerup', pointerUpHandler, { passive: true })
  document.addEventListener('mouseleave', mouseLeaveHandler)
})

onUnmounted(() => {
  if (!active) return
  if (raf) window.cancelAnimationFrame(raf)
  if (pointerMoveHandler) window.removeEventListener('pointermove', pointerMoveHandler)
  if (pointerDownHandler) window.removeEventListener('pointerdown', pointerDownHandler)
  if (pointerUpHandler) window.removeEventListener('pointerup', pointerUpHandler)
  if (mouseLeaveHandler) document.removeEventListener('mouseleave', mouseLeaveHandler)
  document.body.classList.remove('landing-cursor-active')
})
</script>

<template>
  <div ref="haloRef" class="landing-cursor-halo" aria-hidden="true" />
  <div ref="dotRef" class="landing-cursor-dot" aria-hidden="true" />
</template>
