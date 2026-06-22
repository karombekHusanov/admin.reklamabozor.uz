import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type {
  Order,
  OrdersListParams,
  PaginatedOrders,
  UpdateOrderStatusPayload,
} from '@/modules/orders/types'

export async function fetchOrders(params: OrdersListParams): Promise<PaginatedOrders> {
  const { data } = await api.get<ApiSuccess<PaginatedOrders>>('/api/v1/admin/orders', { params })

  return data.data
}

export async function fetchOrder(id: number): Promise<Order> {
  const { data } = await api.get<ApiSuccess<Order>>(`/api/v1/admin/orders/${id}`)

  return data.data
}

export async function updateOrderStatus(
  id: number,
  payload: UpdateOrderStatusPayload,
): Promise<Order> {
  const { data } = await api.patch<ApiSuccess<Order>>(
    `/api/v1/admin/orders/${id}/status`,
    payload,
  )

  return data.data
}
