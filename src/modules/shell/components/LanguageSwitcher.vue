<script setup lang="ts">
import { Check, ChevronDown, Globe } from '@lucide/vue'
import { computed } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { Button } from '@/core/ui/button'
import { useLocaleStore, type Locale } from '@/core/i18n/locale.store'
import { cn } from '@/core/lib/utils'

const locale = useLocaleStore()

const options: { value: Locale, label: string }[] = [
  { value: 'en', label: locale.t.language.en },
  { value: 'uz', label: locale.t.language.uz },
]

const currentLabel = computed(() =>
  locale.locale === 'en' ? locale.t.language.en : locale.t.language.uz,
)
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="gap-2 border-border/60 bg-background shadow-none"
        :aria-label="locale.t.language.label"
      >
        <Globe class="size-4 text-muted-foreground" />
        <span class="hidden sm:inline">{{ currentLabel }}</span>
        <ChevronDown class="size-3.5 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="8"
        class="z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <DropdownMenuItem
          v-for="option in options"
          :key="option.value"
          class="flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          @select="locale.setLocale(option.value)"
        >
          <Check
            :class="cn(
              'size-4',
              locale.locale === option.value ? 'opacity-100' : 'opacity-0',
            )"
          />
          {{ option.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
