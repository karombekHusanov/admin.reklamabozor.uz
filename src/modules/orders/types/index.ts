import type { Category } from '@/modules/categories/types'

export type OrderStatus
  = | 'new'
    | 'offers_sent'
    | 'client_selected'
    | 'in_progress'
    | 'completed'
    | 'cancelled'

export type OfferStatus = 'pending' | 'accepted' | 'rejected'

/** Statuses an admin can transition an order to. */
export type AdminOrderStatus = 'in_progress' | 'completed' | 'cancelled'

export interface OrderClient {
  id: number
  first_name: string
  last_name: string | null
  username: string | null
  phone: string | null
  telegram_id: number | null
}

export interface OrderOfferAgent {
  id: number
  company_name: string | null
  phone: string | null
  location_label: string | null
  applicant_name: string | null
  username: string | null
}

export interface OrderOffer {
  id: number
  price: string | number
  comment: string
  status: OfferStatus
  agent: OrderOfferAgent
  created_at: string
}

export interface Order {
  id: number
  title: string
  description: string
  status: OrderStatus
  category: Category | null
  tz_file: string | null
  client: OrderClient | null
  offers?: OrderOffer[]
  accepted_offer_id: number | null
  offers_count?: number
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedOrders {
  items: Order[]
  meta: PaginationMeta
}

export interface OrdersListParams {
  status?: OrderStatus
  search?: string
  page?: number
  per_page?: number
}

export interface UpdateOrderStatusPayload {
  status: AdminOrderStatus
}
