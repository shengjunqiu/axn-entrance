import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'

/** 标题栏拖动浮窗，并在内容或窗口尺寸变化后保持可见。 */
export function useFloatingPanel(active: boolean) {
  const panel = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ pointer: number; x: number; y: number; left: number; top: number } | null>(null)

  function move(left: number, top: number) {
    const bounds = panel.current?.getBoundingClientRect()
    if (!bounds) return
    const next = {
      left: Math.max(8, Math.min(left, window.innerWidth - bounds.width - 8)),
      top: Math.max(8, Math.min(top, window.innerHeight - bounds.height - 8)),
    }
    setPosition(previous => previous?.left === next.left && previous.top === next.top ? previous : next)
  }

  useEffect(() => {
    if (!active || !panel.current) return
    function keepInView() {
      const bounds = panel.current?.getBoundingClientRect()
      if (bounds) move(bounds.left, bounds.top)
    }
    keepInView()
    const observer = new ResizeObserver(keepInView)
    observer.observe(panel.current)
    window.addEventListener('resize', keepInView)
    return () => { observer.disconnect(); window.removeEventListener('resize', keepInView); drag.current = null; setDragging(false) }
  }, [active])

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (drag.current?.pointer !== event.pointerId) return
    drag.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return {
    panel, dragging,
    style: position ? { left: position.left, top: position.top, right: 'auto' } : undefined,
    headerProps: {
      onPointerDown(event: PointerEvent<HTMLElement>) {
        if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button, input, textarea, select, a')) return
        const bounds = panel.current?.getBoundingClientRect()
        if (!bounds) return
        drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top }
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
        event.preventDefault()
      },
      onPointerMove(event: PointerEvent<HTMLElement>) {
        if (drag.current?.pointer !== event.pointerId) return
        move(drag.current.left + event.clientX - drag.current.x, drag.current.top + event.clientY - drag.current.y)
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onLostPointerCapture: endDrag,
    },
  }
}
