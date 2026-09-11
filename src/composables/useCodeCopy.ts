import { watch, type Ref } from 'vue'

export function useCodeCopy(
  container: Ref<HTMLElement | null>,
  source: Ref<unknown>,
) {
  function enhance() {
    const root = container.value
    if (!root) return

    root.querySelectorAll<HTMLPreElement>('pre.code-block').forEach((pre) => {
      if (pre.dataset.enhanced === '1') return
      pre.dataset.enhanced = '1'

      const lang = pre.dataset.lang ?? ''
      if (lang && lang !== 'plaintext') {
        const tag = document.createElement('span')
        tag.className = 'code-lang'
        tag.textContent = lang
        pre.appendChild(tag)
      }

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'code-copy'
      btn.textContent = '复制'
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent ?? ''
        try {
          await navigator.clipboard.writeText(code)
          btn.textContent = '已复制'
        } catch {
          btn.textContent = '复制失败'
        }
        window.setTimeout(() => {
          btn.textContent = '复制'
        }, 1500)
      })
      pre.appendChild(btn)
    })
  }

  watch(source, () => requestAnimationFrame(enhance), {
    flush: 'post',
    immediate: true,
  })
}