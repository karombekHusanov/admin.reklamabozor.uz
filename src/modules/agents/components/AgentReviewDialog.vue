<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ExternalLink } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Button } from '@/core/ui/button'
import { Label } from '@/core/ui/label'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { AgentProfile, AgentProfileStatus } from '@/modules/agents/types'

interface Props {
  agent: AgentProfile | null
  open: boolean
  submitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  approve: [id: number]
  reject: [id: number, reason: string]
}>()

const locale = useLocaleStore()
const rejectionReason = ref('')

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    rejectionReason.value = ''
  }
})

const categoryNames = computed(() =>
  props.agent?.categories?.map(c => c.name_uz).join(', ') ?? '—',
)

const applicantName = computed(() => {
  const u = props.agent?.user
  if (!u) return '—'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || '—'
})

function close() {
  emit('update:open', false)
}

function onApprove() {
  if (!props.agent || props.submitting) return
  emit('approve', props.agent.id)
}

function onReject() {
  if (!props.agent || props.submitting) return
  emit('reject', props.agent.id, rejectionReason.value.trim())
}

function statusLabel(status: AgentProfileStatus) {
  return locale.t.agents.status[status]
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && agent"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Close"
        @click="close"
      />

      <div class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-3">
            <img
              v-if="agent.company_logo"
              :src="agent.company_logo"
              alt=""
              class="size-12 shrink-0 rounded-lg object-cover"
            >
            <div class="min-w-0">
              <h2 class="truncate text-lg font-semibold">
                {{ agent.company_name }}
              </h2>
              <p class="mt-0.5 text-sm text-muted-foreground">
                {{ agent.legal_form || locale.t.agents.review.subtitle }}
              </p>
            </div>
          </div>
          <Badge class="shrink-0 capitalize">
            {{ statusLabel(agent.status) }}
          </Badge>
        </div>

        <!-- Completion -->
        <div class="mt-4">
          <div class="mb-1 flex items-center justify-between text-xs">
            <span class="font-medium text-muted-foreground">{{ locale.t.agents.review.completion }}</span>
            <span class="font-semibold text-brand">{{ agent.completion_percent }}%</span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-muted">
            <div class="h-full rounded-full bg-brand transition-all" :style="{ width: `${agent.completion_percent}%` }" />
          </div>
        </div>

        <!-- KYC -->
        <div class="mt-5 border-t border-border/60 pt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {{ locale.t.agents.review.kyc }}
          </p>
          <div class="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.applicant }}</p>
              <p class="mt-0.5 text-sm">{{ applicantName }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.phone }}</p>
              <p class="mt-0.5 text-sm">{{ agent.phone }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.inn }}</p>
              <p class="mt-0.5 text-sm">{{ agent.inn || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.legalForm }}</p>
              <p class="mt-0.5 text-sm">{{ agent.legal_form || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.director }}</p>
              <p class="mt-0.5 text-sm">{{ agent.director_name || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.passport }}</p>
              <p class="mt-0.5 text-sm">{{ agent.director_passport || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.bank }}</p>
              <p class="mt-0.5 text-sm">{{ agent.bank_name || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.account }} / {{ locale.t.agents.review.mfo }}</p>
              <p class="mt-0.5 text-sm">{{ agent.bank_account || '—' }} · {{ agent.mfo || '—' }}</p>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <a
              v-if="agent.director_passport_file"
              :href="agent.director_passport_file"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium"
            >
              <ExternalLink class="size-3.5" />
              {{ locale.t.agents.review.passportScan }}
            </a>
            <a
              v-if="agent.registration_certificate_file"
              :href="agent.registration_certificate_file"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium"
            >
              <ExternalLink class="size-3.5" />
              {{ locale.t.agents.review.certificate }}
            </a>
          </div>
        </div>

        <!-- Presentation -->
        <div class="mt-5 border-t border-border/60 pt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {{ locale.t.agents.review.presentation }}
          </p>
          <div class="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.location }}</p>
              <p class="mt-0.5 text-sm">{{ agent.location_label || '—' }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.website }}</p>
              <p class="mt-0.5 truncate text-sm">{{ agent.website_url || '—' }}</p>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.categories }}</p>
            <p class="mt-0.5 text-sm">{{ categoryNames }}</p>
          </div>
          <div v-if="agent.bio" class="mt-3">
            <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.bio }}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">{{ agent.bio }}</p>
          </div>
          <div v-if="agent.results_text" class="mt-3">
            <p class="text-xs text-muted-foreground">{{ locale.t.agents.review.results }}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">{{ agent.results_text }}</p>
          </div>
        </div>

        <div v-if="agent.rejection_reason" class="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ agent.rejection_reason }}
        </div>

        <div v-if="agent.status === 'pending'" class="mt-6 space-y-4 border-t border-border/60 pt-5">
          <div class="space-y-2">
            <Label for="rejection_reason">{{ locale.t.agents.review.rejectionReason }}</Label>
            <textarea
              id="rejection_reason"
              v-model="rejectionReason"
              rows="3"
              class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :placeholder="locale.t.agents.review.rejectionPlaceholder"
            />
          </div>

          <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ error }}
          </p>

          <div class="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" @click="close">
              {{ locale.t.agents.review.cancel }}
            </Button>
            <Button
              type="button"
              variant="outline"
              class="text-destructive"
              :disabled="submitting || !rejectionReason.trim()"
              @click="onReject"
            >
              {{ locale.t.agents.review.reject }}
            </Button>
            <Button type="button" variant="brand" :disabled="submitting" @click="onApprove">
              {{ locale.t.agents.review.approve }}
            </Button>
          </div>
        </div>

        <div v-else class="mt-6 flex justify-end border-t border-border/60 pt-5">
          <Button type="button" variant="outline" @click="close">
            {{ locale.t.agents.review.close }}
          </Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
