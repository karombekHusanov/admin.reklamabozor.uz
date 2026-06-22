import type { Role } from '@/modules/auth'

export interface UserRoleConfig {
  role: Role
  routeName: string
  path: string
  titleKey: string
  subtitleKey: string
  emptyKey: string
}

export const USER_ROLE_CONFIGS: UserRoleConfig[] = [
  {
    role: 'client',
    routeName: 'users.clients',
    path: '/users/clients',
    titleKey: 'pages.users.clients.title',
    subtitleKey: 'pages.users.clients.subtitle',
    emptyKey: 'pages.users.clients.empty',
  },
  {
    role: 'agent',
    routeName: 'users.agents',
    path: '/users/agents',
    titleKey: 'pages.users.agents.title',
    subtitleKey: 'pages.users.agents.subtitle',
    emptyKey: 'pages.users.agents.empty',
  },
  {
    role: 'designer',
    routeName: 'users.designers',
    path: '/users/designers',
    titleKey: 'pages.users.designers.title',
    subtitleKey: 'pages.users.designers.subtitle',
    emptyKey: 'pages.users.designers.empty',
  },
  {
    role: 'seller',
    routeName: 'users.sellers',
    path: '/users/sellers',
    titleKey: 'pages.users.sellers.title',
    subtitleKey: 'pages.users.sellers.subtitle',
    emptyKey: 'pages.users.sellers.empty',
  },
]

export function getUserRoleConfig(role: Role) {
  return USER_ROLE_CONFIGS.find(c => c.role === role)
}
