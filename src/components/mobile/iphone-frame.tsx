import type { ReactNode } from 'react'
import { SCREEN_H, SCREEN_W } from '@/lib/mobile-data'
import { useFitScale } from '@/lib/use-fit-scale'

/** 机身边框宽度 */
const BEZEL = 13
/** 外壳尺寸（含边框） */
const FRAME_W = SCREEN_W + BEZEL * 2
const FRAME_H = SCREEN_H + BEZEL * 2

/**
 * 模拟 iPhone 外壳：金属边框 + 灵动岛 + 侧边实体键。
 * 屏幕区域是 428×926 的逻辑坐标系，内部按参考图 1:1 布局，整体等比缩放适配窗口。
 */
export function IphoneFrame({ children }: { children: ReactNode }) {
  const { ref, scale } = useFitScale(FRAME_W, FRAME_H)

  return (
    <div ref={ref} className="relative min-h-0 w-full flex-1">
      <div
        className="absolute top-1/2 left-1/2"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {/* 机身 */}
        <div
          className="relative rounded-[64px] bg-[linear-gradient(148deg,#5a6068_0%,#20242b_26%,#0c0e12_58%,#3c424b_100%)] shadow-[0_50px_90px_-24px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]"
          style={{ width: FRAME_W, height: FRAME_H, padding: BEZEL }}
        >
          {/* 内侧高光 */}
          <div className="pointer-events-none absolute inset-0 rounded-[64px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)]" />

          {/* 屏幕 */}
          <div
            data-phone-screen
            className="relative overflow-hidden rounded-[52px] bg-white"
            style={{ width: SCREEN_W, height: SCREEN_H }}
          >
            {children}

            {/* 灵动岛 */}
            <div className="pointer-events-none absolute top-[11px] left-1/2 z-20 h-[37px] w-[125px] -translate-x-1/2 rounded-full bg-black">
              {/* 前置摄像头 */}
              <span className="absolute top-1/2 right-[13px] size-[9px] -translate-y-1/2 rounded-full bg-[#0b0f16] ring-1 ring-white/10" />
            </div>
          </div>

          {/* 左侧：静音键 + 音量键 */}
          <span className="absolute top-[150px] -left-[3px] h-[30px] w-[3px] rounded-l-[2px] bg-[linear-gradient(90deg,#2b3038,#555c66)]" />
          <span className="absolute top-[214px] -left-[3px] h-[56px] w-[3px] rounded-l-[2px] bg-[linear-gradient(90deg,#2b3038,#555c66)]" />
          <span className="absolute top-[286px] -left-[3px] h-[56px] w-[3px] rounded-l-[2px] bg-[linear-gradient(90deg,#2b3038,#555c66)]" />
          {/* 右侧：电源键 */}
          <span className="absolute top-[230px] -right-[3px] h-[84px] w-[3px] rounded-r-[2px] bg-[linear-gradient(270deg,#2b3038,#555c66)]" />
        </div>
      </div>
    </div>
  )
}
