import type { OfferStatus, OrderStatus } from '@/modules/orders/types'

type BadgeVariant = 'default' | 'brand' | 'muted' | 'outline' | 'secondary'

const ORDER_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  new: 'muted',
  offers_sent: 'secondary',
  client_selected: 'brand',
  in_progress: 'default',
  completed: 'brand',
  cancelled: 'outline',
}

const OFFER_VARIANTS: Record<OfferStatus, BadgeVariant> = {
  pending: 'muted',
  accepted: 'brand',
  rejected: 'outline',
}

export function orderStatusVariant(status: OrderStatus): BadgeVariant {
  return ORDER_VARIANTS[status] ?? 'muted'
}

export function offerStatusVariant(status: OfferStatus): BadgeVariant {
  return OFFER_VARIANTS[status] ?? 'muted'
}

export function formatPrice(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return String(value)
  return new Intl.NumberFormat('uz-UZ').format(n) + ' so‘m'
}
