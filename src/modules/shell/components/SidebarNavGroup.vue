<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/core/lib/utils'

export interface NavItem {
  to: string
  label: string
  icon: Component
}

interface Props {
  label: string
  icon: Component
  items: NavItem[]
  sidebarCollapsed: boolean
  storageKey: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true,
})

const route = useRoute()

function readOpenState() {
  try {
    const stored = localStorage.getItem(props.storageKey)
    if (stored !== null) return stored === 'true'
  }
  catch {
    // ignore
  }
  return props.defaultOpen
}

const isOpen = ref(readOpenState())

const isGroupActive = computed(() =>
  props.items.some(item =>
    route.path === item.to || route.path.startsWith(`${item.to}/`),
  ),
)

watch(isGroupActive, (active) => {
  if (active) {
    isOpen.value = true
  }
}, { immediate: true })

watch(isOpen, (value) => {
  try {
    localStorage.setItem(props.storageKey, String(value))
  }
  catch {
    // ignore
  }
})

function isItemActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <!-- Collapsed sidebar: icon-only child links -->
  <div v-if="sidebarCollapsed" class="mb-2">
    <p class="mb-2 h-px bg-sidebar-border/60" aria-hidden="true" />
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.to">
        <slot
          name="item"
          :item="item"
          :active="isItemActive(item.to)"
          :collapsed="true"
        />
      </li>
    </ul>
  </div>

  <!-- Expanded sidebar: collapsible group -->
  <div v-else class="mb-2">
    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors hover:bg-sidebar-accent/50"
      :class="isGroupActive ? 'text-sidebar-foreground' : 'text-muted-foreground/80'"
      @click="toggle"
    >
      <component :is="icon" class="size-3.5 shrink-0" />
      <span class="flex-1 truncate">{{ label }}</span>
      <ChevronDown
        :class="cn(
          'size-3.5 shrink-0 transition-transform duration-200',
          isOpen ? 'rotate-0' : '-rotate-90',
        )"
      />
    </button>

    <ul
      v-show="isOpen"
      class="mt-1 space-y-0.5 border-l border-sidebar-border/60 pl-2 ml-3"
    >
      <li v-for="item in items" :key="item.to">
        <slot
          name="item"
          :item="item"
          :active="isItemActive(item.to)"
          :collapsed="false"
        />
      </li>
    </ul>
  </div>
</template>
