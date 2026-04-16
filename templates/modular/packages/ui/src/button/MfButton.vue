<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
  }>(),
  {
    variant: 'primary',
  }
)
</script>

<template>
  <button
    class="inline-flex cursor-pointer items-center rounded-3 border-0 px-4 py-2 text-3 font-600"
    :class="variant === 'primary' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-900'"
  >
    <slot />
  </button>
</template>
