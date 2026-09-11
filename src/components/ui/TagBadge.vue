<script setup lang="ts">
defineProps<{
  name: string
  count?: number
}>()
</script>

<template>
  <RouterLink
    :to="`/tags/${encodeURIComponent(name)}`"
    class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
  >
    <span>{{ name }}</span>
    <span v-if="count !== undefined" class="text-[10px] opacity-60">{{ count }}</span>
  </RouterLink>
</template>