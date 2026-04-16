import { configureHttp, httpClient } from '@monohouse/http'

configureHttp({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
})

export { httpClient }
