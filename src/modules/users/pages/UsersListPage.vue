<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@lucide/vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { Role, User } from '@/modules/auth'
import UserEditDialog from '@/modules/users/components/UserEditDialog.vue'
import UsersTable from '@/modules/users/components/UsersTable.vue'
import { useUsersList } from '@/modules/users/composables/useUsersList'
import { getUserRoleConfig } from '@/modules/users/constants/roles'
import type { UpdateUserPayload } from '@/modules/users/types'

const route = useRoute()
const locale = useLocaleStore()

const role = computed(() => route.meta.role as Role)
const config = computed(() => getUserRoleConfig(role.value))

const {
  items,
  meta,
  search,
  statusFilter,
  isLoading,
  error,
  load,
  saveUser,
  setActive,
  setPage,
  setSearch,
  setStatusFilter,
} = useUsersList(() => role.value)

const editOpen = ref(false)
const editingUser = ref<User | null>(null)
const editSubmitting = ref(false)
const editError = ref<string | null>(null)
const actionError = ref<string | null>(null)

function resolveNestedKey(path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, locale.t as unknown as Record<string, unknown>)
  return typeof value === 'string' ? value : ''
}

const roleLabel = computed(() =>
  config.value ? resolveNestedKey(config.value.titleKey) : '',
)

function openEdit(user: User) {
  editingUser.value = user
  editError.value = null
  editOpen.value = true
}

async function onSave(id: number, payload: UpdateUserPayload) {
  editSubmitting.value = true
  editError.value = null

  try {
    const updated = await saveUser(id, payload)
    editOpen.value = false
    editingUser.value = null
    if (updated.role !== role.value) {
      await load()
    }
  }
  catch (err) {
    editError.value = getApiErrorMessage(err)
  }
  finally {
    editSubmitting.value = false
  }
}

async function onToggleActive(user: User) {
  actionError.value = null

  try {
    await setActive(user.id, !user.is_active)
  }
  catch (err) {
    actionError.value = getApiErrorMessage(err)
  }
}

const statusFilters = [
  { value: 'all' as const, labelKey: 'all' },
  { value: 'active' as const, labelKey: 'active' },
  { value: 'inactive' as const, labelKey: 'inactive' },
] as const
</script>

<template>
  <div class="space-y-4">
    <Card class="border-border/60 shadow-sm">
      <CardHeader class="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle class="text-base">
            {{ roleLabel }}
          </CardTitle>
          <CardDescription>
            {{ meta ? locale.t.users.total.replace('{count}', String(meta.total)) : '' }}
          </CardDescription>
        </div>
        <Badge variant="muted" class="capitalize">
          {{ config?.role }}
        </Badge>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative max-w-sm flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="search"
              :placeholder="locale.t.users.searchPlaceholder"
              class="pl-9"
              @update:model-value="setSearch(String($event))"
            />
          </div>

          <div class="flex flex-wrap gap-2">
            <Button
              v-for="filter in statusFilters"
              :key="filter.value"
              size="sm"
              :variant="statusFilter === filter.value ? 'default' : 'outline'"
              @click="setStatusFilter(filter.value)"
            >
              {{ locale.t.users.filters[filter.labelKey] }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ error }}
        </p>
        <p v-if="actionError" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ actionError }}
        </p>

        <UsersTable
          :users="items"
          :is-loading="isLoading"
          @edit="openEdit"
          @toggle-active="onToggleActive"
        />

        <div
          v-if="meta && meta.last_page > 1"
          class="flex items-center justify-between border-t border-border/60 pt-4"
        >
          <p class="text-sm text-muted-foreground">
            {{ locale.t.users.pagination
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
              {{ locale.t.users.prev }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page >= meta.last_page || isLoading"
              @click="setPage(meta.current_page + 1)"
            >
              {{ locale.t.users.next }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <UserEditDialog
      v-model:open="editOpen"
      :user="editingUser"
      :submitting="editSubmitting"
      :error="editError"
      @save="onSave"
    />
  </div>
</template>
