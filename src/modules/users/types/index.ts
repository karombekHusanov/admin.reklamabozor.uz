import type { Role, User } from '@/modules/auth'

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedUsers {
  items: User[]
  meta: PaginationMeta
}

export interface UsersListParams {
  role: Role
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
  sort?: 'created_at' | 'first_name' | 'email'
  direction?: 'asc' | 'desc'
}

export interface UpdateUserPayload {
  first_name?: string
  last_name?: string | null
  username?: string | null
  phone?: string | null
  email?: string | null
  role?: Role
  avatar?: string | null
}
