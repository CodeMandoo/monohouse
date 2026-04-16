import type { AxiosRequestConfig } from 'axios'

export interface HttpConfig extends AxiosRequestConfig {
  baseURL: string
}
