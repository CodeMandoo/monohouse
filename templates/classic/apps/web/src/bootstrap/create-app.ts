import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@/plugins'
import router from '@/router'
import '@/styles/index.css'

export function createAppInstance() {
  const app = createApp(App)
  const pinia = createPinia()

  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  app.use(router)

  registerPlugins(app)

  return app
}
