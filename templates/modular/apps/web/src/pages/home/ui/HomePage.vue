<script setup lang="ts">
import { AppShell } from '@/widgets/app-shell'
import { useAppInfoStore } from '@/entities/app-info/model/app-info.store'

const appInfo = useAppInfoStore()
</script>

<template>
  <AppShell>
    <template #title>
      {{ appInfo.title }}
    </template>

    <template #default>
      <section class="grid gap-4">
        <div class="rounded-4 bg-white p-6 shadow-sm">
          <h1 class="m-0 text-8 font-700">Generic Frontend Monorepo</h1>
          <p class="mt-3 text-4 color-slate-600">
            业务代码应该从这个壳上长出来，而不是反过来污染工程层。
          </p>
        </div>

        <div class="rounded-4 bg-white p-6 shadow-sm">
          <h2 class="m-0 text-5 font-600">Suggested Layers</h2>
          <p class="mt-3 text-4 color-slate-600">
            pages -> widgets -> features -> entities -> shared
          </p>
        </div>
      </section>
    </template>
  </AppShell>
</template>
