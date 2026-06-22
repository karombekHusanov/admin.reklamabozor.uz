import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { messages, type Locale } from './messages'

export type { Locale }

const STORAGE_KEY = 'adspace_admin_locale'

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'uz') return stored
  }
  catch {
    // ignore
  }
  return 'en'
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>(readLocale())

  const t = computed(() => messages[locale.value])

  function setLocale(next: Locale) {
    locale.value = next
  }

  watch(locale, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    }
    catch {
      // ignore
    }
    document.documentElement.lang = value
  }, { immediate: true })

  return {
    locale,
    t,
    setLocale,
  }
})
