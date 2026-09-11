<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next'
import type { Post } from '@/types/post'
import { formatDate } from '@/utils/date'
import TagBadge from './TagBadge.vue'

defineProps<{ post: Post }>()
</script>

<template>
  <article
    class="group rounded-xl border border-slate-200/80 bg-white/50 p-5 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900/60"
  >
    <RouterLink :to="`/posts/${post.slug}`" class="block">
      <h3
        class="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400"
      >
        {{ post.title }}
      </h3>
      <p
        v-if="post.summary"
        class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
      >
        {{ post.summary }}
      </p>
    </RouterLink>

    <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
      <span class="inline-flex items-center gap-1">
        <Calendar :size="13" />
        {{ formatDate(post.date) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <Clock :size="13" />
        {{ post.readingTime }} 分钟
      </span>
    </div>

    <div v-if="post.tags.length" class="mt-3 flex flex-wrap gap-1.5">
      <TagBadge v-for="t in post.tags" :key="t" :name="t" />
    </div>
  </article>
</template>