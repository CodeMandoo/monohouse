import type { ApiEnvelope } from '@monohouse/core'

import { httpClient } from '../clients/http'

export interface OverviewPayload {
  projects: number
  modules: number
  apps: number
}

export async function getOverview() {
  const { data } = await httpClient.get<ApiEnvelope<OverviewPayload>>('/overview')
  return data
}
