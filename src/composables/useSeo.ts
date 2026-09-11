import { watchEffect } from 'vue'
import { site } from '@/config/site'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSeo(get: () => { title?: string; description?: string }) {
  watchEffect(() => {
    const { title, description } = get()
    const fullTitle = title ? `${title} · ${site.title}` : site.title
    const desc = description || site.description

    document.title = fullTitle
    upsertMeta('name', 'description', desc)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:type', 'website')
  })
}