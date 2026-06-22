import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocaleStore } from '@/core/i18n/locale.store'

function resolveNestedKey(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
  return typeof value === 'string' ? value : undefined
}

export function usePageMeta() {
  const route = useRoute()
  const locale = useLocaleStore()

  const title = computed(() => {
    const meta = route.meta
    if (meta.titleKey) {
      return resolveNestedKey(locale.t as unknown as Record<string, unknown>, meta.titleKey) ?? meta.title ?? ''
    }
    return meta.title ?? ''
  })

  const subtitle = computed(() => {
    const meta = route.meta
    if (meta.subtitleKey) {
      return resolveNestedKey(locale.t as unknown as Record<string, unknown>, meta.subtitleKey) ?? meta.subtitle ?? ''
    }
    return meta.subtitle ?? ''
  })

  return { title, subtitle }
}
