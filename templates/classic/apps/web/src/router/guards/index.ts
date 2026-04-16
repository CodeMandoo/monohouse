import type { Router } from 'vue-router'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to) => {
    if (to.meta?.title) {
      document.title = String(to.meta.title)
    }
  })
}
