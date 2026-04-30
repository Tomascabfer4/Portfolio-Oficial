<script setup>
defineProps({
  copy: { type: Object, required: true },
})

const emit = defineEmits(['navigate', 'home'])
</script>

<template>
  <footer id="contact" class="site-footer">
    <div class="footer-bg" />
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <a class="footer-brand" href="#top" @click="emit('home', $event)">
            <span class="nav-logo-icon">K1</span>
            <span>K1D<span>T0M1</span></span>
          </a>
          <p>{{ copy.hero.name }} · {{ copy.hero.role }}</p>
        </div>

        <div class="footer-links">
          <div>
            <a href="#projects" @click="emit('navigate', { event: $event, href: '#projects', index: 0 })">
              {{ copy.nav.projects }}
            </a>
            <a href="#repos" @click="emit('navigate', { event: $event, href: '#repos', index: 1 })">
              {{ copy.nav.repos }}
            </a>
            <a href="#skills" @click="emit('navigate', { event: $event, href: '#skills', index: 2 })">
              {{ copy.nav.skills }}
            </a>
          </div>
          <div>
            <a href="https://github.com/Tomascabfer4" target="_blank" rel="noreferrer">GitHub</a>
            <a
              href="https://www.linkedin.com/in/tom%C3%A1s-cabello-fern%C3%A1ndez-25b838201/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="mailto:tomascabfer4@gmail.com">Email</a>
          </div>
          <div>
            <a href="https://www.instagram.com/tomas_cf4" target="_blank" rel="noreferrer">Instagram</a>
            <span class="disabled-footer-link" aria-disabled="true">{{ copy.music.cta }}</span>
          </div>
        </div>
      </div>

      <div class="footer-separator" />

      <div class="footer-bottom">
        <div class="footer-socials">
          <a href="https://github.com/Tomascabfer4" aria-label="GitHub" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.08 0 4.41-2.68 5.38-5.24 5.66.41.36.77 1.06.77 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a href="mailto:tomascabfer4@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm2.2-.25 6.8 5.3 6.8-5.3H5.2Zm13.3 1.66-5.88 4.58a1 1 0 0 1-1.24 0L5.5 7.16v11.09c0 .3.25.55.55.55h11.9c.3 0 .55-.25.55-.55V7.16Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/tom%C3%A1s-cabello-fern%C3%A1ndez-25b838201/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5.001 2.5 2.5 0 0 0 0-5.001ZM3 9.75h3.96V21H3V9.75Zm6.5 0h3.79v1.54h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-3.95v-4.94c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.61V21H9.5V9.75Z" />
            </svg>
          </a>
          <span>{{ copy.contact.body }}</span>
        </div>

        <p>Copyright © 2026 - K1D T0M1. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
