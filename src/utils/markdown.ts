import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import type { TocItem } from '@/types/post'

export interface RenderResult {
  html: string
  toc: TocItem[]
}

interface RenderEnv extends Record<string, unknown> {
  toc: TocItem[]
  seen: Map<string, number>
}

function slugify(raw: string, seen: Map<string, number>): string {
  let base = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')

  if (!base) base = 'section'

  const n = seen.get(base) ?? 0
  seen.set(base, n + 1)
  return n === 0 ? base : `${base}-${n}`
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: false,
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const html = hljs.highlight(code, { language, ignoreIllegals: true }).value
    return (
      `<pre class="code-block" data-lang="${language}">` +
      `<code class="hljs language-${language}">${html}</code>` +
      `</pre>`
    )
  },
})

// 给标题加 id，同时收集 TOC
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (!token) return ''

  const inline = tokens[idx + 1]
  const text = inline?.children?.map((c) => c.content).join('') ?? ''

  const e = env as unknown as RenderEnv
  const id = slugify(text, e.seen)
  token.attrSet('id', id)
  e.toc.push({ id, text, level: Number(token.tag.slice(1)) })

  return self.renderToken(tokens, idx, options)
}

// 外链新窗口打开
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  if (!token) return ''

  const href = token.attrGet('href') ?? ''
  if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return self.renderToken(tokens, idx, options)
}

// 图片懒加载
md.renderer.rules.image = (tokens, idx, options, _env, self) => {
  const token = tokens[idx]
  if (!token) return ''

  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  return self.renderToken(tokens, idx, options)
}

export function renderMarkdown(source: string): RenderResult {
  const env: RenderEnv = { toc: [], seen: new Map() }
  const html = md.render(source, env as unknown as Record<PropertyKey, unknown>)
  return { html, toc: env.toc }
}