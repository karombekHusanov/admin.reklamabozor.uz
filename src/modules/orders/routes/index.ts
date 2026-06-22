import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'orders',
    component: () => import('@/modules/orders/pages/OrdersPage.vue'),
    meta: {
      titleKey: 'pages.orders.title',
      subtitleKey: 'pages.orders.subtitle',
    },
  },
]
