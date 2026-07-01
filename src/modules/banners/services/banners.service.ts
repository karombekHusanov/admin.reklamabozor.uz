import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type {
  AgentOption,
  Banner,
  BannerPayload,
  BannersListParams,
  PaginatedBanners,
} from '@/modules/banners/types'

interface UploadedFile {
  id: number
  url: string
}

export async function fetchBanners(params: BannersListParams): Promise<PaginatedBanners> {
  const { data } = await api.get<ApiSuccess<PaginatedBanners>>('/api/v1/admin/banners', {
    params,
  })

  return data.data
}

export async function createBanner(payload: BannerPayload): Promise<Banner> {
  const { data } = await api.post<ApiSuccess<Banner>>('/api/v1/admin/banners', payload)

  return data.data
}

export async function updateBanner(id: number, payload: Partial<BannerPayload>): Promise<Banner> {
  const { data } = await api.patch<ApiSuccess<Banner>>(`/api/v1/admin/banners/${id}`, payload)

  return data.data
}

export async function toggleBannerActive(id: number, isActive: boolean): Promise<Banner> {
  const { data } = await api.patch<ApiSuccess<Banner>>(`/api/v1/admin/banners/${id}/active`, {
    is_active: isActive,
  })

  return data.data
}

export async function deleteBanner(id: number): Promise<void> {
  await api.delete(`/api/v1/admin/banners/${id}`)
}

/** Approved agents for the banner target picker (id + company name). */
export async function fetchAgentOptions(): Promise<AgentOption[]> {
  const { data } = await api.get<ApiSuccess<AgentOption[]>>('/api/v1/agents')

  return data.data.map(agent => ({ id: agent.id, company_name: agent.company_name }))
}

/**
 * Upload an image to the central file registry and return its id + url.
 * Content-Type is cleared so axios sets the multipart boundary from FormData.
 */
export async function uploadBannerImage(file: File): Promise<UploadedFile> {
  const body = new FormData()
  body.append('file', file)

  const { data } = await api.post<ApiSuccess<UploadedFile>>('/api/v1/file-upload', body, {
    headers: { 'Content-Type': undefined },
  })

  return data.data
}
