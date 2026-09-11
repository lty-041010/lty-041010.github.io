<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { site } from '@/config/site'

const props = defineProps<{ slug: string }>()

const container = ref<HTMLDivElement | null>(null)

function mount() {
  if (!site.giscus.enabled || !container.value) return
  const el = container.value
  el.innerHTML = ''

  const s = document.createElement('script')
  s.src = 'https://giscus.app/client.js'
  s.async = true
  s.crossOrigin = 'anonymous'
  s.setAttribute('data-repo', site.giscus.repo)
  s.setAttribute('data-repo-id', site.giscus.repoId)
  s.setAttribute('data-category', site.giscus.category)
  s.setAttribute('data-category-id', site.giscus.categoryId)
  s.setAttribute('data-mapping', site.giscus.mapping)
  s.setAttribute('data-strict', '0')
  s.setAttribute('data-reactions-enabled', '1')
  s.setAttribute('data-emit-metadata', '0')
  s.setAttribute('data-input-position', 'bottom')
  s.setAttribute('data-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  s.setAttribute('data-lang', site.giscus.lang)

  el.appendChild(s)
}

onMounted(mount)
watch(() => props.slug, mount)
</script>

<template>
  <section v-if="site.giscus.enabled" class="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
    <h2 class="mb-4 text-sm font-medium tracking-wider text-slate-400 uppercase">评论</h2>
    <div ref="container" />
  </section>
</template>