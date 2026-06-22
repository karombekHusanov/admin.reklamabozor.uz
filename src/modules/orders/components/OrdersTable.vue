<script setup lang="ts">
import { Eye } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import { cn } from '@/core/lib/utils'
import { orderStatusVariant } from '@/modules/orders/lib/order-status'
import type { Order, OrderStatus } from '@/modules/orders/types'

interface Props {
  orders: Order[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  view: [order: Order]
}>()

const locale = useLocaleStore()

function clientName(order: Order) {
  const c = order.client
  if (!c) return '—'
  return [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username || `#${c.id}`
}

function statusLabel(status: OrderStatus) {
  return locale.t.orders.status[status]
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
            {{ locale.t.orders.table.order }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
            {{ locale.t.orders.table.client }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
            {{ locale.t.orders.table.offers }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.orders.table.status }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
            {{ locale.t.orders.table.created }}
          </th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">
            {{ locale.t.orders.table.actions }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.orders.loading }}
          </td>
        </tr>
        <tr v-else-if="orders.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.orders.empty }}
          </td>
        </tr>
        <tr
          v-for="order in orders"
          v-else
          :key="order.id"
          :class="cn(
            'border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20',
            order.status === 'client_selected' && 'bg-brand/5',
          )"
        >
          <td class="px-4 py-3">
            <div class="font-medium">{{ order.category?.name_uz ?? order.title }}</div>
            <div class="max-w-xs truncate text-xs text-muted-foreground">{{ order.description }}</div>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground md:table-cell">
            {{ clientName(order) }}
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground lg:table-cell">
            {{ order.offers_count ?? order.offers?.length ?? 0 }}
          </td>
          <td class="px-4 py-3">
            <Badge :variant="orderStatusVariant(order.status)">
              {{ statusLabel(order.status) }}
            </Badge>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
            {{ formatDate(order.created_at) }}
          </td>
          <td class="px-4 py-3 text-right">
            <Button variant="ghost" size="sm" @click="emit('view', order)">
              <Eye class="size-4" />
              {{ locale.t.orders.actions.view }}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
