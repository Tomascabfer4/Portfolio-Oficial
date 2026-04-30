<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  items: { type: Array, required: true },
  activeIndex: { type: Number, required: true },
  language: { type: String, required: true },
  isMenuOpen: { type: Boolean, required: true },
  isVisible: { type: Boolean, required: true },
})

const emit = defineEmits(['navigate', 'home', 'set-language', 'toggle-menu'])

const NAV_ACCENT = '#ff5448'
const navLineRef = ref(null)
const navLinkRefs = ref([])

function setNavLinkRef(element, index) {
  if (element) navLinkRefs.value[index] = element
}

function moveIndicator(index, immediate = false) {
  const element = navLinkRefs.value[index]
  if (!element || !navLineRef.value) return

  const properties = {
    width: `${element.offsetWidth}px`,
    x: element.offsetLeft,
    backgroundColor: NAV_ACCENT,
    boxShadow: `0 0 10px ${NAV_ACCENT}88, 0 0 22px ${NAV_ACCENT}44`,
  }

  if (immediate) {
    gsap.set(navLineRef.value, properties)
    return
  }

  gsap.to(navLineRef.value, {
    ...properties,
    duration: 0.4,
    ease: 'power3.out',
    overwrite: 'auto',
  })
}

function handleResize() {
  moveIndicator(props.activeIndex, true)
}

watch(
  () => props.activeIndex,
  (index) => nextTick(() => moveIndicator(index)),
)

watch(
  () => props.language,
  () => nextTick(() => moveIndicator(props.activeIndex, true)),
)

onMounted(() => {
  requestAnimationFrame(() => moveIndicator(props.activeIndex, true))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({ moveIndicator })
</script>

<template>
  <header class="landing-nav" :class="{ hidden: !isVisible }">
    <div class="landing-nav-inner">
      <a class="nav-logo" href="#top" aria-label="K1D T0M1 home" @click="emit('home', $event)">
        <span class="nav-logo-icon">K1</span>
        <span class="nav-logo-word">K1D<span>T0M1</span></span>
      </a>

      <div class="nav-right">
        <nav class="nav-links" aria-label="Main navigation" @mouseleave="moveIndicator(activeIndex)">
          <a
            v-for="(item, index) in items"
            :key="item.href"
            :ref="(el) => setNavLinkRef(el, index)"
            class="nav-link"
            :class="{ active: activeIndex === index }"
            :href="item.href"
            @click="emit('navigate', { event: $event, href: item.href, index })"
            @mouseenter="moveIndicator(index)"
          >
            {{ item.label }}
          </a>
          <span ref="navLineRef" class="nav-line" />
        </nav>

        <div class="nav-actions">
          <div class="language-switcher" aria-label="Language selector">
            <button
              type="button"
              :class="{ active: language === 'es' }"
              :aria-pressed="language === 'es'"
              aria-label="Cambiar a español"
              @click="emit('set-language', 'es')"
            >
              ES
            </button>
            <button
              type="button"
              :class="{ active: language === 'en' }"
              :aria-pressed="language === 'en'"
              aria-label="Switch to English"
              @click="emit('set-language', 'en')"
            >
              EN
            </button>
          </div>

          <button
            class="nav-hamburger"
            type="button"
            :class="{ open: isMenuOpen }"
            aria-label="Menu"
            aria-controls="mobile-navigation"
            :aria-expanded="isMenuOpen"
            @click="emit('toggle-menu')"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
