<script setup lang="ts">
import { Github, Mail, Rss, Twitter } from 'lucide-vue-next'
import { site } from '@/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-24 border-t border-slate-200/70 dark:border-slate-800/70">
    <div
      class="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-10 text-sm text-slate-400 sm:flex-row sm:justify-between dark:text-slate-500"
    >
      <p>© {{ year }} {{ site.author }}</p>

      <div class="flex items-center gap-4">
        <a
          v-if="site.social.github"
          :href="site.social.github"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="GitHub"
        >
          <Github :size="17" />
        </a>
        <a
          v-if="site.social.twitter"
          :href="site.social.twitter"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="Twitter"
        >
          <Twitter :size="17" />
        </a>
        <a
          v-if="site.social.email"
          :href="site.social.email"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="Email"
        >
          <Mail :size="17" />
        </a>
        <a
          href="./rss.xml"
          class="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          aria-label="RSS"
        >
          <Rss :size="17" />
        </a>
      </div>

      <p v-if="site.icp" class="text-xs">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          {{ site.icp }}
        </a>
      </p>
    </div>
  </footer>
</template>