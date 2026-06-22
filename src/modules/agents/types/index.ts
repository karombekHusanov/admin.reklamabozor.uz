import type { User } from '@/modules/auth'
import type { Category } from '@/modules/categories/types'

export type AgentProfileStatus = 'pending' | 'approved' | 'rejected'

export interface AgentProfile {
  id: number
  user_id: number

  // Verification / KYC.
  company_name: string
  legal_form: string | null
  inn: string | null
  director_name: string | null
  director_passport: string | null
  director_passport_file_id: number | null
  director_passport_file: string | null
  registration_certificate_file_id: number | null
  registration_certificate_file: string | null
  bank_name: string | null
  bank_account: string | null
  mfo: string | null
  phone: string

  // Presentation.
  company_logo_file_id: number | null
  company_logo: string | null
  bio: string | null
  linkedin_url: string | null
  website_url: string | null
  lat: string | number | null
  lng: string | number | null
  location_label: string | null
  results_text: string | null
  categories: Category[]
  completion_percent: number

  // Status.
  status: AgentProfileStatus
  rejection_reason: string | null
  approved_at: string | null
  user?: User
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedAgentProfiles {
  items: AgentProfile[]
  meta: PaginationMeta
}

export interface AgentProfilesListParams {
  status?: AgentProfileStatus
  search?: string
  page?: number
  per_page?: number
}

export interface UpdateAgentStatusPayload {
  status: AgentProfileStatus
  rejection_reason?: string | null
}
