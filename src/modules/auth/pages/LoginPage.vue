<script setup lang="ts">
import { LockKeyhole, Mail } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/core/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { Input } from '@/core/ui/input'
import { Label } from '@/core/ui/label'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (submitting.value) return
  submitting.value = true

  try {
    await auth.login(email.value, password.value)
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    await router.replace(redirect)
  }
  catch {
    // error message surfaced through the store
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,oklch(0.94_0.06_286),var(--background)_50%),radial-gradient(ellipse_at_bottom_right,oklch(0.96_0.05_35),transparent_45%)] px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-2 text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-md">
          <LockKeyhole class="size-6" />
        </div>
        <CardTitle class="text-2xl">
          AdSpace Admin
        </CardTitle>
        <CardDescription>
          Sign in with your administrator credentials
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <div class="relative">
              <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="admin@reklamabozori.uz"
                autocomplete="email"
                required
                class="pl-9"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <div class="relative">
              <LockKeyhole class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                class="pl-9"
              />
            </div>
          </div>

          <p
            v-if="auth.error"
            class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {{ auth.error }}
          </p>

          <Button type="submit" class="w-full" :disabled="submitting || auth.isLoading">
            {{ submitting || auth.isLoading ? 'Signing in…' : 'Sign in' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
