<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { Button } from '@/core/ui/button'
import LanguageSwitcher from '@/modules/shell/components/LanguageSwitcher.vue'
import { SHELL_HEADER_HEIGHT } from '@/modules/shell/constants/layout'
import { usePageMeta } from '@/modules/shell/composables/usePageMeta'
import { useSidebar } from '@/modules/shell/composables/useSidebar'

const { title, subtitle } = usePageMeta()
const { toggleCollapsed } = useSidebar()
</script>

<template>
  <header
    :class="[
      SHELL_HEADER_HEIGHT,
      'flex shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6',
    ]"
  >
    <div class="flex min-w-0 items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        class="shrink-0 text-muted-foreground"
        aria-label="Toggle sidebar"
        @click="toggleCollapsed"
      >
        <Menu class="size-5" />
      </Button>

      <div class="min-w-0">
        <h1 class="truncate text-base font-semibold tracking-tight sm:text-lg">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="truncate text-xs text-muted-foreground sm:text-sm"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div class="flex shrink-0 items-center">
      <LanguageSwitcher />
    </div>
  </header>
</template>
