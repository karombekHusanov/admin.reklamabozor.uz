import { ref, watch } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import type { Role, User } from '@/modules/auth'
import { fetchUsers, toggleUserActive, updateUser } from '@/modules/users/services/users.service'
import type { PaginationMeta, UpdateUserPayload } from '@/modules/users/types'

export function useUsersList(role: () => Role) {
  const items = ref<User[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
  const page = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchUsers({
        role: role(),
        search: search.value.trim() || undefined,
        is_active: statusFilter.value === 'all'
          ? undefined
          : statusFilter.value === 'active',
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

  async function saveUser(id: number, payload: UpdateUserPayload) {
    const updated = await updateUser(id, payload)
    items.value = items.value.map(user => (user.id === id ? updated : user))
    return updated
  }

  async function setActive(id: number, isActive: boolean) {
    const updated = await toggleUserActive(id, isActive)
    items.value = items.value.map(user => (user.id === id ? updated : user))
    return updated
  }

  function setPage(next: number) {
    page.value = next
  }

  function setSearch(value: string) {
    search.value = value
    page.value = 1
  }

  function setStatusFilter(value: 'all' | 'active' | 'inactive') {
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

  watch(role, () => {
    page.value = 1
    search.value = ''
    statusFilter.value = 'all'
    void load()
  }, { immediate: true })

  return {
    items,
    meta,
    search,
    statusFilter,
    page,
    isLoading,
    error,
    load,
    saveUser,
    setActive,
    setPage,
    setSearch,
    setStatusFilter,
  }
}
