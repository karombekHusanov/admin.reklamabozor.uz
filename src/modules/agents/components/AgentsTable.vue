<script setup lang="ts">
import { Eye } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { useLocaleStore } from '@/core/i18n/locale.store'
import { cn } from '@/core/lib/utils'
import type { AgentProfile, AgentProfileStatus } from '@/modules/agents/types'

interface Props {
  agents: AgentProfile[]
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  review: [agent: AgentProfile]
}>()

const locale = useLocaleStore()

function applicantName(agent: AgentProfile) {
  const u = agent.user
  if (!u) return agent.company_name
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || agent.company_name
}

function statusVariant(status: AgentProfileStatus) {
  if (status === 'approved') return 'brand'
  if (status === 'rejected') return 'outline'
  return 'muted'
}

function statusLabel(status: AgentProfileStatus) {
  return locale.t.agents.status[status]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-border/60">
    <table class="w-full text-sm">
      <thead class="border-b bg-muted/40 text-left">
        <tr>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.agents.table.company }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
            {{ locale.t.agents.table.applicant }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">
            {{ locale.t.agents.table.categories }}
          </th>
          <th class="px-4 py-3 font-medium text-muted-foreground">
            {{ locale.t.agents.table.status }}
          </th>
          <th class="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
            {{ locale.t.agents.table.submitted }}
          </th>
          <th class="px-4 py-3 text-right font-medium text-muted-foreground">
            {{ locale.t.agents.table.actions }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.agents.loading }}
          </td>
        </tr>
        <tr v-else-if="agents.length === 0">
          <td colspan="6" class="px-4 py-10 text-center text-muted-foreground">
            {{ locale.t.agents.empty }}
          </td>
        </tr>
        <tr
          v-for="agent in agents"
          v-else
          :key="agent.id"
          :class="cn(
            'border-b border-border/40 transition-colors last:border-0 hover:bg-muted/20',
            agent.status === 'pending' && 'bg-brand/5',
          )"
        >
          <td class="px-4 py-3">
            <div class="font-medium">{{ agent.company_name }}</div>
            <div class="text-xs text-muted-foreground">{{ agent.phone }}</div>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground md:table-cell">
            {{ applicantName(agent) }}
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground lg:table-cell">
            {{ agent.categories?.length ?? 0 }}
          </td>
          <td class="px-4 py-3">
            <Badge :variant="statusVariant(agent.status)" class="capitalize">
              {{ statusLabel(agent.status) }}
            </Badge>
          </td>
          <td class="hidden px-4 py-3 text-muted-foreground sm:table-cell">
            {{ formatDate(agent.created_at) }}
          </td>
          <td class="px-4 py-3 text-right">
            <Button variant="ghost" size="sm" @click="emit('review', agent)">
              <Eye class="size-4" />
              {{ locale.t.agents.actions.review }}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
