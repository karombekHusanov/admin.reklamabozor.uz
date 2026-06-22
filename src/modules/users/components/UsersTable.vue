<script setup lang="ts">
import { Pencil, Power, PowerOff } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { User } from '@/modules/auth'

interface Props {
  users: User[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  toggleActive: [user: User]
}>()

const locale = useLocaleStore()

function displayName(user: User) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email || `#${user.id}`
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border/60">
    <table class="w-full text-sm">
      <thead class="border-b bg-muted/40 text-left">
        <tr>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.users.table.name }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
            {{ locale.t.users.table.contact }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
            {{ locale.t.users.table.telegram }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.users.table.status }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
            {{ locale.t.users.table.joined }}
          </th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">
            {{ locale.t.users.table.actions }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.users.loading }}
          </td>
        </tr>
        <tr v-else-if="users.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.users.empty }}
          </td>
        </tr>
        <tr
          v-for="user in users"
          v-else
          :key="user.id"
          class="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20"
        >
          <td class="px-4 py-3">
            <div class="font-medium">{{ displayName(user) }}</div>
            <div v-if="user.username" class="text-xs text-muted-foreground">
              @{{ user.username }}
            </div>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground md:table-cell">
            <div>{{ user.email || '—' }}</div>
            <div class="text-xs">{{ user.phone || '—' }}</div>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground lg:table-cell">
            {{ user.telegram_id ?? '—' }}
          </td>
          <td class="px-4 py-3">
            <Badge :variant="user.is_active ? 'brand' : 'outline'">
              {{ user.is_active ? locale.t.users.status.active : locale.t.users.status.inactive }}
            </Badge>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
            {{ formatDate(user.created_at) }}
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="icon" :aria-label="locale.t.users.actions.edit" @click="emit('edit', user)">
                <Pencil class="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="user.is_active ? locale.t.users.actions.deactivate : locale.t.users.actions.activate"
                @click="emit('toggleActive', user)"
              >
                <PowerOff v-if="user.is_active" class="size-4 text-destructive" />
                <Power v-else class="size-4 text-brand" />
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
