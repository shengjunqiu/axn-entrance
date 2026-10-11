import type { LucideIcon } from 'lucide-react'

type HexagonIconProps = {
  icon: LucideIcon
}

/**
 * 参考图卡片中央的六边形图标：竖长六边形（顶点朝上下）+ 内部线性图标。
 * 六边形按卡片宽度自适应（1cqw = 卡片宽度的 1%），尺寸与参考图比例一致。
 */
export function HexagonIcon({ icon: Icon }: HexagonIconProps) {
  return (
    <span className="relative block size-full">
      <svg
        viewBox="0 0 100 106"
        fill="none"
        className="absolute inset-0 size-full drop-shadow-[0_0_2.6cqw_rgba(110,205,255,.9)]"
      >
        <polygon
          points="50,1.6 98.4,27.6 98.4,78.4 50,104.4 1.6,78.4 1.6,27.6"
          fill="rgba(120,195,255,0.08)"
          stroke="#bfe4ff"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <Icon
          className="size-[17cqw] text-[#e2f2ff] drop-shadow-[0_0_1.4cqw_rgba(110,205,255,.85)]"
          strokeWidth={1.7}
        />
      </span>
    </span>
  )
}
