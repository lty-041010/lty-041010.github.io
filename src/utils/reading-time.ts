const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g
const WORD_RE = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g

/**
 * 中文按 400 字/分钟，英文按 200 词/分钟估算。
 */
export function calcReadingTime(text: string): number {
  const cjkCount = (text.match(CJK_RE) ?? []).length
  const latin = text.replace(CJK_RE, ' ')
  const wordCount = (latin.match(WORD_RE) ?? []).length
  const minutes = cjkCount / 400 + wordCount / 200
  return Math.max(1, Math.round(minutes))
}