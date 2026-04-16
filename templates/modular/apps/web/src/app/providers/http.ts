import { configureHttp } from '@monohouse/http'

export function installHttp() {
  configureHttp({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 15000,
  })
}
