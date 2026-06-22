import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    role?: string
    title?: string
    titleKey?: string
    subtitle?: string
    subtitleKey?: string
  }
}
