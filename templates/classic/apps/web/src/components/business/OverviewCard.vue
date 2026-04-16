<script setup lang="ts">
defineProps<{
  title: string
  value: string
  description: string
}>()
</script>

<template>
  <BaseCard>
    <p class="m-0 text-3 uppercase tracking-[0.2em] text-slate-500">{{ title }}</p>
    <p class="mt-4 text-10 font-700 text-slate-900">{{ value }}</p>
    <p class="mt-2 text-4 text-slate-600">{{ description }}</p>
  </BaseCard>
</template>
