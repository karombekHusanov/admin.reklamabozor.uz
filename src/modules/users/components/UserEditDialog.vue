<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/core/ui/button'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { useLocaleStore } from '@/core/i18n/locale.store'
import type { Role, User } from '@/modules/auth'
import type { UpdateUserPayload } from '@/modules/users/types'

interface Props {
  user: User | null
  open: boolean
  submitting?: boolean
  error?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [id: number, payload: UpdateUserPayload]
}>()

const locale = useLocaleStore()

const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  role: 'client' as Role,
})

const roleOptions = [
  { value: 'client' as Role, labelKey: 'clients' },
  { value: 'agent' as Role, labelKey: 'agents' },
  { value: 'designer' as Role, labelKey: 'designers' },
  { value: 'seller' as Role, labelKey: 'sellers' },
] as const

watch(() => props.user, (user) => {
  if (!user) return
  form.value = {
    first_name: user.first_name,
    last_name: user.last_name ?? '',
    username: user.username ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    role: user.role === 'admin' ? 'client' : user.role,
  }
}, { immediate: true })

function close() {
  emit('update:open', false)
}

function onSubmit() {
  if (!props.user || props.submitting) return

  emit('save', props.user.id, {
    first_name: form.value.first_name,
    last_name: form.value.last_name || null,
    username: form.value.username || null,
    email: form.value.email || null,
    phone: form.value.phone || null,
    role: form.value.role,
  })
}

function roleLabel(key: 'clients' | 'agents' | 'designers' | 'sellers') {
  return locale.t.nav[key]
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && user"
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
          {{ locale.t.users.edit.title }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ locale.t.users.edit.subtitle }}
        </p>

        <form class="mt-5 space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="first_name">{{ locale.t.users.form.firstName }}</Label>
              <Input id="first_name" v-model="form.first_name" required />
            </div>
            <div class="space-y-2">
              <Label for="last_name">{{ locale.t.users.form.lastName }}</Label>
              <Input id="last_name" v-model="form.last_name" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="username">{{ locale.t.users.form.username }}</Label>
            <Input id="username" v-model="form.username" />
          </div>

          <div class="space-y-2">
            <Label for="email">{{ locale.t.users.form.email }}</Label>
            <Input id="email" v-model="form.email" type="email" />
          </div>

          <div class="space-y-2">
            <Label for="phone">{{ locale.t.users.form.phone }}</Label>
            <Input id="phone" v-model="form.phone" />
          </div>

          <div class="space-y-2">
            <Label for="role">{{ locale.t.users.form.role }}</Label>
            <select
              id="role"
              v-model="form.role"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option
                v-for="option in roleOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ roleLabel(option.labelKey) }}
              </option>
            </select>
          </div>

          <p v-if="error" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {{ error }}
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" @click="close">
              {{ locale.t.users.edit.cancel }}
            </Button>
            <Button type="submit" :disabled="submitting">
              {{ submitting ? locale.t.users.edit.saving : locale.t.users.edit.save }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
