<script setup lang="ts">
import TagBadge from '@/components/ui/TagBadge.vue'
import { getAllTags } from '@/utils/posts'
import { useSeo } from '@/composables/useSeo'

const tags = getAllTags()
useSeo(() => ({ title: '标签', description: '按标签浏览全部文章。' }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-5 pt-14">
    <header class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">标签</h1>
      <p class="mt-2 text-sm text-slate-400">共 {{ tags.length }} 个标签</p>
    </header>

    <div v-if="tags.length" class="flex flex-wrap gap-2">
      <TagBadge v-for="t in tags" :key="t.name" :name="t.name" :count="t.count" />
    </div>
    <p v-else class="py-20 text-center text-sm text-slate-400">还没有标签</p>
  </div>
</template>