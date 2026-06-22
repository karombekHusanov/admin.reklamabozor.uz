import type { RouteRecordRaw } from 'vue-router'

export const agentsRoutes: RouteRecordRaw[] = [
  {
    path: 'users/agents',
    name: 'users.agents',
    component: () => import('@/modules/agents/pages/AgentsPage.vue'),
    meta: {
      titleKey: 'pages.users.agents.title',
      subtitleKey: 'pages.users.agents.subtitle',
    },
  },
]
