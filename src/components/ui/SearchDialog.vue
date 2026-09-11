<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { allPosts } from '@/utils/posts'
import { formatDate } from '@/utils/date'

const open = defineModel<boolean>('open', { default: false })

const router = useRouter()
const keyword = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const cursor = ref(0)

const results = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return allPosts.slice(0, 6)

  return allPosts
    .filter((p) => {
      const haystack = [p.title, p.summary, ...p.tags].join(' ').toLowerCase()
      return haystack.includes(q)
    })
    .slice(0, 8)
})

watch(open, async (v) => {
  if (v) {
    keyword.value = ''
    cursor.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(results, () => {
  cursor.value = 0
})

function go(slug: string) {
  open.value = false
  router.push(`/posts/${slug}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor.value = Math.min(cursor.value + 1, results.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    cursor.value = Math.max(cursor.value - 1, 0)
  }
  if (e.key === 'Enter') {
    const hit = results.value[cursor.value]
    if (hit) go(hit.slug)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 px-4 pt-[12vh] backdrop-blur-sm dark:bg-black/60"
        @click.self="open = false"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          @keydown="onKeydown"
        >
          <div class="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
            <Search :size="17" class="shrink-0 text-slate-400" />
            <input
              ref="inputRef"
              v-model="keyword"
              type="text"
              placeholder="搜索文章标题、摘要或标签…"
              class="h-12 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            <kbd
              class="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 sm:block dark:border-slate-700"
            >
              ESC
            </kbd>
          </div>

          <ul v-if="results.length" class="max-h-80 overflow-y-auto p-2">
            <li v-for="(p, i) in results" :key="p.slug">
              <button
                type="button"
                class="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors"
                :class="
                  i === cursor
                    ? 'bg-indigo-50 dark:bg-indigo-500/10'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                "
                @mouseenter="cursor = i"
                @click="go(p.slug)"
              >
                <span class="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {{ p.title }}
                </span>
                <span class="text-xs text-slate-400">
                  {{ formatDate(p.date) }} · {{ p.tags.join(' / ') || '未分类' }}
                </span>
              </button>
            </li>
          </ul>

          <p v-else class="px-4 py-8 text-center text-sm text-slate-400">
            没有找到相关文章
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>