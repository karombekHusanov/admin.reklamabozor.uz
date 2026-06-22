import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type {
  CategoriesListParams,
  Category,
  CategoryPayload,
  PaginatedCategories,
} from '@/modules/categories/types'

export async function fetchCategories(params: CategoriesListParams): Promise<PaginatedCategories> {
  const { data } = await api.get<ApiSuccess<PaginatedCategories>>('/api/v1/admin/categories', {
    params,
  })

  return data.data
}

export async function fetchCategory(id: number): Promise<Category> {
  const { data } = await api.get<ApiSuccess<Category>>(`/api/v1/admin/categories/${id}`)

  return data.data
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await api.post<ApiSuccess<Category>>('/api/v1/admin/categories', payload)

  return data.data
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<Category> {
  const { data } = await api.patch<ApiSuccess<Category>>(`/api/v1/admin/categories/${id}`, payload)

  return data.data
}

export async function toggleCategoryActive(id: number, isActive: boolean): Promise<Category> {
  const { data } = await api.patch<ApiSuccess<Category>>(`/api/v1/admin/categories/${id}/active`, {
    is_active: isActive,
  })

  return data.data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/v1/admin/categories/${id}`)
}
