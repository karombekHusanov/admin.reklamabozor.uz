import type { RouteRecordRaw } from 'vue-router'

export const bannersRoutes: RouteRecordRaw[] = [
  {
    path: 'banners',
    name: 'banners',
    component: () => import('@/modules/banners/pages/BannersPage.vue'),
    meta: {
      titleKey: 'pages.banners.title',
      subtitleKey: 'pages.banners.subtitle',
    },
  },
]
