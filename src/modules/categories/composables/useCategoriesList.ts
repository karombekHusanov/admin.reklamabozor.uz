import { ref, watch } from 'vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  toggleCategoryActive,
  updateCategory,
} from '@/modules/categories/services/categories.service'
import type { Category, CategoryPayload, CategoryType, PaginationMeta } from '@/modules/categories/types'

export function useCategoriesList() {
  const items = ref<Category[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const search = ref('')
  const typeFilter = ref<'all' | CategoryType>('all')
  const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
  const page = ref(1)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchCategories({
        type: typeFilter.value === 'all' ? undefined : typeFilter.value,
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

  async function create(payload: CategoryPayload) {
    const created = await createCategory(payload)
    await load()
    return created
  }

  async function save(id: number, payload: Partial<CategoryPayload>) {
    const updated = await updateCategory(id, payload)
    items.value = items.value.map(item => (item.id === id ? updated : item))
    return updated
  }

  async function setActive(id: number, isActive: boolean) {
    const updated = await toggleCategoryActive(id, isActive)
    items.value = items.value.map(item => (item.id === id ? updated : item))
    return updated
  }

  async function remove(id: number) {
    await deleteCategory(id)
    await load()
  }

  function setPage(next: number) {
    page.value = next
  }

  function setSearch(value: string) {
    search.value = value
    page.value = 1
  }

  function setTypeFilter(value: 'all' | CategoryType) {
    typeFilter.value = value
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

  watch([typeFilter, statusFilter, page], () => {
    void load()
  })

  void load()

  return {
    items,
    meta,
    search,
    typeFilter,
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
    setTypeFilter,
    setStatusFilter,
  }
}
