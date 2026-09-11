import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const postsDir = join(root, 'src', 'content', 'posts')
const outFile = join(root, 'public', 'rss.xml')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://example.com/').replace(/\/?$/, '/')
const SITE_TITLE = process.env.VITE_SITE_TITLE || '博客'
const SITE_DESC = process.env.VITE_SITE_DESC || '记录前端、设计与生活。'

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toDate(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v ?? '').slice(0, 10)
}

function toStringArray(v) {
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

if (!existsSync(postsDir)) {
  console.warn('[rss] posts directory not found, skipping')
  process.exit(0)
}

const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(join(postsDir, file), 'utf-8')
    const m = FM_RE.exec(raw)
    const data = m ? (yaml.load(m[1]) ?? {}) : {}
    return {
      slug: file.replace(/\.md$/, ''),
      title: String(data.title ?? file),
      date: toDate(data.date),
      summary: String(data.summary ?? ''),
      tags: toStringArray(data.tags),
      draft: data.draft === true,
    }
  })
  .filter((p) => !p.draft && p.date)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

const items = posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}#/posts/${p.slug}</link>
      <guid isPermaLink="false">${SITE_URL}#/posts/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESC)}</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

writeFileSync(outFile, xml, 'utf-8')
console.log(`[rss] generated ${outFile} with ${posts.length} items`)