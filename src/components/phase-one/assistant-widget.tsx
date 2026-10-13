import { Bot, X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import figureUrl from '@/assets/an-xiaoneng-figure.png'
import { AXN_DEMO_URL } from '@/lib/demo-links'

/**
 * 安小能数字人形象：从品牌 VIS 图里抠出的正视图全身（背景透明），直接当悬浮入口用。
 * 展示高度 120，宽度按图片比例自适应（资源 290×384，比例约 0.755），下方再挂一个名字小标签。
 */

/** 首帧还没量到真实尺寸时的兜底（与 h-[120px] + 资源比例 + 标签一致） */
const FIGURE_BOX_FALLBACK = { w: 91, h: 145 }

/** 浮窗内容宽固定 480，窄于桌面断点，演示站仍走移动版布局 */
const PREVIEW_W = 480
const PREVIEW_MAX_H = 760
const PREVIEW_MIN_H = 240
const PANEL_HEADER_H = 44
/** 浮窗总宽 = 内容宽 + 左右各 1px 边框 */
const PANEL_W = PREVIEW_W + 2

/** 浮窗与数字人之间的间距 */
const GAP = 12
/** 数字人拖拽后可贴到的最小边距 */
const EDGE = 16
/** 初始停在右下角时的边距 */
const REST = 24
/** 超过这个距离才算拖拽，避免手抖把点击吞掉 */
const DRAG_THRESHOLD = 4

type Point = { x: number; y: number }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** 浮窗优先摊在数字人左侧；左边放不下（人拖到左侧）就翻到右边，最后夹回视口内 */
function panelLeft(figure: Point, figureW: number, viewportW: number) {
  const leftOfFigure = figure.x - PANEL_W - GAP
  if (leftOfFigure >= EDGE) return leftOfFigure
  const rightOfFigure = figure.x + figureW + GAP
  if (rightOfFigure + PANEL_W <= viewportW - EDGE) return rightOfFigure
  return clamp(leftOfFigure, EDGE, Math.max(EDGE, viewportW - PANEL_W - EDGE))
}

/**
 * 一期系统里的「安小能」悬浮入口：右下角悬浮一整只数字人（品牌 VIS 里的正视图，背景透明），
 * 可拖拽。点击展开浮窗，浮窗里用 iframe 加载演示站，宽度固定 480px（窄于桌面断点）让演示站走移动版布局。
 * 数字人始终被夹在视口内，窗口尺寸变化时也会重新夹一次。收起方式：点数字人、点关闭、
 * 点浮窗外部、按 Esc。
 */
export function AssistantWidget() {
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const [figureBox, setFigureBox] = useState(FIGURE_BOX_FALLBACK)
  /** null 表示还没定位，先渲染到视口外，避免闪一下左上角 */
  const [figure, setFigure] = useState<Point | null>(null)
  const [open, setOpen] = useState(false)
  const figureRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ dx: number; dy: number; startX: number; startY: number; moved: boolean } | null>(null)
  /** 拖过之后就固定住用户选的位置，没拖过则一直停在右下角 */
  const draggedRef = useRef(false)

  const clampFigure = useCallback(
    (p: Point) => ({
      x: clamp(p.x, EDGE, Math.max(EDGE, viewport.w - figureBox.w - EDGE)),
      y: clamp(p.y, EDGE, Math.max(EDGE, viewport.h - figureBox.h - EDGE)),
    }),
    [figureBox, viewport],
  )

  // 量一次数字人的真实尺寸（宽度随资源比例而定），后面定位都用它；图片解码完再量一次
  const measure = useCallback(() => {
    const el = figureRef.current
    if (!el) return
    const next = { w: el.offsetWidth, h: el.offsetHeight }
    if (next.w > 0) setFigureBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
  }, [])

  // 图片未解码时 offsetWidth 会是 0，如果拿着 0 去定位会把人挤到视口边缘外，所以等 onLoad 再补量
  useLayoutEffect(() => {
    measure()
  }, [measure])

  // 首帧停到右下角；窗口尺寸变化时把拖过的数字人夹回视口内
  useLayoutEffect(() => {
    setFigure((prev) =>
      draggedRef.current && prev
        ? clampFigure(prev)
        : { x: viewport.w - figureBox.w - REST, y: viewport.h - figureBox.h - REST },
    )
  }, [figureBox, viewport, clampFigure])

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 浮窗打开时：Esc 或点击浮窗 / 数字人以外的地方收起
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target) || figureRef.current?.contains(target)) return
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
    const origin = figure ?? { x: e.clientX, y: e.clientY }
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
    if (drag.moved) setFigure(clampFigure({ x: e.clientX - drag.dx, y: e.clientY - drag.dy }))
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
  const panelPos = figure
    ? {
        left: panelLeft(figure, figureBox.w, viewport.w),
        top: clamp(figure.y + figureBox.h - panelH, EDGE, Math.max(EDGE, viewport.h - panelH - EDGE)),
      }
    : null

  return (
    <>
      <button
        ref={figureRef}
        type="button"
        aria-label={open ? '收起安小能' : '打开安小能'}
        aria-expanded={open}
        aria-haspopup="dialog"
        title="安小能"
        className="group fixed top-0 left-0 z-50 flex cursor-grab touch-none select-none active:cursor-grabbing"
        // 用 transform 定位：fixed 元素若直接用 left/top，宽度会被「左侧可用空间」限制住，人会被压扁
        style={{ transform: `translate3d(${figure?.x ?? -9999}px, ${figure?.y ?? -9999}px, 0)` }}
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
        <span className="flex flex-col items-center transition-transform duration-150 group-hover:scale-[1.04] group-active:scale-95">
          <img
            src={figureUrl}
            alt=""
            draggable={false}
            onLoad={measure}
            className="pointer-events-none h-[120px] w-auto object-contain drop-shadow-[0_12px_18px_rgba(12,40,90,0.3)]"
          />
          <span className="mt-[4px] rounded-full border border-[#D8DEE9] bg-white/95 px-[8px] py-[2px] text-[12px] leading-none font-medium text-[#1D5CD8] shadow-[0_2px_6px_rgba(23,42,84,0.14)]">
            安小能
          </span>
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
