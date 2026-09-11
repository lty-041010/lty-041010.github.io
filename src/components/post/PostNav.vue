<script setup lang="ts">
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import type { Post } from '@/types/post'

defineProps<{
  prev?: Post
  next?: Post
}>()
</script>

<template>
  <nav
    v-if="prev || next"
    class="mt-16 grid gap-3 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800"
  >
    <RouterLink
      v-if="prev"
      :to="`/posts/${prev.slug}`"
      class="group flex flex-col gap-1 rounded-xl border border-slate-200/80 p-4 transition-colors hover:border-indigo-200 hover:bg-white dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900/50"
    >
      <span class="inline-flex items-center gap-1 text-xs text-slate-400">
        <ArrowLeft :size="12" /> 上一篇
      </span>
      <span
        class="line-clamp-2 text-sm font-medium text-slate-700 group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400"
      >
        {{ prev.title }}
      </span>
    </RouterLink>

    <RouterLink
      v-if="next"
      :to="`/posts/${next.slug}`"
      class="group flex flex-col items-end gap-1 rounded-xl border border-slate-200/80 p-4 text-right transition-colors hover:border-indigo-200 hover:bg-white sm:col-start-2 dark:border-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900/50"
    >
      <span class="inline-flex items-center gap-1 text-xs text-slate-400">
        下一篇 <ArrowRight :size="12" />
      </span>
      <span
        class="line-clamp-2 text-sm font-medium text-slate-700 group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400"
      >
        {{ next.title }}
      </span>
    </RouterLink>
  </nav>
</template>