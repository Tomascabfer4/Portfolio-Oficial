<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { content } from './content'
import { chatContent } from './chatContent'
import { projectCases, skillGroups, timeline } from './data'
import { createPortfolioChatContext } from './portfolioChatContext'
import { useGithubRepos } from './composables/useGithubRepos'
import { useLenis } from './composables/useLenis'

import IntroOverlay from './components/IntroOverlay.vue'
import CustomCursor from './components/CustomCursor.vue'
import LandingNav from './components/LandingNav.vue'
import MobileNav from './components/MobileNav.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsCases from './components/ProjectsCases.vue'
import ShapeOverlays from './components/ShapeOverlays.vue'
import ReposExplorer from './components/ReposExplorer.vue'
import SkillsGrid from './components/SkillsGrid.vue'
import TimelineHorizontal from './components/TimelineHorizontal.vue'
import MusicSection from './components/MusicSection.vue'
import MarqueeStrip from './components/MarqueeStrip.vue'
import SiteFooter from './components/SiteFooter.vue'
import FloatingContactStack from './components/FloatingContactStack.vue'
import PortfolioChatModal from './components/PortfolioChatModal.vue'

gsap.registerPlugin(ScrollTrigger)

const storedLanguage = localStorage.getItem('portfolio-language')
const language = ref(storedLanguage === 'en' ? 'en' : 'es')
const isMenuOpen = ref(false)
const activeNavIndex = ref(0)
const isNavVisible = ref(true)
const searchTerm = ref('')
const activeLanguageFilter = ref('All')
const isChatOpen = ref(false)

const heroRef = ref(null)
const reposExplorerRef = ref(null)

const { repositories, isFallback, isLoadingRepos, load: loadRepos, abort: abortRepos } =
  useGithubRepos()
const lenis = useLenis()

const copy = computed(() => content[language.value])
const chatCopy = computed(() => chatContent[language.value])
const chatApiUrl = computed(() => {
  const rawUrl = import.meta.env.VITE_CHAT_API_URL || ''
  if (!rawUrl) return ''

  try {
    const url = new URL(rawUrl)
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/chat'
    }
    return url.toString()
  } catch (error) {
    return rawUrl
  }
})
const whatsAppBaseUrl = 'https://wa.me/34644969162'
const whatsAppDefaultText = {
  es: encodeURIComponent('Hola Tomas, vengo de tu portfolio y me gustaria hablar contigo.'),
  en: encodeURIComponent('Hi Tomas, I come from your portfolio and would like to talk with you.'),
}
const whatsAppUrl = computed(() => `${whatsAppBaseUrl}?text=${whatsAppDefaultText[language.value]}`)
const emailHref = computed(() => 'mailto:tomascabfer4@gmail.com')
const portfolioChatContext = computed(() => createPortfolioChatContext(copy.value))

const navItems = computed(() => [
  { label: copy.value.nav.projects, href: '#projects' },
  { label: copy.value.nav.repos, href: '#repos' },
  { label: copy.value.nav.skills, href: '#skills' },
  { label: copy.value.nav.path, href: '#path' },
  { label: copy.value.nav.contact, href: '#contact' },
])

const featuredReposCount = computed(
  () => repositories.value.filter((repo) => !repo.fork).length,
)

function setLanguage(next) {
  language.value = next
}

function navigate({ event, href, index }) {
  event.preventDefault()
  const target = document.querySelector(href)

  activeNavIndex.value = index
  isMenuOpen.value = false

  if (!target) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    const top = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'auto' })
  } else {
    lenis.scrollTo(target, { offset: -96 })
  }

  if (window.history.replaceState) {
    window.history.replaceState(null, '', href)
  }
}

function goHome(event) {
  event.preventDefault()
  isMenuOpen.value = false
  activeNavIndex.value = 0
  lenis.scrollTo(0)
  if (window.history.replaceState) {
    window.history.replaceState(null, '', '#')
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function openChat() {
  isChatOpen.value = true
}

function closeChat() {
  isChatOpen.value = false
}

watch(isChatOpen, (nextOpen) => {
  if (nextOpen) {
    lenis.instance?.stop?.()
  } else {
    lenis.instance?.start?.()
  }
})

watch(language, (next) => {
  localStorage.setItem('portfolio-language', next)
  document.documentElement.lang = next
})

watch(
  () => [
    reposExplorerRef.value?.filteredRepositories,
    reposExplorerRef.value?.paginatedRepositories,
  ],
  () => nextTick(observeReveals),
)

let scrollHandler = null
let resizeHandler = null
let observer = null
let revealIO = null

function observeReveals() {
  if (!revealIO) return
  document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => {
    revealIO.observe(el)
  })
}

onMounted(() => {
  document.documentElement.lang = language.value
  loadRepos()
  lenis.init()

  let lastScrollY = window.scrollY
  let ticking = false

  scrollHandler = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      isNavVisible.value = currentScrollY <= lastScrollY || currentScrollY < 90
      if (!isNavVisible.value) isMenuOpen.value = false
      lastScrollY = currentScrollY
      ticking = false
    })
  }

  resizeHandler = () => {
    /* nav indicator handled inside LandingNav */
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler)

  const sections = navItems.value
    .map((item, index) => {
      const element = document.querySelector(item.href)
      return element ? { element, index } : null
    })
    .filter(Boolean)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (!visible.length) return
        const index = Number(visible[0].target.getAttribute('data-nav-index'))
        if (!Number.isNaN(index)) activeNavIndex.value = index
      },
      {
        root: null,
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    )

    sections.forEach(({ element, index }) => {
      element.setAttribute('data-nav-index', String(index))
      observer.observe(element)
    })
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const overlay = document.querySelector('.intro-overlay')
  const overlayWord = overlay?.querySelector('.intro-word')
  const overlayDot = overlay?.querySelector('.intro-dot')
  const heroAnimTargets =
    heroRef.value?.sectionRef?.querySelectorAll('.hero-copy, .status-panel') || []
  const navAnimTargets = document.querySelectorAll(
    '.nav-logo, .nav-link, .language-switcher, .nav-hamburger',
  )

  if (!prefersReducedMotion) {
    gsap.set(navAnimTargets, { autoAlpha: 0, y: -14 })
    gsap.set(heroAnimTargets, { autoAlpha: 0, y: 40 })

    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        if (overlay) overlay.style.display = 'none'
        ScrollTrigger.refresh()
      },
    })

    if (overlay && overlayWord) {
      introTl
        .fromTo(overlayWord, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(
          overlayDot,
          { scale: 0 },
          { scale: 1, duration: 0.35, ease: 'back.out(2)' },
          '-=0.2',
        )
        .to(overlayWord, { y: -8, opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.35')
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 0.7,
            ease: 'power3.inOut',
            onStart: () => overlay.classList.add('intro-leaving'),
          },
          '-=0.15',
        )
    }

    introTl
      .to(navAnimTargets, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05 }, '-=0.4')
      .to(heroAnimTargets, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 }, '-=0.45')
  } else {
    gsap.set(navAnimTargets, { autoAlpha: 1, y: 0 })
    gsap.set(heroAnimTargets, { autoAlpha: 1, y: 0 })
    if (overlay) overlay.style.display = 'none'
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealIO.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    nextTick(observeReveals)
  } else {
    nextTick(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'))
    })
  }
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  lenis.instance?.start?.()
  observer?.disconnect()
  revealIO?.disconnect()
  abortRepos()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  lenis.destroy()
})
</script>

<template>
  <CustomCursor />
  <IntroOverlay />

  <div class="app-shell">
    <LandingNav
      :items="navItems"
      :active-index="activeNavIndex"
      :language="language"
      :is-menu-open="isMenuOpen"
      :is-visible="isNavVisible"
      @navigate="navigate"
      @home="goHome"
      @set-language="setLanguage"
      @toggle-menu="toggleMenu"
    />

    <Transition name="mobile-menu">
      <MobileNav
        v-if="isMenuOpen"
        :items="navItems"
        :active-index="activeNavIndex"
        :language="language"
        @navigate="navigate"
        @close="closeMenu"
        @set-language="setLanguage"
      />
    </Transition>

    <main id="top">
      <HeroSection
        ref="heroRef"
        :copy="copy"
        :featured-repos-count="featuredReposCount"
        @navigate="navigate"
      />

      <ProjectsCases :copy="copy" :projects="projectCases" />

      <div class="curtain-transition" aria-hidden="true">
        <ShapeOverlays />
        <span class="curtain-label">{{ copy.repos.title }}</span>
      </div>

      <ReposExplorer
        ref="reposExplorerRef"
        :copy="copy"
        :language="language"
        :repositories="repositories"
        :is-loading="isLoadingRepos"
        :is-fallback="isFallback"
        :search-term="searchTerm"
        :active-language-filter="activeLanguageFilter"
        @update:search-term="(v) => (searchTerm = v)"
        @update:active-language-filter="(v) => (activeLanguageFilter = v)"
      />

      <SkillsGrid :copy="copy" :groups="skillGroups" />

      <TimelineHorizontal :copy="copy" :items="timeline" />

      <MusicSection :copy="copy" />

      <MarqueeStrip />
    </main>
  </div>

  <SiteFooter :copy="copy" @navigate="navigate" @home="goHome" />

  <FloatingContactStack
    :chat-copy="chatCopy"
    :whats-app-url="whatsAppUrl"
    @open-chat="openChat"
  />

  <PortfolioChatModal
    :is-open="isChatOpen"
    :copy="copy"
    :chat-copy="chatCopy"
    :whats-app-url="whatsAppUrl"
    :email-href="emailHref"
    :chat-api-url="chatApiUrl"
    :portfolio-context="portfolioChatContext"
    @close="closeChat"
  />

  <div class="footer-spacer" />
</template>
