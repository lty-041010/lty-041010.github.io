<script setup lang="ts">
import { computed } from 'vue'
import { getArchive } from '@/utils/posts'
import { formatDate } from '@/utils/date'
import { useSeo } from '@/composables/useSeo'

const groups = computed(() => getArchive())
const total = computed(() => groups.value.reduce((n, g) => n + g.posts.length, 0))

useSeo(() => ({ title: '归档', description: '按年份浏览全部文章。' }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-5 pt-14">
    <header class="mb-10">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">归档</h1>
      <p class="mt-2 text-sm text-slate-400">共 {{ total }} 篇</p>
    </header>

    <div class="space-y-10 pb-8">
      <section v-for="g in groups" :key="g.year">
        <h2
          class="mb-4 font-mono text-sm tracking-widest text-slate-300 dark:text-slate-700"
        >
          {{ g.year }}
        </h2>

        <ul class="space-y-1">
          <li v-for="p in g.posts" :key="p.slug">
            <RouterLink
              :to="`/posts/${p.slug}`"
              class="group flex items-baseline gap-4 rounded-lg px-2 py-2 transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
            >
              <time
                class="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500"
                :datetime="p.date"
              >
                {{ formatDate(p.date, 'MM-DD') }}
              </time>
              <span
                class="text-sm text-slate-700 transition-colors group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400"
              >
                {{ p.title }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>