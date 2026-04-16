import axios from 'axios'

import type { HttpConfig } from './types'

const client = axios.create()

export function configureHttp(config: HttpConfig) {
  client.defaults.baseURL = config.baseURL
  client.defaults.timeout = config.timeout

  if (config.headers) {
    Object.assign(client.defaults.headers.common, config.headers)
  }
}

export { client as httpClient }
