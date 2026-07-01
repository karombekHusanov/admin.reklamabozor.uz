import type { RouteRecordRaw } from 'vue-router'
import { bannersRoutes } from '@/modules/banners'
import { categoriesRoutes } from '@/modules/categories'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { ordersRoutes } from '@/modules/orders'
import { usersRoutes } from '@/modules/users'

export const shellRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/modules/shell/layouts/AdminLayout.vue'),
    children: [
      ...dashboardRoutes,
      ...usersRoutes,
      ...ordersRoutes,
      ...categoriesRoutes,
      ...bannersRoutes,
    ],
  },
]
