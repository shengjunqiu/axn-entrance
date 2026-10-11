import { useLayoutEffect, useRef, useState } from 'react'

/**
 * 把设计稿尺寸等比缩放到容器内（居中放置时配合 absolute + translate 使用，
 * 因为被测元素绝对定位，不会反过来影响容器尺寸，避免 ResizeObserver 抖动）。
 */
export function useFitScale(designW: number, designH: number, padding = 28, maxScale = 1) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const next = Math.min((width - padding) / designW, (height - padding) / designH, maxScale)
      setScale(next > 0 ? next : 0.1)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [designW, designH, padding, maxScale])

  return { ref, scale }
}
