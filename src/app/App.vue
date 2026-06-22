<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/modules/auth'

const auth = useAuthStore()

onBeforeMount(() => {
  void auth.bootstrap()
})
</script>

<template>
  <RouterView />
</template>
