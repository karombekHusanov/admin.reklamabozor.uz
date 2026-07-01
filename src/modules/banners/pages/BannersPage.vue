<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Search } from '@lucide/vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { useLocaleStore } from '@/core/i18n/locale.store'
import BannersTable from '@/modules/banners/components/BannersTable.vue'
import BannerFormDialog from '@/modules/banners/components/BannerFormDialog.vue'
import { useBannersList } from '@/modules/banners/composables/useBannersList'
import type { Banner, BannerPayload } from '@/modules/banners/types'

const locale = useLocaleStore()

const {
  items,
  meta,
  search,
  statusFilter,
  isLoading,
  error,
  create,
  save,
  setActive,
  remove,
  setPage,
  setSearch,
  setStatusFilter,
} = useBannersList()

const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editingBanner = ref<Banner | null>(null)
const formSubmitting = ref(false)
const formError = ref<string | null>(null)
const actionError = ref<string | null>(null)

const statusFilters = [
  { value: 'all' as const, labelKey: 'all' },
  { value: 'active' as const, labelKey: 'active' },
  { value: 'inactive' as const, labelKey: 'inactive' },
] as const

function openCreate() {
  formMode.value = 'create'
  editingBanner.value = null
  formError.value = null
  formOpen.value = true
}

function openEdit(banner: Banner) {
  formMode.value = 'edit'
  editingBanner.value = banner
  formError.value = null
  formOpen.value = true
}

async function onCreate(payload: BannerPayload) {
  formSubmitting.value = true
  formError.value = null

  try {
    await create(payload)
    formOpen.value = false
  }
  catch (err) {
    formError.value = getApiErrorMessage(err)
  }
  finally {
    formSubmitting.value = false
  }
}

async function onSaveEdit(id: number, payload: Partial<BannerPayload>) {
  formSubmitting.value = true
  formError.value = null

  try {
    await save(id, payload)
    formOpen.value = false
    editingBanner.value = null
  }
  catch (err) {
    formError.value = getApiErrorMessage(err)
  }
  finally {
    formSubmitting.value = false
  }
}

async function onToggleActive(banner: Banner) {
  actionError.value = null

  try {
    await setActive(banner.id, !banner.is_active)
  }
  catch (err) {
    actionError.value = getApiErrorMessage(err)
  }
}

async function onDelete(banner: Banner) {
  if (!window.confirm(locale.t.banners.deleteConfirm)) return

  actionError.value = null

  try {
    await remove(banner.id)
  }
  catch (err) {
    actionError.value = getApiErrorMessage(err)
  }
}
</script>

<template>
  <div class="space-y-4">
    <Card class="border-border/60 shadow-sm">
      <CardHeader class="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle class="text-base">
            {{ locale.t.pages.banners.title }}
          </CardTitle>
          <CardDescription>
            {{ meta ? locale.t.banners.total.replace('{count}', String(meta.total)) : '' }}
          </CardDescription>
        </div>
        <Button size="sm" @click="openCreate">
          <Plus class="size-4" />
          {{ locale.t.banners.create }}
        </Button>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="relative max-w-sm flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="search"
              :placeholder="locale.t.banners.searchPlaceholder"
              class="pl-9"
              @update:model-value="setSearch(String($event))"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              v-for="filter in statusFilters"
              :key="filter.value"
              size="sm"
              :variant="statusFilter === filter.value ? 'brand' : 'outline'"
              @click="setStatusFilter(filter.value)"
            >
              {{ locale.t.banners.filters[filter.labelKey] }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ error }}
        </p>
        <p v-if="actionError" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ actionError }}
        </p>

        <BannersTable
          :banners="items"
          :is-loading="isLoading"
          @edit="openEdit"
          @toggle-active="onToggleActive"
          @delete="onDelete"
        />

        <div
          v-if="meta && meta.last_page > 1"
          class="flex items-center justify-between border-t border-border/60 pt-4"
        >
          <p class="text-sm text-muted-foreground">
            {{ locale.t.banners.pagination
              .replace('{page}', String(meta.current_page))
              .replace('{total}', String(meta.last_page)) }}
          </p>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page <= 1 || isLoading"
              @click="setPage(meta.current_page - 1)"
            >
              {{ locale.t.banners.prev }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page >= meta.last_page || isLoading"
              @click="setPage(meta.current_page + 1)"
            >
              {{ locale.t.banners.next }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <BannerFormDialog
      v-model:open="formOpen"
      :banner="editingBanner"
      :mode="formMode"
      :submitting="formSubmitting"
      :error="formError"
      @save="onCreate"
      @save-edit="onSaveEdit"
    />
  </div>
</template>
