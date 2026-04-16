import type { RuntimeEnv } from '../types'

export function createEnv(source: Record<string, unknown>): RuntimeEnv {
  return {
    apiBaseUrl: String(source.VITE_API_BASE_URL ?? '/api'),
    appName: String(source.VITE_APP_NAME ?? 'MonoHouse'),
    appEnv: String(source.MODE ?? 'development'),
  }
}
