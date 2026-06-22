<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { Category, CategoryPayload, CategoryType } from '@/modules/categories/types'

interface Props {
  category: Category | null
  open: boolean
  mode: 'create' | 'edit'
  submitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [payload: CategoryPayload]
  'save-edit': [id: number, payload: Partial<CategoryPayload>]
}>()

const locale = useLocaleStore()

const form = ref({
  name_uz: '',
  name_ru: '',
  type: 'agent' as CategoryType,
  sort_order: 0,
  is_active: true,
})

const typeOptions = computed(() => [
  { value: 'agent' as CategoryType, label: locale.t.categories.types.agent },
  { value: 'designer' as CategoryType, label: locale.t.categories.types.designer },
])

watch(() => [props.category, props.mode, props.open] as const, ([category, mode]) => {
  if (mode === 'create') {
    form.value = {
      name_uz: '',
      name_ru: '',
      type: 'agent',
      sort_order: 0,
      is_active: true,
    }
    return
  }

  if (!category) return

  form.value = {
    name_uz: category.name_uz,
    name_ru: category.name_ru,
    type: category.type,
    sort_order: category.sort_order,
    is_active: category.is_active,
  }
}, { immediate: true })

function close() {
  emit('update:open', false)
}

function onSubmit() {
  if (props.submitting) return

  const payload: CategoryPayload = {
    name_uz: form.value.name_uz,
    name_ru: form.value.name_ru,
    type: form.value.type,
    sort_order: form.value.sort_order,
    is_active: form.value.is_active,
  }

  if (props.mode === 'create') {
    emit('save', payload)
    return
  }

  if (props.category) {
    emit('save-edit', props.category.id, payload)
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

      <div class="relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
        <h2 class="text-lg font-semibold">
          {{ mode === 'create' ? locale.t.categories.form.createTitle : locale.t.categories.form.editTitle }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ locale.t.categories.form.subtitle }}
        </p>

        <form class="mt-5 space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="name_uz">{{ locale.t.categories.form.nameUz }}</Label>
            <Input id="name_uz" v-model="form.name_uz" required />
          </div>

          <div class="space-y-2">
            <Label for="name_ru">{{ locale.t.categories.form.nameRu }}</Label>
            <Input id="name_ru" v-model="form.name_ru" required />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="type">{{ locale.t.categories.form.type }}</Label>
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

            <div class="space-y-2">
              <Label for="sort_order">{{ locale.t.categories.form.sortOrder }}</Label>
              <Input id="sort_order" v-model.number="form.sort_order" type="number" min="0" />
            </div>
          </div>

          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.is_active" type="checkbox" class="size-4 rounded border-input">
            {{ locale.t.categories.form.isActive }}
          </label>

          <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ error }}
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" @click="close">
              {{ locale.t.categories.form.cancel }}
            </Button>
            <Button type="submit" :disabled="submitting">
              {{ submitting ? locale.t.categories.form.saving : locale.t.categories.form.save }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
