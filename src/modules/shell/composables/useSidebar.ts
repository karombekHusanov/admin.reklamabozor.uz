import type { InjectionKey, Ref } from 'vue'
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue'

const STORAGE_KEY = 'adspace_admin_sidebar_collapsed'

export interface SidebarContext {
  isCollapsed: Ref<boolean>
  isExpanded: Ref<boolean>
  isMobile: Ref<boolean>
  isMobileOpen: Ref<boolean>
  toggleCollapsed: () => void
  closeMobile: () => void
}

export const sidebarContextKey: InjectionKey<SidebarContext> = Symbol('sidebar')

function readCollapsedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  }
  catch {
    return false
  }
}

function persistCollapsedPreference(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  }
  catch {
    // ignore
  }
}

export function provideSidebar() {
  const isCollapsed = ref(readCollapsedPreference())
  const isMobileOpen = ref(false)
  const isMobile = ref(false)

  const isExpanded = computed(() => !isCollapsed.value)

  function updateMobileState() {
    isMobile.value = window.matchMedia('(max-width: 1023px)').matches
    if (!isMobile.value) {
      isMobileOpen.value = false
    }
  }

  function toggleCollapsed() {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
      return
    }
    isCollapsed.value = !isCollapsed.value
    persistCollapsedPreference(isCollapsed.value)
  }

  function closeMobile() {
    isMobileOpen.value = false
  }

  onMounted(() => {
    updateMobileState()
    window.addEventListener('resize', updateMobileState)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateMobileState)
  })

  const context: SidebarContext = {
    isCollapsed,
    isExpanded,
    isMobile,
    isMobileOpen,
    toggleCollapsed,
    closeMobile,
  }

  provide(sidebarContextKey, context)
  return context
}

export function useSidebar() {
  const context = inject(sidebarContextKey)
  if (!context) {
    throw new Error('useSidebar must be used within AdminLayout')
  }
  return context
}
