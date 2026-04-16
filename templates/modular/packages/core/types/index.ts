export interface RuntimeEnv {
  apiBaseUrl: string
  appName: string
  appEnv: string
}

export interface ApiEnvelope<TData> {
  code: number
  message: string
  data: TData
}
