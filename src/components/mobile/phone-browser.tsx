import { ChevronLeft } from 'lucide-react'
import { StatusBar } from '@/components/mobile/status-bar'
import { HOME_INDICATOR_H, SCREEN_H, SCREEN_W, STATUS_BAR_H } from '@/lib/mobile-data'

/**
 * 手机屏幕内嵌的网页视图：状态栏 + 安全区内的 iframe + 底部 Home 指示条。
 * iframe 只占安全区内的高度 428×(926-47-31)，不占位给返回入口：
 * iframe 里 env(safe-area-inset-*) 恒为 0，跨域页面自己没法避让灵动岛和 Home 指示条，
 * 只能用几何方式给它一个「安全」视口。
 */
export function PhoneBrowser({ url, onBack }: { url: string; onBack: () => void }) {
  return (
    <div className="relative bg-white" style={{ width: SCREEN_W, height: SCREEN_H }}>
      <StatusBar />

      <iframe
        src={url}
        title="安小能"
        className="block w-full border-0 bg-white"
        style={{ height: SCREEN_H - STATUS_BAR_H - HOME_INDICATOR_H }}
      />

      {/* Home 指示条区 */}
      <div
        className="flex items-center justify-center"
        style={{ height: HOME_INDICATOR_H }}
      >
        <span className="h-[5px] w-[139px] rounded-full bg-black/25" />
      </div>

      {/* 返回工作台：浮在网页右上角（页面自己的按钮都在左上角），不占页面高度 */}
      <button
        type="button"
        onClick={onBack}
        aria-label="返回工作台"
        className="absolute top-[55px] right-[12px] z-40 flex h-[32px] cursor-pointer items-center gap-[2px] rounded-full bg-white pr-[12px] pl-[6px] text-[13px] leading-none font-medium text-[#347AFB] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
      >
        <ChevronLeft className="size-[18px]" strokeWidth={2.6} />
        返回工作台
      </button>
    </div>
  )
}
