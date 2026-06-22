export const ROUTES = {
  dashboard: '/',
  usersClients: '/users/clients',
  usersAgents: '/users/agents',
  usersDesigners: '/users/designers',
  usersSellers: '/users/sellers',
  orders: '/orders',
  categories: '/categories',
  profile: '/profile',
  login: '/login',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
