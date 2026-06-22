import { ref, watch } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import {
  fetchAgentProfiles,
  updateAgentProfileStatus,
} from '@/modules/agents/services/agents.service'
import type {
  AgentProfile,
  AgentProfileStatus,
  PaginationMeta,
  UpdateAgentStatusPayload,
} from '@/modules/agents/types'

export function useAgentsList() {
  const items = ref<AgentProfile[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const search = ref('')
  const statusFilter = ref<'all' | AgentProfileStatus>('all')
  const page = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchAgentProfiles({
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
        search: search.value.trim() || undefined,
        page: page.value,
        per_page: 15,
      })

      items.value = result.items
      meta.value = result.meta
    }
    catch (err) {
      error.value = getApiErrorMessage(err)
      items.value = []
      meta.value = null
    }
    finally {
      isLoading.value = false
    }
  }

  async function updateStatus(id: number, payload: UpdateAgentStatusPayload) {
    const updated = await updateAgentProfileStatus(id, payload)
    items.value = items.value.map(item => (item.id === id ? updated : item))
    return updated
  }

  function setPage(next: number) {
    page.value = next
  }

  function setSearch(value: string) {
    search.value = value
    page.value = 1
  }

  function setStatusFilter(value: 'all' | AgentProfileStatus) {
    statusFilter.value = value
    page.value = 1
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined

  watch(search, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      void load()
    }, 300)
  })

  watch([statusFilter, page], () => {
    void load()
  })

  void load()

  return {
    items,
    meta,
    search,
    statusFilter,
    isLoading,
    error,
    load,
    updateStatus,
    setPage,
    setSearch,
    setStatusFilter,
  }
}
