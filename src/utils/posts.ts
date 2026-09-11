import * as yaml from 'js-yaml'
import type { ArchiveGroup, Post, TagCount } from '@/types/post'
import { calcReadingTime } from './reading-time'

const rawFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

interface Frontmatter {
  title?: unknown
  date?: unknown
  tags?: unknown
  categories?: unknown
  summary?: unknown
  cover?: unknown
  draft?: unknown
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string' && v.trim()) {
    return v.split(',').map((s) => s.trim()).filter(Boolean)
  }
  return []
}

function toDateString(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string' && v.trim()) return v.trim().slice(0, 10)
  return '1970-01-01'
}

function parsePost(filePath: string, raw: string): Post {
  const slug = filePath.split('/').pop()!.replace(/\.md$/, '')
  const m = FRONTMATTER_RE.exec(raw)
  const data: Frontmatter = m && m[1] ? ((yaml.load(m[1]) as Frontmatter) ?? {}) : {}
  const body = m ? raw.slice(m[0].length) : raw

  return {
    slug,
    title: typeof data.title === 'string' && data.title ? data.title : slug,
    date: toDateString(data.date),
    tags: toStringArray(data.tags),
    categories: toStringArray(data.categories),
    summary: typeof data.summary === 'string' ? data.summary : '',
    cover: typeof data.cover === 'string' && data.cover ? data.cover : undefined,
    draft: data.draft === true,
    readingTime: calcReadingTime(body),
    body,
  }
}

/** 全部已发布文章，按日期倒序 */
export const allPosts: Post[] = Object.entries(rawFiles)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

const postIndex = new Map(allPosts.map((p) => [p.slug, p]))

export function getPost(slug: string): Post | undefined {
  return postIndex.get(slug)
}

export function getRecentPosts(limit = 5): Post[] {
  return allPosts.slice(0, limit)
}

export function getAllTags(): TagCount[] {
  const map = new Map<string, number>()
  for (const p of allPosts) {
    for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((p) => p.tags.includes(tag))
}

export function getArchive(): ArchiveGroup[] {
  const map = new Map<string, Post[]>()
  for (const p of allPosts) {
    const year = p.date.slice(0, 4)
    const list = map.get(year)
    if (list) list.push(p)
    else map.set(year, [p])
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }))
}

/** prev = 更早一篇，next = 更新一篇 */
export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const i = allPosts.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return { prev: allPosts[i + 1], next: allPosts[i - 1] }
}