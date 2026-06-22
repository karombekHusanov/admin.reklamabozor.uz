<script setup lang="ts">
import { ChevronUp, LogOut, UserRound } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useLocaleStore } from '@/core/i18n/locale.store'
import { useAuthStore } from '@/modules/auth'
import { ROUTES } from '@/modules/shell/constants/routes'

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const auth = useAuthStore()
const router = useRouter()
const locale = useLocaleStore()

const displayName = computed(() => {
  const u = auth.user
  if (!u) return 'Admin'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || 'Admin'
})

const initials = computed(() => {
  const parts = displayName.value.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }
  return displayName.value.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await auth.logout()
  await router.replace(ROUTES.login)
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex w-full items-center gap-3 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-2.5 text-left outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      :class="collapsed ? 'justify-center px-2' : ''"
    >
      <div
        class="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground"
      >
        {{ initials }}
      </div>
      <div v-if="!collapsed" class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">
          {{ displayName }}
        </p>
        <p class="truncate text-xs capitalize text-muted-foreground">
          {{ auth.user?.role }}
        </p>
      </div>
      <ChevronUp v-if="!collapsed" class="size-4 shrink-0 text-muted-foreground" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        side="top"
        align="start"
        :side-offset="8"
        class="z-50 min-w-56 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
      >
        <div class="border-b px-3 py-2.5">
          <p class="text-sm font-medium">
            {{ displayName }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ auth.user?.email }}
          </p>
        </div>

        <DropdownMenuItem
          class="flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          @select="router.push(ROUTES.profile)"
        >
          <UserRound class="size-4" />
          {{ locale.t.profile.profile }}
        </DropdownMenuItem>

        <DropdownMenuSeparator class="my-1 h-px bg-border" />

        <DropdownMenuItem
          class="flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm text-destructive outline-none data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive"
          @select="handleLogout"
        >
          <LogOut class="size-4" />
          {{ locale.t.profile.logout }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
