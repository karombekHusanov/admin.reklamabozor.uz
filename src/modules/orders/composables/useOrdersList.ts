import { ref, watch } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { fetchOrders } from '@/modules/orders/services/orders.service'
import type { Order, OrderStatus, PaginationMeta } from '@/modules/orders/types'

export function useOrdersList() {
  const items = ref<Order[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const search = ref('')
  const statusFilter = ref<'all' | OrderStatus>('all')
  const page = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchOrders({
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

  /** Replace a single row after its status changed in the detail dialog. */
  function patchItem(updated: Order) {
    items.value = items.value.map(item => (item.id === updated.id ? { ...item, ...updated } : item))
  }

  function setPage(next: number) {
    page.value = next
  }

  function setSearch(value: string) {
    search.value = value
    page.value = 1
  }

  function setStatusFilter(value: 'all' | OrderStatus) {
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
    patchItem,
    setPage,
    setSearch,
    setStatusFilter,
  }
}
