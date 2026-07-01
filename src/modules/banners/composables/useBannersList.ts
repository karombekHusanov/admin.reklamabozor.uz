import { ref, watch } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import {
  createBanner,
  deleteBanner,
  fetchBanners,
  toggleBannerActive,
  updateBanner,
} from '@/modules/banners/services/banners.service'
import type { Banner, BannerPayload, PaginationMeta } from '@/modules/banners/types'

export function useBannersList() {
  const items = ref<Banner[]>([])
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
      const result = await fetchBanners({
        search: search.value.trim() || undefined,
        is_active: statusFilter.value === 'all'
          ? undefined
          : statusFilter.value === 'active',
        page: page.value,
        per_page: 15,
        sort: 'sort_order',
        direction: 'asc',
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

  async function create(payload: BannerPayload) {
    const created = await createBanner(payload)
    await load()
    return created
  }

  async function save(id: number, payload: Partial<BannerPayload>) {
    const updated = await updateBanner(id, payload)
    items.value = items.value.map(item => (item.id === id ? updated : item))
    return updated
  }

  async function setActive(id: number, isActive: boolean) {
    const updated = await toggleBannerActive(id, isActive)
    items.value = items.value.map(item => (item.id === id ? updated : item))
    return updated
  }

  async function remove(id: number) {
    await deleteBanner(id)
    await load()
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

  void load()

  return {
    items,
    meta,
    search,
    statusFilter,
    page,
    isLoading,
    error,
    load,
    create,
    save,
    setActive,
    remove,
    setPage,
    setSearch,
    setStatusFilter,
  }
}
