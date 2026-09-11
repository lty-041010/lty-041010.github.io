<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import PostCard from '@/components/ui/PostCard.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import { allPosts, getAllTags, getPostsByTag } from '@/utils/posts'
import { formatDate } from '@/utils/date'
import { useSeo } from '@/composables/useSeo'
import type { Post } from '@/types/post'

const props = defineProps<{ tag?: string }>()

const keyword = ref('')
const activeTag = computed(() => props.tag ?? '')

const basePosts = computed<Post[]>(() =>
  activeTag.value ? getPostsByTag(activeTag.value) : allPosts,
)

const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return basePosts.value
  return basePosts.value.filter((p) =>
    [p.title, p.summary, ...p.tags].join(' ').toLowerCase().includes(q),
  )
})

/** 按年份分组 */
const grouped = computed(() => {
  const map = new Map<string, Post[]>()
  for (const p of filtered.value) {
    const y = formatDate(p.date, 'YYYY')
    const list = map.get(y)
    if (list) list.push(p)
    else map.set(y, [p])
  }
  return [...map.entries()]
})

const tags = getAllTags()

useSeo(() => ({
  title: activeTag.value ? `标签：${activeTag.value}` : '文章',
  description: activeTag.value
    ? `标签「${activeTag.value}」下的全部文章。`
    : '全部文章列表，支持关键词搜索与标签筛选。',
}))
</script>

<template>
  <div class="mx-auto max-w-3xl px-5 pt-14">
    <header class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {{ activeTag ? `标签：${activeTag}` : '文章' }}
      </h1>
      <p class="mt-2 text-sm text-slate-400">
        共 {{ filtered.length }} 篇
      </p>
    </header>

    <!-- 搜索 -->
    <div class="relative mb-6">
      <Search
        :size="16"
        class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
      />
      <input
        v-model="keyword"
        type="search"
        placeholder="搜索标题、摘要或标签…"
        class="h-11 w-full rounded-xl border border-slate-200 bg-white/60 pr-4 pl-10 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:focus:border-indigo-500"
      />
    </div>

    <!-- 标签筛选 -->
    <div v-if="tags.length" class="mb-10 flex flex-wrap gap-2">
      <RouterLink
        to="/posts"
        class="rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
        :class="
          !activeTag
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400'
        "
      >
        全部
      </RouterLink>
      <TagBadge v-for="t in tags" :key="t.name" :name="t.name" :count="t.count" />
    </div>

    <!-- 列表 -->
    <div v-if="grouped.length" class="space-y-12 pb-8">
      <section v-for="[year, list] in grouped" :key="year">
        <h2
          class="mb-4 font-mono text-xs tracking-widest text-slate-300 dark:text-slate-700"
        >
          {{ year }}
        </h2>
        <div class="space-y-3">
          <PostCard v-for="p in list" :key="p.slug" :post="p" />
        </div>
      </section>
    </div>

    <p v-else class="py-20 text-center text-sm text-slate-400">
      没有找到相关文章
    </p>
  </div>
</template>