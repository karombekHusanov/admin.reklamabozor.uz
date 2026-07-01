export type BannerType = 'agent' | 'product'

export interface Banner {
  id: number
  title: string | null
  subtitle: string | null
  type: BannerType
  target_id: number | null
  image_file_id: number | null
  image: string | null
  link_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AgentOption {
  id: number
  company_name: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedBanners {
  items: Banner[]
  meta: PaginationMeta
}

export interface BannersListParams {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
  sort?: 'sort_order' | 'created_at' | 'title'
  direction?: 'asc' | 'desc'
}

export interface BannerPayload {
  title?: string | null
  subtitle?: string | null
  type: BannerType
  target_id: number
  image_file_id: number
  link_url?: string | null
  sort_order?: number
  is_active?: boolean
}
