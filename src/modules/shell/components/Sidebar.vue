<script setup lang="ts">
import {
  Brush,
  ChartLine,
  GalleryHorizontalEnd,
  LayoutDashboard,
  PanelLeftClose,
  ShoppingCart,
  Store,
  Tags,
  UserRound,
  UsersRound,
} from '@lucide/vue'
import type { Component } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocaleStore } from '@/core/i18n/locale.store'
import { cn } from '@/core/lib/utils'
import ProfileMenu from '@/modules/shell/components/ProfileMenu.vue'
import SidebarNavGroup from '@/modules/shell/components/SidebarNavGroup.vue'
import { SHELL_HEADER_HEIGHT } from '@/modules/shell/constants/layout'
import { ROUTES } from '@/modules/shell/constants/routes'
import { useSidebar } from '@/modules/shell/composables/useSidebar'

const route = useRoute()
const locale = useLocaleStore()
const { isExpanded, isMobile, isMobileOpen, toggleCollapsed, closeMobile } = useSidebar()

const sidebarCollapsed = computed(() => !isExpanded.value)

const usersItems = computed(() => [
  { to: ROUTES.usersClients, label: locale.t.nav.clients, icon: UserRound },
  { to: ROUTES.usersAgents, label: locale.t.nav.agents, icon: UsersRound },
  { to: ROUTES.usersDesigners, label: locale.t.nav.designers, icon: Brush },
  { to: ROUTES.usersSellers, label: locale.t.nav.sellers, icon: Store },
])

const marketplaceItems = computed(() => [
  { to: ROUTES.orders, label: locale.t.nav.orders, icon: ShoppingCart },
  { to: ROUTES.categories, label: locale.t.nav.categories, icon: Tags },
  { to: ROUTES.banners, label: locale.t.nav.banners, icon: GalleryHorizontalEnd },
])

const activePath = computed(() => route.path)

function isActive(path: string) {
  if (path === ROUTES.dashboard) {
    return activePath.value === path
  }
  return activePath.value === path || activePath.value.startsWith(`${path}/`)
}

function navItemClass(active: boolean, collapsed: boolean) {
  return cn(
    'group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200',
    collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
    active
      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  )
}

function onNavClick() {
  if (isMobile.value) {
    closeMobile()
  }
}
</script>

<template>
  <!-- Mobile backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <button
      v-if="isMobile && isMobileOpen"
      type="button"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
      aria-label="Close sidebar"
      @click="closeMobile"
    />
  </Transition>

  <aside
    :class="cn(
      'fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width,transform] duration-300 ease-in-out lg:static lg:translate-x-0',
      isExpanded ? 'w-64' : 'w-[4.5rem]',
      isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0',
    )"
  >
    <!-- Sidebar header -->
    <div
      :class="cn(
        SHELL_HEADER_HEIGHT,
        'flex shrink-0 items-center border-b border-sidebar-border',
        isExpanded ? 'justify-between px-4' : 'justify-center px-2',
      )"
    >
      <div
        v-if="isExpanded"
        class="flex min-w-0 items-center gap-3"
      >
        <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-brand text-white shadow-sm">
          <ChartLine class="size-5" />
        </div>
        <div class="min-w-0 leading-tight">
          <p class="truncate text-sm font-semibold">
            {{ locale.t.brand.name }}
          </p>
          <p class="truncate text-xs text-muted-foreground">
            {{ locale.t.brand.tagline }}
          </p>
        </div>
      </div>

      <div
        v-else
        class="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-brand text-white shadow-sm"
      >
        <ChartLine class="size-5" />
      </div>

      <button
        v-if="isExpanded"
        type="button"
        class="hidden size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:inline-flex"
        aria-label="Collapse sidebar"
        @click="toggleCollapsed"
      >
        <PanelLeftClose class="size-4" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
      <!-- Overview -->
      <div class="mb-2">
        <p
          v-if="isExpanded"
          class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
        >
          {{ locale.t.nav.overview }}
        </p>
        <p
          v-else
          class="mb-2 h-px bg-sidebar-border/60"
          aria-hidden="true"
        />
        <ul class="space-y-1">
          <li>
            <RouterLink
              :to="ROUTES.dashboard"
              :title="sidebarCollapsed ? locale.t.nav.dashboard : undefined"
              :class="navItemClass(isActive(ROUTES.dashboard), sidebarCollapsed)"
              @click="onNavClick"
            >
              <LayoutDashboard
                :class="cn(
                  'size-[1.125rem] shrink-0',
                  isActive(ROUTES.dashboard) ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                )"
              />
              <span v-if="isExpanded" class="truncate">{{ locale.t.nav.dashboard }}</span>
              <span
                v-if="isActive(ROUTES.dashboard) && isExpanded"
                class="absolute right-2 size-1.5 rounded-full bg-sidebar-primary-foreground/80"
              />
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Users (collapsible) -->
      <SidebarNavGroup
        :label="locale.t.nav.users"
        :icon="UsersRound"
        :items="usersItems"
        :sidebar-collapsed="sidebarCollapsed"
        storage-key="adspace_admin_nav_users_open"
      >
        <template #item="{ item, active, collapsed }">
          <RouterLink
            :to="item.to"
            :title="collapsed ? item.label : undefined"
            :class="navItemClass(active, collapsed)"
            @click="onNavClick"
          >
            <component
              :is="item.icon as Component"
              :class="cn(
                'size-[1.125rem] shrink-0',
                active ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
              )"
            />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
            <span
              v-if="active && !collapsed"
              class="absolute right-2 size-1.5 rounded-full bg-sidebar-primary-foreground/80"
            />
          </RouterLink>
        </template>
      </SidebarNavGroup>

      <!-- Marketplace (collapsible) -->
      <SidebarNavGroup
        :label="locale.t.nav.marketplace"
        :icon="ShoppingCart"
        :items="marketplaceItems"
        :sidebar-collapsed="sidebarCollapsed"
        storage-key="adspace_admin_nav_marketplace_open"
      >
        <template #item="{ item, active, collapsed }">
          <RouterLink
            :to="item.to"
            :title="collapsed ? item.label : undefined"
            :class="navItemClass(active, collapsed)"
            @click="onNavClick"
          >
            <component
              :is="item.icon as Component"
              :class="cn(
                'size-[1.125rem] shrink-0',
                active ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
              )"
            />
            <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
            <span
              v-if="active && !collapsed"
              class="absolute right-2 size-1.5 rounded-full bg-sidebar-primary-foreground/80"
            />
          </RouterLink>
        </template>
      </SidebarNavGroup>
    </nav>

    <!-- Sidebar footer -->
    <div
      class="shrink-0 border-t border-sidebar-border p-3"
      :class="!isExpanded && 'px-2'"
    >
      <ProfileMenu :collapsed="sidebarCollapsed" />
    </div>
  </aside>
</template>
