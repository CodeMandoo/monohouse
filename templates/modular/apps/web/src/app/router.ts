import { createRouter, createWebHistory } from 'vue-router'

import { routes } from '@/pages/routes'

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
