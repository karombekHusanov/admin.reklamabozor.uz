<script setup lang="ts">
import Sidebar from '@/modules/shell/components/Sidebar.vue'
import TopBar from '@/modules/shell/components/TopBar.vue'
import { provideSidebar } from '@/modules/shell/composables/useSidebar'

provideSidebar()
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-background">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <TopBar />
      <main class="flex-1 overflow-y-auto bg-muted/30 p-4 sm:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
