import type { App } from 'vue'

import { registerDirectives } from '@/directives'

export function registerPlugins(app: App) {
  registerDirectives(app)
}
