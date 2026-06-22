export type CategoryType = 'agent' | 'designer'

export interface Category {
  id: number
  name_uz: string
  name_ru: string
  type: CategoryType
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedCategories {
  items: Category[]
  meta: PaginationMeta
}

export interface CategoriesListParams {
  type?: CategoryType
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
  sort?: 'sort_order' | 'created_at' | 'name_uz' | 'name_ru'
  direction?: 'asc' | 'desc'
}

export interface CategoryPayload {
  name_uz: string
  name_ru: string
  type: CategoryType
  sort_order?: number
  is_active?: boolean
}
