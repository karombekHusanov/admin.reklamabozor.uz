import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes, useAuthStore } from '@/modules/auth'
import { ROUTES, shellRoutes } from '@/modules/shell'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    ...shellRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: ROUTES.dashboard,
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  await auth.bootstrap()

  const isPublic = to.matched.some((record) => record.meta.public)

  if (isPublic) {
    if (auth.isAuthenticated && to.name === 'auth.login') {
      return { path: ROUTES.dashboard }
    }
    return true
  }

  if (!auth.isAuthenticated) {
    return {
      path: ROUTES.login,
      query: to.fullPath !== ROUTES.login ? { redirect: to.fullPath } : undefined,
    }
  }

  return true
})

export default router
