import { readonly, ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'blog-theme'
const theme = ref<Theme>('light')

function apply(next: Theme) {
  theme.value = next
  const root = document.documentElement
  root.classList.toggle('dark', next === 'dark')
  root.style.colorScheme = next
}

/** 在 main.ts 里调用一次 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  apply(saved ?? (systemDark ? 'dark' : 'light'))

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      // 用户没手动选过，才跟随系统
      if (!localStorage.getItem(STORAGE_KEY)) {
        apply(e.matches ? 'dark' : 'light')
      }
    })
}

export function useTheme() {
  function toggle() {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    apply(next)
  }
  return { theme: readonly(theme), toggle }
}