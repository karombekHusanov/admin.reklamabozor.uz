import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'auth.login',
    component: () => import('@/modules/auth/pages/LoginPage.vue'),
    meta: { public: true },
  },
]
