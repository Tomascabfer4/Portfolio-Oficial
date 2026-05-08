<script setup>
defineProps({
  chatCopy: { type: Object, required: true },
  whatsAppUrl: { type: String, required: true },
})

defineEmits(['open-chat'])
</script>

<template>
  <div class="floating-contact-stack" data-cursor="interactive">
    <button
      type="button"
      class="floating-contact-button ai"
      :aria-label="chatCopy.aiButton"
      @click="$emit('open-chat')"
    >
      <span class="floating-contact-tooltip">{{ chatCopy.aiButton }}</span>
      <span class="floating-contact-icon" aria-hidden="true">
        <svg class="ai-clean-icon" viewBox="0 0 24 24">
          <path
            d="M12 2.75 14.36 9.64 21.25 12 14.36 14.36 12 21.25 9.64 14.36 2.75 12 9.64 9.64 12 2.75Z"
          />
          <circle cx="18.4" cy="5.8" r="1.35" />
          <circle cx="5.7" cy="18.2" r="1" />
        </svg>
      </span>
    </button>

    <a
      class="floating-contact-button whatsapp"
      :href="whatsAppUrl"
      target="_blank"
      rel="noreferrer"
      :aria-label="chatCopy.whatsappButton"
    >
      <span class="floating-contact-tooltip">{{ chatCopy.whatsappButton }}</span>
      <span class="floating-contact-icon" aria-hidden="true">
        <svg class="whatsapp-brand-icon" viewBox="0 0 448 512">
          <path
            d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.4 32 1.8 131.6 1.8 254.1c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.4 0 222.1-99.6 222.1-222.1 0-59.3-23.1-115-65.1-156.9zM223.9 438.7h-.1c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.1 0-101.4 82.5-183.8 184-183.8 49.1 0 95.3 19.1 130 53.8 34.7 34.7 53.8 80.8 53.7 130-.1 101.4-82.5 183.7-183.1 183.7zm100.8-137.7c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18-17.6 21.7-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z"
          />
        </svg>
      </span>
    </a>
  </div>
</template>
