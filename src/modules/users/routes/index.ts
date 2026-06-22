import type { RouteRecordRaw } from 'vue-router'
import { agentsRoutes } from '@/modules/agents/routes'
import { USER_ROLE_CONFIGS } from '@/modules/users/constants/roles'

const SEGMENT_BY_ROLE = {
  client: 'clients',
  agent: 'agents',
  designer: 'designers',
  seller: 'sellers',
} as const

const USER_LIST_ROLES = USER_ROLE_CONFIGS.filter(config => config.role !== 'agent')

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    redirect: { name: 'users.clients' },
  },
  ...USER_LIST_ROLES.map(config => ({
    path: `users/${SEGMENT_BY_ROLE[config.role as keyof typeof SEGMENT_BY_ROLE]}`,
    name: config.routeName,
    component: () => import('@/modules/users/pages/UsersListPage.vue'),
    meta: {
      role: config.role,
      titleKey: config.titleKey,
      subtitleKey: config.subtitleKey,
    },
  })),
  ...agentsRoutes,
]
