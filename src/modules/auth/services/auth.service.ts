import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type { AuthResponse, User } from '@/modules/auth/types/user'

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<ApiSuccess<AuthResponse>>('/api/v1/auth/admin/login', {
    email,
    password,
  })

  return data.data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<ApiSuccess<User>>('/api/v1/auth/me')

  return data.data
}

export async function logout(): Promise<void> {
  await api.post('/api/v1/auth/logout')
}
