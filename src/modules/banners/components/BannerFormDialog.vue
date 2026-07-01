<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ImagePlus, Loader2, X } from '@lucide/vue'
import { getApiErrorMessage } from '@/core/api/api-error'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { useLocaleStore } from '@/core/i18n/locale.store'
import { fetchAgentOptions, uploadBannerImage } from '@/modules/banners/services/banners.service'
import type { AgentOption, Banner, BannerPayload, BannerType } from '@/modules/banners/types'

interface Props {
  banner: Banner | null
  open: boolean
  mode: 'create' | 'edit'
  submitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: BannerPayload]
  'save-edit': [id: number, payload: Partial<BannerPayload>]
}>()

const locale = useLocaleStore()

const form = ref({
  title: '',
  subtitle: '',
  type: 'agent' as BannerType,
  target_id: null as number | null,
  sort_order: 0,
  is_active: true,
})

const imageFileId = ref<number | null>(null)
const imagePreview = ref<string | null>(null)
const uploading = ref(false)
const uploadError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const agentOptions = ref<AgentOption[]>([])
const agentsLoading = ref(false)
const agentsLoaded = ref(false)

const typeOptions = computed(() => [
  { value: 'agent' as BannerType, label: locale.t.banners.types.agent },
  { value: 'product' as BannerType, label: locale.t.banners.types.product },
])

async function ensureAgentOptions() {
  if (agentsLoaded.value || agentsLoading.value) return
  agentsLoading.value = true
  try {
    agentOptions.value = await fetchAgentOptions()
    agentsLoaded.value = true
  }
  catch {
    // ignore — admin can retry by reopening
  }
  finally {
    agentsLoading.value = false
  }
}

// Lazy-load the agent list whenever the agent type is active.
watch(() => form.value.type, (type) => {
  if (type === 'agent') void ensureAgentOptions()
})

watch(() => [props.banner, props.mode, props.open] as const, ([banner, mode, open]) => {
  if (!open) return

  uploadError.value = null

  if (mode === 'create' || !banner) {
    form.value = { title: '', subtitle: '', type: 'agent', target_id: null, sort_order: 0, is_active: true }
    imageFileId.value = null
    imagePreview.value = null
    void ensureAgentOptions()
    return
  }

  form.value = {
    title: banner.title ?? '',
    subtitle: banner.subtitle ?? '',
    type: banner.type,
    target_id: banner.target_id,
    sort_order: banner.sort_order,
    is_active: banner.is_active,
  }
  imageFileId.value = banner.image_file_id
  imagePreview.value = banner.image
  if (banner.type === 'agent') void ensureAgentOptions()
}, { immediate: true })

function close() {
  emit('update:open', false)
}

function pickImage() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = null

  try {
    const uploaded = await uploadBannerImage(file)
    imageFileId.value = uploaded.id
    imagePreview.value = uploaded.url
  }
  catch (err) {
    uploadError.value = getApiErrorMessage(err)
  }
  finally {
    uploading.value = false
    target.value = ''
  }
}

function removeImage() {
  imageFileId.value = null
  imagePreview.value = null
}

const targetError = ref<string | null>(null)

function onSubmit() {
  if (props.submitting || uploading.value) return

  if (imageFileId.value === null) {
    uploadError.value = locale.t.banners.form.imageRequired
    return
  }

  if (!form.value.target_id || form.value.target_id < 1) {
    targetError.value = locale.t.banners.form.targetRequired
    return
  }
  targetError.value = null

  const base = {
    title: form.value.title.trim() || null,
    subtitle: form.value.subtitle.trim() || null,
    type: form.value.type,
    target_id: form.value.target_id,
    sort_order: form.value.sort_order,
    is_active: form.value.is_active,
  }

  if (props.mode === 'create') {
    emit('save', { ...base, image_file_id: imageFileId.value })
    return
  }

  if (props.banner) {
    emit('save-edit', props.banner.id, { ...base, image_file_id: imageFileId.value })
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Close"
        @click="close"
      />

      <div class="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <h2 class="text-lg font-semibold">
          {{ mode === 'create' ? locale.t.banners.form.createTitle : locale.t.banners.form.editTitle }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ locale.t.banners.form.subtitle }}
        </p>

        <form class="mt-5 space-y-4" @submit.prevent="onSubmit">
          <!-- Image upload -->
          <div class="space-y-2">
            <Label>{{ locale.t.banners.form.image }}</Label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            >

            <div
              v-if="imagePreview"
              class="relative overflow-hidden rounded-lg border border-border/60"
            >
              <img :src="imagePreview" alt="" class="aspect-[16/7] w-full object-cover">
              <button
                type="button"
                class="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                :aria-label="locale.t.banners.form.removeImage"
                @click="removeImage"
              >
                <X class="size-4" />
              </button>
            </div>

            <button
              v-else
              type="button"
              class="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-sm text-muted-foreground transition hover:border-brand/50 hover:bg-brand/5"
              :disabled="uploading"
              @click="pickImage"
            >
              <Loader2 v-if="uploading" class="size-5 animate-spin" />
              <ImagePlus v-else class="size-5" />
              <span>{{ uploading ? locale.t.banners.form.uploading : locale.t.banners.form.uploadHint }}</span>
            </button>

            <button
              v-if="imagePreview"
              type="button"
              class="text-xs font-medium text-brand hover:underline"
              :disabled="uploading"
              @click="pickImage"
            >
              {{ locale.t.banners.form.replaceImage }}
            </button>

            <p v-if="uploadError" class="text-sm text-destructive">
              {{ uploadError }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="title">{{ locale.t.banners.form.title }}</Label>
            <Input id="title" v-model="form.title" maxlength="120" />
          </div>

          <div class="space-y-2">
            <Label for="subtitle">{{ locale.t.banners.form.subtitleField }}</Label>
            <Input id="subtitle" v-model="form.subtitle" maxlength="160" />
          </div>

          <!-- Type -->
          <div class="space-y-2">
            <Label for="type">{{ locale.t.banners.form.type }}</Label>
            <select
              id="type"
              v-model="form.type"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Target: agent picker -->
          <div v-if="form.type === 'agent'" class="space-y-2">
            <Label for="agent_target">{{ locale.t.banners.form.agentTarget }}</Label>
            <select
              id="agent_target"
              v-model.number="form.target_id"
              :disabled="agentsLoading"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60"
            >
              <option :value="null" disabled>
                {{ agentsLoading ? locale.t.banners.form.agentLoading : locale.t.banners.form.agentPlaceholder }}
              </option>
              <option v-for="agent in agentOptions" :key="agent.id" :value="agent.id">
                {{ agent.company_name }}
              </option>
            </select>
          </div>

          <!-- Target: product id -->
          <div v-else class="space-y-2">
            <Label for="product_target">{{ locale.t.banners.form.productTarget }}</Label>
            <Input
              id="product_target"
              type="number"
              min="1"
              placeholder="123"
              :model-value="form.target_id ?? ''"
              @update:model-value="form.target_id = $event === '' || $event == null ? null : Number($event)"
            />
            <p class="text-xs text-muted-foreground">
              {{ locale.t.banners.form.productHint }}
            </p>
          </div>

          <p v-if="targetError" class="text-sm text-destructive">
            {{ targetError }}
          </p>

          <div class="space-y-2">
            <Label for="sort_order">{{ locale.t.banners.form.sortOrder }}</Label>
            <Input id="sort_order" v-model.number="form.sort_order" type="number" min="0" />
          </div>

          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.is_active" type="checkbox" class="size-4 rounded border-input">
            {{ locale.t.banners.form.isActive }}
          </label>

          <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ error }}
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" @click="close">
              {{ locale.t.banners.form.cancel }}
            </Button>
            <Button type="submit" :disabled="submitting || uploading">
              {{ submitting ? locale.t.banners.form.saving : locale.t.banners.form.save }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
