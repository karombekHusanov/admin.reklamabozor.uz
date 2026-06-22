<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@lucide/vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { useLocaleStore } from '@/core/i18n/locale.store'
import OrdersTable from '@/modules/orders/components/OrdersTable.vue'
import OrderDetailDialog from '@/modules/orders/components/OrderDetailDialog.vue'
import { useOrdersList } from '@/modules/orders/composables/useOrdersList'
import { fetchOrder, updateOrderStatus } from '@/modules/orders/services/orders.service'
import type { AdminOrderStatus, Order, OrderStatus } from '@/modules/orders/types'

const locale = useLocaleStore()

const {
  items,
  meta,
  search,
  statusFilter,
  isLoading,
  error,
  patchItem,
  setPage,
  setSearch,
  setStatusFilter,
} = useOrdersList()

const detailOpen = ref(false)
const detailOrder = ref<Order | null>(null)
const detailLoading = ref(false)
const submitting = ref(false)
const detailError = ref<string | null>(null)

const statusFilters = [
  'all',
  'new',
  'offers_sent',
  'client_selected',
  'in_progress',
  'completed',
  'cancelled',
] as const

async function openDetail(order: Order) {
  detailOrder.value = order
  detailError.value = null
  detailOpen.value = true
  detailLoading.value = true

  try {
    detailOrder.value = await fetchOrder(order.id)
  }
  catch (err) {
    detailError.value = getApiErrorMessage(err)
  }
  finally {
    detailLoading.value = false
  }
}

async function onUpdateStatus(id: number, status: AdminOrderStatus) {
  submitting.value = true
  detailError.value = null

  try {
    const updated = await updateOrderStatus(id, { status })
    detailOrder.value = updated
    patchItem(updated)
  }
  catch (err) {
    detailError.value = getApiErrorMessage(err)
  }
  finally {
    submitting.value = false
  }
}

function statusFilterLabel(key: 'all' | OrderStatus) {
  if (key === 'all') return locale.t.orders.filters.all
  return locale.t.orders.status[key]
}
</script>

<template>
  <div class="space-y-4">
    <Card class="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          {{ locale.t.pages.orders.title }}
        </CardTitle>
        <CardDescription>
          {{ meta ? locale.t.orders.total.replace('{count}', String(meta.total)) : locale.t.pages.orders.subtitle }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative max-w-sm flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="search"
              :placeholder="locale.t.orders.searchPlaceholder"
              class="pl-9"
              @update:model-value="setSearch(String($event))"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              v-for="filter in statusFilters"
              :key="filter"
              size="sm"
              :variant="statusFilter === filter ? 'default' : 'outline'"
              @click="setStatusFilter(filter)"
            >
              {{ statusFilterLabel(filter) }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ error }}
        </p>

        <OrdersTable
          :orders="items"
          :is-loading="isLoading"
          @view="openDetail"
        />

        <div
          v-if="meta && meta.last_page > 1"
          class="flex items-center justify-between border-t border-border/60 pt-4"
        >
          <p class="text-sm text-muted-foreground">
            {{ locale.t.orders.pagination
              .replace('{page}', String(meta.current_page))
              .replace('{total}', String(meta.last_page)) }}
          </p>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page <= 1 || isLoading"
              @click="setPage(meta.current_page - 1)"
            >
              {{ locale.t.orders.prev }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page >= meta.last_page || isLoading"
              @click="setPage(meta.current_page + 1)"
            >
              {{ locale.t.orders.next }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <OrderDetailDialog
      v-model:open="detailOpen"
      :order="detailOrder"
      :loading="detailLoading"
      :submitting="submitting"
      :error="detailError"
      @update-status="onUpdateStatus"
    />
  </div>
</template>
