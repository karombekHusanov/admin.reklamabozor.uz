export type Role = 'client' | 'agent' | 'designer' | 'admin' | 'seller'

export interface User {
  id: number
  telegram_id: number | null
  first_name: string
  last_name: string | null
  username: string | null
  email: string | null
  phone: string | null
  avatar: string | null
  role: Role
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
  token_type: 'Bearer'
}
