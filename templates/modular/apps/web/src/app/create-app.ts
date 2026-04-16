import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import { installHttp } from './providers/http'
import { router } from './router'
import './styles/index.css'

export function createWebApp() {
  const app = createApp(App)
  const pinia = createPinia()

  pinia.use(piniaPluginPersistedstate)
  installHttp()

  app.use(pinia)
  app.use(router)

  return app
}
