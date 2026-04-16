import type { RouteRecordRaw } from 'vue-router'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/system/AboutView.vue'),
  },
]
