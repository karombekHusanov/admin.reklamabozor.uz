import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type { User } from '@/modules/auth'
import type {
  PaginatedUsers,
  UpdateUserPayload,
  UsersListParams,
} from '@/modules/users/types'

export async function fetchUsers(params: UsersListParams): Promise<PaginatedUsers> {
  const { data } = await api.get<ApiSuccess<PaginatedUsers>>('/api/v1/admin/users', {
    params,
  })

  return data.data
}

export async function fetchUser(id: number): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>(`/api/v1/admin/users/${id}`)

  return data.data
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch<ApiSuccess<User>>(`/api/v1/admin/users/${id}`, payload)

  return data.data
}

export async function toggleUserActive(id: number, isActive: boolean): Promise<User> {
  const { data } = await api.patch<ApiSuccess<User>>(`/api/v1/admin/users/${id}/active`, {
    is_active: isActive,
  })

  return data.data
}
