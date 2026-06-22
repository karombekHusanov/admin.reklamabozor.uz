<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@lucide/vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { useLocaleStore } from '@/core/i18n/locale.store'
import AgentReviewDialog from '@/modules/agents/components/AgentReviewDialog.vue'
import AgentsTable from '@/modules/agents/components/AgentsTable.vue'
import { useAgentsList } from '@/modules/agents/composables/useAgentsList'
import type { AgentProfile, AgentProfileStatus } from '@/modules/agents/types'

const locale = useLocaleStore()

const {
  items,
  meta,
  search,
  statusFilter,
  isLoading,
  error,
  updateStatus,
  setPage,
  setSearch,
  setStatusFilter,
} = useAgentsList()

const reviewOpen = ref(false)
const reviewingAgent = ref<AgentProfile | null>(null)
const reviewSubmitting = ref(false)
const reviewError = ref<string | null>(null)

const statusFilters = [
  { value: 'all' as const, labelKey: 'all' },
  { value: 'pending' as const, labelKey: 'pending' },
  { value: 'approved' as const, labelKey: 'approved' },
  { value: 'rejected' as const, labelKey: 'rejected' },
] as const

function openReview(agent: AgentProfile) {
  reviewingAgent.value = agent
  reviewError.value = null
  reviewOpen.value = true
}

async function onApprove(id: number) {
  reviewSubmitting.value = true
  reviewError.value = null

  try {
    const updated = await updateStatus(id, { status: 'approved' })
    reviewingAgent.value = updated
    reviewOpen.value = false
  }
  catch (err) {
    reviewError.value = getApiErrorMessage(err)
  }
  finally {
    reviewSubmitting.value = false
  }
}

async function onReject(id: number, reason: string) {
  reviewSubmitting.value = true
  reviewError.value = null

  try {
    const updated = await updateStatus(id, { status: 'rejected', rejection_reason: reason })
    reviewingAgent.value = updated
    reviewOpen.value = false
  }
  catch (err) {
    reviewError.value = getApiErrorMessage(err)
  }
  finally {
    reviewSubmitting.value = false
  }
}

function statusFilterLabel(key: 'all' | AgentProfileStatus) {
  if (key === 'all') return locale.t.agents.filters.all
  return locale.t.agents.status[key]
}
</script>

<template>
  <div class="space-y-4">
    <Card class="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          {{ locale.t.pages.users.agents.title }}
        </CardTitle>
        <CardDescription>
          {{ meta ? locale.t.agents.total.replace('{count}', String(meta.total)) : locale.t.pages.users.agents.subtitle }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative max-w-sm flex-1">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="search"
              :placeholder="locale.t.agents.searchPlaceholder"
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
              {{ statusFilterLabel(filter.labelKey) }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ error }}
        </p>

        <AgentsTable
          :agents="items"
          :is-loading="isLoading"
          @review="openReview"
        />

        <div
          v-if="meta && meta.last_page > 1"
          class="flex items-center justify-between border-t border-border/60 pt-4"
        >
          <p class="text-sm text-muted-foreground">
            {{ locale.t.agents.pagination
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
              {{ locale.t.agents.prev }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="meta.current_page >= meta.last_page || isLoading"
              @click="setPage(meta.current_page + 1)"
            >
              {{ locale.t.agents.next }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <AgentReviewDialog
      v-model:open="reviewOpen"
      :agent="reviewingAgent"
      :submitting="reviewSubmitting"
      :error="reviewError"
      @approve="onApprove"
      @reject="onReject"
    />
  </div>
</template>
