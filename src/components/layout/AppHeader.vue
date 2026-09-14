<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, Search, X } from 'lucide-vue-next'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import SearchDialog from '@/components/ui/SearchDialog.vue'
import { site } from '@/config/site'

const route = useRoute()
const menuOpen = ref(false)
const searchOpen = ref(false)

const nav = [
  { to: '/', label: '首页' },
  { to: '/posts', label: '文章' },
  { to: '/tags', label: '标签' },
  { to: '/archive', label: '归档' },
  { to: '/about', label: '关于' },
]

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200/70 bg-[#fafafa]/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-[#0b0f14]/85"
  >
    <div class="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
            <RouterLink
        to="/"
        class="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
      >
        <img :src="site.avatar" alt="avatar" class="h-8 w-8 rounded-full object-cover" />
        {{ site.name }}
      </RouterLink>

      <!-- 桌面导航 -->
      <nav class="hidden items-center gap-1 sm:flex">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
          active-class="!text-slate-900 dark:!text-slate-100 font-medium"
        >
          {{ item.label }}
        </RouterLink>

        <button
          type="button"
          class="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
          aria-label="搜索"
          title="搜索 (Ctrl/⌘ + K)"
          @click="searchOpen = true"
        >
          <Search :size="18" />
        </button>

        <ThemeToggle />
      </nav>

      <!-- 移动端 -->
      <div class="flex items-center gap-1 sm:hidden">
        <ThemeToggle />
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/60"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- 移动端抽屉 -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="menuOpen"
        class="border-t border-slate-200/70 bg-[#fafafa] px-5 py-3 sm:hidden dark:border-slate-800/70 dark:bg-[#0b0f14]"
      >
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60"
          active-class="!text-indigo-600 dark:!text-indigo-400 font-medium"
        >
          {{ item.label }}
        </RouterLink>
        <button
          type="button"
          class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60"
          @click="searchOpen = true"
        >
          <Search :size="16" />
          搜索
        </button>
      </nav>
    </Transition>

    <SearchDialog v-model:open="searchOpen" />
  </header>
</template>
