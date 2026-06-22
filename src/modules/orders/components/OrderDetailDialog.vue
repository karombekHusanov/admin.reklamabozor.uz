<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Loader2 } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import {
  formatPrice,
  offerStatusVariant,
  orderStatusVariant,
} from '@/modules/orders/lib/order-status'
import type { AdminOrderStatus, Order, OrderStatus } from '@/modules/orders/types'

interface Props {
  order: Order | null
  open: boolean
  loading?: boolean
  submitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  updateStatus: [id: number, status: AdminOrderStatus]
}>()

const locale = useLocaleStore()

interface StatusAction {
  status: AdminOrderStatus
  variant: 'brand' | 'outline'
  labelKey: 'activate' | 'complete' | 'cancel'
}

const actions = computed<StatusAction[]>(() => {
  switch (props.order?.status) {
    case 'client_selected':
      return [
        { status: 'in_progress', variant: 'brand', labelKey: 'activate' },
        { status: 'cancelled', variant: 'outline', labelKey: 'cancel' },
      ]
    case 'in_progress':
      return [
        { status: 'completed', variant: 'brand', labelKey: 'complete' },
        { status: 'cancelled', variant: 'outline', labelKey: 'cancel' },
      ]
    case 'new':
    case 'offers_sent':
      return [{ status: 'cancelled', variant: 'outline', labelKey: 'cancel' }]
    default:
      return []
  }
})

function clientName(order: Order) {
  const c = order.client
  if (!c) return '—'
  return [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username || `#${c.id}`
}

function statusLabel(status: OrderStatus) {
  return locale.t.orders.status[status]
}

function close() {
  emit('update:open', false)
}

function act(status: AdminOrderStatus) {
  if (!props.order || props.submitting) return
  emit('updateStatus', props.order.id, status)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && order"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Close"
        @click="close"
      />

      <div class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">
              {{ order.category?.name_uz ?? order.title }}
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ locale.t.orders.detail.subtitle }}
            </p>
          </div>
          <Badge :variant="orderStatusVariant(order.status)">
            {{ statusLabel(order.status) }}
          </Badge>
        </div>

        <div v-if="loading" class="py-10 text-center text-sm text-muted-foreground">
          <Loader2 class="mx-auto size-5 animate-spin" />
        </div>

        <template v-else>
          <!-- Description + brief -->
          <p class="mt-5 whitespace-pre-line text-sm text-muted-foreground">
            {{ order.description }}
          </p>
          <a
            v-if="order.tz_file"
            :href="order.tz_file"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium text-foreground"
          >
            <FileText class="size-4" />
            {{ locale.t.orders.detail.viewBrief }}
          </a>

          <!-- Client -->
          <div class="mt-5 rounded-lg border border-border/60 p-4">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {{ locale.t.orders.detail.client }}
            </p>
            <p class="mt-1 text-sm font-medium">{{ clientName(order) }}</p>
            <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span v-if="order.client?.phone">{{ order.client.phone }}</span>
              <span v-if="order.client?.username">@{{ order.client.username }}</span>
              <span v-if="order.client?.telegram_id">TG: {{ order.client.telegram_id }}</span>
            </div>
          </div>

          <!-- Offers -->
          <div class="mt-5">
            <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {{ locale.t.orders.detail.offers }} ({{ order.offers?.length ?? 0 }})
            </p>

            <p v-if="!order.offers?.length" class="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
              {{ locale.t.orders.detail.noOffers }}
            </p>

            <div v-else class="space-y-2">
              <div
                v-for="offer in order.offers"
                :key="offer.id"
                class="rounded-lg border p-3"
                :class="offer.id === order.accepted_offer_id ? 'border-brand/50 bg-brand/5' : 'border-border/60'"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium">
                      {{ offer.agent.company_name ?? '—' }}
                      <Badge
                        v-if="offer.id === order.accepted_offer_id"
                        variant="brand"
                        class="ml-1 align-middle"
                      >
                        {{ locale.t.orders.detail.chosen }}
                      </Badge>
                    </p>
                    <p class="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                      <span v-if="offer.agent.phone">{{ offer.agent.phone }}</span>
                      <span v-if="offer.agent.applicant_name">{{ offer.agent.applicant_name }}</span>
                    </p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-sm font-semibold text-brand">{{ formatPrice(offer.price) }}</p>
                    <Badge :variant="offerStatusVariant(offer.status)" class="mt-1">
                      {{ locale.t.orders.offerStatus[offer.status] }}
                    </Badge>
                  </div>
                </div>
                <p class="mt-2 text-sm text-muted-foreground">{{ offer.comment }}</p>
              </div>
            </div>
          </div>

          <p v-if="error" class="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ error }}
          </p>

          <!-- Status actions -->
          <div class="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-5">
            <Button type="button" variant="outline" @click="close">
              {{ locale.t.orders.detail.close }}
            </Button>
            <Button
              v-for="action in actions"
              :key="action.status"
              type="button"
              :variant="action.variant"
              :class="action.status === 'cancelled' && 'text-destructive'"
              :disabled="submitting"
              @click="act(action.status)"
            >
              {{ locale.t.orders.actions[action.labelKey] }}
            </Button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
