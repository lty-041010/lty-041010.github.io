<script setup lang="ts">
import { Github, Mail, Twitter } from 'lucide-vue-next'
import { site } from '@/config/site'
import { useSeo } from '@/composables/useSeo'

const skills = [
  'Vue 3 / TypeScript',
  'Vite / Rolldown',
  'Tailwind CSS',
  'Node.js',
  'UI / UX 设计',
  'Git / CI',
]

const projects = [
  {
    name: '个人博客',
    desc: 'Vue 3 + Vite + Tailwind 打造的极简博客，部署在 GitHub Pages。',
    link: site.social.github,
  },
]

useSeo(() => ({ title: '关于', description: `关于 ${site.author}。` }))
</script>

<template>
  <div class="mx-auto max-w-3xl px-5 pt-14">
    <header class="mb-12">
      <div
        class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 text-2xl font-semibold text-white"
      >
        {{ site.author.slice(0, 1) }}
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {{ site.author }}
      </h1>
      <p class="mt-3 max-w-[52ch] leading-relaxed text-slate-500 dark:text-slate-400">
        {{ site.description }}
      </p>
    </header>

    <div class="prose prose-slate max-w-none dark:prose-invert">
      <h2>技能</h2>
      <ul>
        <li v-for="s in skills" :key="s">{{ s }}</li>
      </ul>

      <h2>项目</h2>
      <ul>
        <li v-for="p in projects" :key="p.name">
          <a :href="p.link" target="_blank" rel="noopener noreferrer">{{ p.name }}</a>
          —— {{ p.desc }}
        </li>
      </ul>

      <h2>联系</h2>
      <p>欢迎通过下面任意方式找我：</p>
    </div>

    <div class="mt-8 flex items-center gap-5 text-slate-400 dark:text-slate-500">
      <a
        v-if="site.social.github"
        :href="site.social.github"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm transition-colors hover:text-slate-900 dark:hover:text-slate-200"
      >
        <Github :size="16" /> GitHub
      </a>
      <a
        v-if="site.social.twitter"
        :href="site.social.twitter"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm transition-colors hover:text-slate-900 dark:hover:text-slate-200"
      >
        <Twitter :size="16" /> Twitter
      </a>
      <a
        v-if="site.social.email"
        :href="site.social.email"
        class="inline-flex items-center gap-2 text-sm transition-colors hover:text-slate-900 dark:hover:text-slate-200"
      >
        <Mail :size="16" /> Email
      </a>
    </div>
  </div>
</template>