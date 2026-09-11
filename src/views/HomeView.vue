<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Github, Mail } from 'lucide-vue-next'
import PostCard from '@/components/ui/PostCard.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import { site } from '@/config/site'
import { getAllTags, getRecentPosts } from '@/utils/posts'
import { useSeo } from '@/composables/useSeo'

const posts = getRecentPosts(5)
const tags = getAllTags().slice(0, 12)

useSeo(() => ({ title: '', description: site.description }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-5">
    <!-- Hero -->
    <section class="pt-16 pb-14 sm:pt-24">
      <div
        class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 text-2xl font-semibold text-white"
      >
        {{ site.author.slice(0, 1) }}
      </div>

      <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
        你好，我是{{ site.author }}
      </h1>

      <p class="mt-4 max-w-[46ch] text-base leading-relaxed text-slate-500 dark:text-slate-400">
        {{ site.description }}在这里记录一些关于前端、设计，以及日常生活里值得留下的东西。
      </p>

      <div class="mt-6 flex items-center gap-4 text-slate-400 dark:text-slate-500">
        <a
          v-if="site.social.github"
          :href="site.social.github"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="GitHub"
        >
          <Github :size="18" />
        </a>
        <a
          v-if="site.social.email"
          :href="site.social.email"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="Email"
        >
          <Mail :size="18" />
        </a>
      </div>
    </section>

    <!-- 最新文章 -->
    <section>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-sm font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
          最新文章
        </h2>
        <RouterLink
          to="/posts"
          class="inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          全部 <ArrowRight :size="14" />
        </RouterLink>
      </div>

      <div class="space-y-3">
        <PostCard v-for="p in posts" :key="p.slug" :post="p" />
      </div>
    </section>

    <!-- 标签云 -->
    <section v-if="tags.length" class="mt-16">
      <h2 class="mb-5 text-sm font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
        常用标签
      </h2>
      <div class="flex flex-wrap gap-2">
        <TagBadge v-for="t in tags" :key="t.name" :name="t.name" :count="t.count" />
      </div>
    </section>
  </div>
</template>