<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({ title: '页面不存在', description: '你访问的页面不存在。' }))
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
    <p class="font-mono text-6xl font-bold text-slate-200 dark:text-slate-800">404</p>
    <h1 class="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">
      这里什么都没有
    </h1>
    <p class="mt-2 text-sm text-slate-400">
      页面可能已被删除，或者链接输错了。
    </p>
    <RouterLink
      to="/"
      class="mt-8 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
    >
      回到首页
    </RouterLink>
  </div>
</template>