import type { RouteRecordRaw } from 'vue-router'

export const categoriesRoutes: RouteRecordRaw[] = [
  {
    path: 'categories',
    name: 'categories',
    component: () => import('@/modules/categories/pages/CategoriesPage.vue'),
    meta: {
      titleKey: 'pages.categories.title',
      subtitleKey: 'pages.categories.subtitle',
    },
  },
]
