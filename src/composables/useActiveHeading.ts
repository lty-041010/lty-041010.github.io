import { onBeforeUnmount, ref } from 'vue'

export function useActiveHeading() {
  const activeId = ref('')
  let observer: IntersectionObserver | null = null

  function stop() {
    observer?.disconnect()
    observer = null
  }

  function observe(ids: string[]) {
    stop()
    if (!ids.length) return

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!els.length) return

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const first = visible[0]
        if (first) activeId.value = first.target.id
      },
      { rootMargin: '-88px 0px -65% 0px', threshold: 0 },
    )

    els.forEach((el) => observer!.observe(el))
  }

  onBeforeUnmount(stop)
  return { activeId, observe, stop }
}