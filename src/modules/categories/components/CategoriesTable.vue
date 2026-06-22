<script setup lang="ts">
import { Pencil, Power, PowerOff, Trash2 } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { Category } from '@/modules/categories/types'

interface Props {
  categories: Category[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [category: Category]
  toggleActive: [category: Category]
  delete: [category: Category]
}>()

const locale = useLocaleStore()

function typeLabel(type: Category['type']) {
  return type === 'agent' ? locale.t.categories.types.agent : locale.t.categories.types.designer
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border/60">
    <table class="w-full text-sm">
      <thead class="border-b bg-muted/40 text-left">
        <tr>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.categories.table.nameUz }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
            {{ locale.t.categories.table.nameRu }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.categories.table.type }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
            {{ locale.t.categories.table.sortOrder }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.categories.table.status }}
          </th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">
            {{ locale.t.categories.table.actions }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.categories.loading }}
          </td>
        </tr>
        <tr v-else-if="categories.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.categories.empty }}
          </td>
        </tr>
        <tr
          v-for="category in categories"
          v-else
          :key="category.id"
          class="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20"
        >
          <td class="px-4 py-3 font-medium">
            {{ category.name_uz }}
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground md:table-cell">
            {{ category.name_ru }}
          </td>
          <td class="px-4 py-3">
            <Badge variant="muted" class="capitalize">
              {{ typeLabel(category.type) }}
            </Badge>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
            {{ category.sort_order }}
          </td>
          <td class="px-4 py-3">
            <Badge :variant="category.is_active ? 'brand' : 'outline'">
              {{ category.is_active ? locale.t.categories.status.active : locale.t.categories.status.inactive }}
            </Badge>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-1">
              <Button variant="ghost" size="icon" :aria-label="locale.t.categories.actions.edit" @click="emit('edit', category)">
                <Pencil class="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="category.is_active ? locale.t.categories.actions.deactivate : locale.t.categories.actions.activate"
                @click="emit('toggleActive', category)"
              >
                <PowerOff v-if="category.is_active" class="size-4 text-destructive" />
                <Power v-else class="size-4 text-brand" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                :aria-label="locale.t.categories.actions.delete"
                @click="emit('delete', category)"
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
