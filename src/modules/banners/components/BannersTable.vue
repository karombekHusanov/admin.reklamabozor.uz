<script setup lang="ts">
import { ImageOff, Pencil, Power, PowerOff, Trash2 } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { Banner } from '@/modules/banners/types'

interface Props {
  banners: Banner[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [banner: Banner]
  toggleActive: [banner: Banner]
  delete: [banner: Banner]
}>()

const locale = useLocaleStore()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border/60">
    <table class="w-full text-sm">
      <thead class="border-b bg-muted/40 text-left">
        <tr>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.banners.table.preview }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.banners.table.title }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.banners.table.type }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
            {{ locale.t.banners.table.subtitle }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
            {{ locale.t.banners.table.sortOrder }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.banners.table.status }}
          </th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">
            {{ locale.t.banners.table.actions }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="7" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.banners.loading }}
          </td>
        </tr>
        <tr v-else-if="banners.length === 0">
          <td colspan="7" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.banners.empty }}
          </td>
        </tr>
        <tr
          v-for="banner in banners"
          v-else
          :key="banner.id"
          class="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20"
        >
          <td class="px-4 py-3">
            <div class="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/40">
              <img
                v-if="banner.image"
                :src="banner.image"
                :alt="banner.title ?? ''"
                class="h-full w-full object-cover"
              >
              <ImageOff v-else class="size-4 text-muted-foreground" />
            </div>
          </td>
          <td class="px-4 py-3 font-medium">
            {{ banner.title || '—' }}
          </td>
          <td class="px-4 py-3">
            <Badge variant="muted">
              {{ banner.type === 'agent' ? locale.t.banners.types.agent : locale.t.banners.types.product }}
            </Badge>
          </td>
          <td class="hidden max-w-xs truncate px-4 py-3 text-muted-foreground md:table-cell">
            {{ banner.subtitle || '—' }}
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
            {{ banner.sort_order }}
          </td>
          <td class="px-4 py-3">
            <Badge :variant="banner.is_active ? 'brand' : 'outline'">
              {{ banner.is_active ? locale.t.banners.status.active : locale.t.banners.status.inactive }}
            </Badge>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="icon" :aria-label="locale.t.banners.actions.edit" @click="emit('edit', banner)">
                <Pencil class="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="banner.is_active ? locale.t.banners.actions.deactivate : locale.t.banners.actions.activate"
                @click="emit('toggleActive', banner)"
              >
                <PowerOff v-if="banner.is_active" class="size-4 text-destructive" />
                <Power v-else class="size-4 text-brand" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="locale.t.banners.actions.delete"
                @click="emit('delete', banner)"
              >
                <Trash2 class="size-4 text-destructive" />
              </Button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
