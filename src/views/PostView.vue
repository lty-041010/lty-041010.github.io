<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Calendar, Clock } from 'lucide-vue-next'
import PostToc from '@/components/post/PostToc.vue'
import PostNav from '@/components/post/PostNav.vue'
import GiscusComments from '@/components/post/GiscusComments.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import NotFoundView from './NotFoundView.vue'
import { getAdjacentPosts, getPost } from '@/utils/posts'
import { renderMarkdown } from '@/utils/markdown'
import { formatDateCN } from '@/utils/date'
import { useSeo } from '@/composables/useSeo'
import { useActiveHeading } from '@/composables/useActiveHeading'
import { useCodeCopy } from '@/composables/useCodeCopy'

const props = defineProps<{ slug: string }>()

const post = computed(() => getPost(props.slug))
const rendered = computed(() =>
  post.value ? renderMarkdown(post.value.body) : { html: '', toc: [] },
)
const adjacent = computed(() => getAdjacentPosts(props.slug))

const articleRef = ref<HTMLElement | null>(null)
const { activeId, observe } = useActiveHeading()

useCodeCopy(articleRef, computed(() => rendered.value.html))

function syncHeadings() {
  observe(rendered.value.toc.map((t) => t.id))
}

onMounted(syncHeadings)
watch(() => rendered.value.html, syncHeadings, { flush: 'post' })

useSeo(() => ({
  title: post.value?.title,
  description: post.value?.summary,
}))
</script>

<template>
  <NotFoundView v-if="!post" />

  <div v-else class="mx-auto max-w-3xl px-5 pt-14">
    <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-12">
      <article class="min-w-0">
        <!-- 头部 -->
        <header class="mb-10">
          <h1
            class="text-3xl leading-tight font-bold tracking-tight text-slate-900 dark:text-slate-50"
          >
            {{ post.title }}
          </h1>

          <div
            class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 dark:text-slate-500"
          >
            <span class="inline-flex items-center gap-1">
              <Calendar :size="13" />
              {{ formatDateCN(post.date) }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Clock :size="13" />
              {{ post.readingTime }} 分钟阅读
            </span>
          </div>

          <div v-if="post.tags.length" class="mt-4 flex flex-wrap gap-1.5">
            <TagBadge v-for="t in post.tags" :key="t" :name="t" />
          </div>
        </header>

        <!-- 正文 -->
        <div
          ref="articleRef"
          class="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-indigo-400 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800/70 prose-pre:bg-transparent prose-pre:p-0"
          v-html="rendered.html"
        />

        <PostNav :prev="adjacent.prev" :next="adjacent.next" />
        <GiscusComments :slug="post.slug" />
      </article>

      <!-- 侧边目录（桌面） -->
      <aside class="hidden lg:block">
        <div class="sticky top-24">
          <PostToc :items="rendered.toc" :active-id="activeId" />
        </div>
      </aside>
    </div>
  </div>
</template>