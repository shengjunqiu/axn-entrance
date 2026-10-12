import { Bot, X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { AXN_DEMO_URL } from '@/lib/demo-links'

/** 悬浮球：直径 56 的圆 + 一行名称 */
const BALL_DIAMETER = 56
const BALL_GAP = 6
const BALL_LABEL_H = 14
/** 首帧还没量到真实尺寸时的兜底（圆 56 与「安小能」三字取宽者） */
const BALL_BOX_FALLBACK = { w: 56, h: BALL_DIAMETER + BALL_GAP + BALL_LABEL_H }

/** 浮窗内容宽固定 428（iPhone 逻辑宽度），演示站据此走移动版布局 */
const PREVIEW_W = 428
const PREVIEW_MAX_H = 680
const PREVIEW_MIN_H = 240
const PANEL_HEADER_H = 44
/** 浮窗总宽 = 内容宽 + 左右各 1px 边框 */
const PANEL_W = PREVIEW_W + 2

/** 浮窗与悬浮球之间的间距 */
const GAP = 12
/** 悬浮球拖拽后可贴到的最小边距 */
const EDGE = 16
/** 初始停在右下角时的边距 */
const REST = 24
/** 超过这个距离才算拖拽，避免手抖把点击吞掉 */
const DRAG_THRESHOLD = 4

type Point = { x: number; y: number }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** 浮窗优先摊在悬浮球左侧；左边放不下（球被拖到左侧）就翻到右边，最后夹回视口内 */
function panelLeft(ball: Point, ballW: number, viewportW: number) {
  const leftOfBall = ball.x - PANEL_W - GAP
  if (leftOfBall >= EDGE) return leftOfBall
  const rightOfBall = ball.x + ballW + GAP
  if (rightOfBall + PANEL_W <= viewportW - EDGE) return rightOfBall
  return clamp(leftOfBall, EDGE, Math.max(EDGE, viewportW - PANEL_W - EDGE))
}

/**
 * 一期系统里的「安小能」悬浮入口：右下角一个可拖拽的圆形悬浮球（机器人头像 + 名称），
 * 点击展开浮窗，浮窗里用 iframe 加载演示站，宽度固定 428px 让演示站走移动版布局。
 * 悬浮球始终被夹在视口内，窗口尺寸变化时也会重新夹一次。收起方式：点悬浮球、点关闭、
 * 点浮窗外部、按 Esc。
 */
export function AssistantWidget() {
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const [ballBox, setBallBox] = useState(BALL_BOX_FALLBACK)
  /** null 表示还没定位，先渲染到视口外，避免闪一下左上角 */
  const [ball, setBall] = useState<Point | null>(null)
  const [open, setOpen] = useState(false)
  const ballRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ dx: number; dy: number; startX: number; startY: number; moved: boolean } | null>(null)
  /** 拖过之后就固定住用户选的位置，没拖过则一直停在右下角 */
  const draggedRef = useRef(false)

  const clampBall = useCallback(
    (p: Point) => ({
      x: clamp(p.x, EDGE, Math.max(EDGE, viewport.w - ballBox.w - EDGE)),
      y: clamp(p.y, EDGE, Math.max(EDGE, viewport.h - ballBox.h - EDGE)),
    }),
    [ballBox, viewport],
  )

  // 量一次按钮的真实尺寸（名称行的宽度随字体而定），后面定位都用它
  useLayoutEffect(() => {
    const el = ballRef.current
    if (!el) return
    const next = { w: el.offsetWidth, h: el.offsetHeight }
    setBallBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
  }, [])

  // 首帧停到右下角；窗口尺寸变化时把拖过的球夹回视口内
  useLayoutEffect(() => {
    setBall((prev) =>
      draggedRef.current && prev
        ? clampBall(prev)
        : { x: viewport.w - ballBox.w - REST, y: viewport.h - ballBox.h - REST },
    )
  }, [ballBox, viewport, clampBall])

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 浮窗打开时：Esc 或点击浮窗 / 悬浮球以外的地方收起
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || ballRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const origin = ball ?? { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      dx: e.clientX - origin.x,
      dy: e.clientY - origin.y,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) return
    if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD) {
      drag.moved = true
      draggedRef.current = true
    }
    if (drag.moved) setBall(clampBall({ x: e.clientX - drag.dx, y: e.clientY - drag.dy }))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    // 没挪动过就是一次点击，用来开关浮窗
    if (drag && !drag.moved) setOpen((prev) => !prev)
  }

  const previewH = clamp(viewport.h - PANEL_HEADER_H - EDGE * 2, PREVIEW_MIN_H, PREVIEW_MAX_H)
  const panelH = PANEL_HEADER_H + previewH
  const panelPos = ball
    ? {
        left: panelLeft(ball, ballBox.w, viewport.w),
        top: clamp(ball.y + ballBox.h - panelH, EDGE, Math.max(EDGE, viewport.h - panelH - EDGE)),
      }
    : null

  return (
    <>
      <button
        ref={ballRef}
        type="button"
        aria-label={open ? '收起安小能' : '打开安小能'}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="group fixed z-50 flex w-max cursor-grab touch-none flex-col items-center gap-[6px] select-none active:cursor-grabbing"
        style={{ left: ball?.x ?? -9999, top: ball?.y ?? -9999 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragRef.current = null
        }}
        onClick={(e) => {
          // 键盘 Enter / Space 走的是 click（detail 为 0），鼠标与触摸已经由 pointerup 处理
          if (e.detail === 0) setOpen((prev) => !prev)
        }}
      >
        <span className="flex size-[56px] items-center justify-center rounded-full border border-[#2E6FE0]/40 bg-[radial-gradient(120%_120%_at_30%_15%,#7BB0FF_0%,#347AFB_55%,#1D5CD8_100%)] text-white shadow-[0_10px_24px_-6px_rgba(29,92,216,0.65)] transition-transform duration-150 group-hover:scale-[1.04] group-active:scale-95">
          <Bot className="size-[30px]" strokeWidth={1.9} />
        </span>
        <span className="text-[12px] leading-none font-medium text-[#1F2937] [text-shadow:0_1px_3px_rgba(255,255,255,0.95),0_0_7px_rgba(255,255,255,0.9)]">
          安小能
        </span>
      </button>

      {open && panelPos && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="安小能"
          className="fixed z-50 overflow-hidden rounded-[14px] border border-[#D8DEE9] bg-white shadow-[0_18px_44px_-12px_rgba(23,42,84,0.35)]"
          style={{ left: panelPos.left, top: panelPos.top, width: PANEL_W }}
        >
          <div className="flex h-[44px] items-center gap-[8px] border-b border-[#E7ECF3] bg-[#F7F9FB] px-[12px]">
            <span className="flex size-[26px] items-center justify-center rounded-full bg-[radial-gradient(120%_120%_at_30%_15%,#7BB0FF_0%,#347AFB_55%,#1D5CD8_100%)] text-white">
              <Bot className="size-[16px]" strokeWidth={2} />
            </span>
            <span className="text-[14px] font-medium text-[#1F2937]">安小能</span>
            <button
              type="button"
              aria-label="关闭安小能"
              className="ml-auto flex size-[26px] items-center justify-center rounded-full text-[#5A6376] hover:bg-[#E9EEF6] hover:text-[#1F2937]"
              onClick={() => setOpen(false)}
            >
              <X className="size-[16px]" />
            </button>
          </div>
          <iframe
            title="安小能（移动版）"
            src={AXN_DEMO_URL}
            width={PREVIEW_W}
            height={previewH}
            className="block border-0 bg-white"
          />
        </div>
      )}
    </>
  )
}
