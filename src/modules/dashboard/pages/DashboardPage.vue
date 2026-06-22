<script setup lang="ts">
import type { Component } from 'vue'
import { Megaphone, ShoppingCart, UsersRound } from '@lucide/vue'
import { Badge } from '@/core/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/ui/card'
import { cn } from '@/core/lib/utils'

type StatAccent = 'primary' | 'brand'

const stats: {
  label: string
  value: string
  icon: Component
  hint: string
  accent: StatAccent
  badge?: string
}[] = [
  { label: 'Total users', value: '—', icon: UsersRound, hint: 'Connect to backend', accent: 'primary' },
  { label: 'Active agents', value: '—', icon: Megaphone, hint: 'Connect to backend', accent: 'brand', badge: 'Live' },
  { label: 'Open orders', value: '—', icon: ShoppingCart, hint: 'Connect to backend', accent: 'brand' },
]

const accentStyles: Record<StatAccent, string> = {
  primary: 'bg-primary/10 text-primary ring-primary/15',
  brand: 'bg-brand/12 text-brand ring-brand/20',
}
</script>

<template>
  <div class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="stat in stats"
        :key="stat.label"
        class="border-border/60 shadow-sm transition-shadow hover:shadow-md"
      >
        <CardHeader class="flex-row items-start justify-between space-y-0 pb-2">
          <div class="space-y-1">
            <CardTitle class="text-sm font-medium text-muted-foreground">
              {{ stat.label }}
            </CardTitle>
            <Badge v-if="stat.badge" variant="brand" class="text-[10px]">
              {{ stat.badge }}
            </Badge>
          </div>
          <div
            :class="cn(
              'flex size-9 items-center justify-center rounded-lg ring-1 ring-inset',
              accentStyles[stat.accent],
            )"
          >
            <component :is="stat.icon" class="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            :class="cn(
              'text-3xl font-bold tracking-tight',
              stat.accent === 'brand' ? 'text-brand' : 'text-primary',
            )"
          >
            {{ stat.value }}
          </div>
          <p class="mt-1 text-xs text-muted-foreground">
            {{ stat.hint }}
          </p>
        </CardContent>
      </Card>
    </div>

    <Card class="overflow-hidden border-border/60 shadow-sm">
      <div class="h-1 bg-gradient-to-r from-primary via-primary/80 to-brand" />
      <CardHeader>
        <div class="flex items-center gap-2">
          <CardTitle>Getting started</CardTitle>
          <Badge variant="muted">
            Guide
          </Badge>
        </div>
        <CardDescription>
          The auth flow is wired up. Add new modules under <code class="rounded bg-brand-muted/60 px-1.5 py-0.5 text-xs text-brand">src/modules/</code>
          and register their routes inside <code class="rounded bg-brand-muted/60 px-1.5 py-0.5 text-xs text-brand">modules/shell/routes</code>.
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
</template>
