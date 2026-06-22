import { api } from '@/core/api/client'
import type { ApiSuccess } from '@/core/types/api'
import type {
  AgentProfile,
  AgentProfilesListParams,
  PaginatedAgentProfiles,
  UpdateAgentStatusPayload,
} from '@/modules/agents/types'

export async function fetchAgentProfiles(params: AgentProfilesListParams): Promise<PaginatedAgentProfiles> {
  const { data } = await api.get<ApiSuccess<PaginatedAgentProfiles>>('/api/v1/admin/agents', { params })

  return data.data
}

export async function fetchAgentProfile(id: number): Promise<AgentProfile> {
  const { data } = await api.get<ApiSuccess<AgentProfile>>(`/api/v1/admin/agents/${id}`)

  return data.data
}

export async function updateAgentProfileStatus(
  id: number,
  payload: UpdateAgentStatusPayload,
): Promise<AgentProfile> {
  const { data } = await api.patch<ApiSuccess<AgentProfile>>(
    `/api/v1/admin/agents/${id}/status`,
    payload,
  )

  return data.data
}
