export interface TocItem {
  id: string
  text: string
  level: number
}

export interface Post {
  slug: string
  title: string
  /** ISO 日期，格式 yyyy-MM-dd */
  date: string
  tags: string[]
  categories: string[]
  summary: string
  cover?: string
  draft: boolean
  /** 预估阅读分钟数 */
  readingTime: number
  /** 去掉 frontmatter 后的 Markdown 正文 */
  body: string
}

export interface TagCount {
  name: string
  count: number
}

export interface ArchiveGroup {
  year: string
  posts: Post[]
}