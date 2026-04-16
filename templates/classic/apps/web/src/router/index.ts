import { createRouter, createWebHistory } from 'vue-router'

import { setupRouterGuards } from './guards'
import { homeRoutes } from './modules/home'

const router = createRouter({
  history: createWebHistory(),
  routes: homeRoutes,
})

setupRouterGuards(router)

export default router
