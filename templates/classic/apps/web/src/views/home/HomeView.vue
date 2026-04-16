<script setup lang="ts">
import { MfPanel } from '@monohouse/ui'

import OverviewCard from '@/components/business/OverviewCard.vue'
import { useTitle } from '@/hooks'
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'
import { useAppStore } from '@/stores'
import { formatMetric } from '@/utils'

useTitle('MonoHouse Web')

const appStore = useAppStore()

const cards = [
  {
    title: 'Applications',
    value: formatMetric(2),
    description: 'Traditional layered apps under apps/*',
  },
  {
    title: 'Packages',
    value: formatMetric(6),
    description: 'Shared infrastructure under packages/*',
  },
  {
    title: 'Pattern',
    value: 'Layered',
    description: 'api / components / hooks / stores / views',
  },
]
</script>

<template>
  <DefaultLayout>
    <MfPanel>
      <h2 class="m-0 text-8 font-700 text-slate-900">{{ appStore.appName }}</h2>
      <p class="mt-3 text-4 text-slate-600">
        Traditional frontend layering inside a monorepo workspace.
      </p>
    </MfPanel>

    <section class="mt-6 grid gap-4 md:grid-cols-3">
      <OverviewCard
        v-for="card in cards"
        :key="card.title"
        :description="card.description"
        :title="card.title"
        :value="card.value"
      />
    </section>
  </DefaultLayout>
</template>
