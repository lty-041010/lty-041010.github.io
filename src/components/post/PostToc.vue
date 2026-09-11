<script setup lang="ts">
import type { TocItem } from '@/types/post'

defineProps<{
  items: TocItem[]
  activeId: string
}>()
</script>

<template>
  <nav v-if="items.length" class="text-sm">
    <p class="mb-3 text-xs font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
      目录
    </p>
    <ul class="space-y-1.5 border-l border-slate-200 dark:border-slate-800">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          class="block border-l-2 py-1 pr-2 leading-snug transition-colors"
          :class="[
            item.level === 3 ? 'pl-6' : item.level === 2 ? 'pl-4' : 'pl-3',
            activeId === item.id
              ? 'border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:border-slate-300 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300',
          ]"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>