import { IphoneFrame } from '@/components/mobile/iphone-frame'
import { WorkbenchApp } from '@/components/mobile/workbench-app'

/**
 * 移动端集成入口：把模拟 iPhone 摆在一个展示页上，手机内展示安小能「工作台」页面。
 * 手机内页面是固定 428×926 的逻辑坐标系，由 IphoneFrame 等比缩放适配窗口。
 */
export function MobilePage() {
  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden bg-[#0B1220]">
      {/* 背景光效 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_80%_at_50%_-10%,#1E3A8A_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_115%,#1D4ED8_0%,transparent_60%)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:22px_22px]" />

      <header className="relative z-10 shrink-0 px-6 pt-7 pb-2 text-center">
        <h1 className="text-[17px] font-semibold tracking-wide text-white/90">移动端集成入口</h1>
        <p className="mt-1.5 text-[12px] text-white/45">
          安小能 · 工作台（iPhone 模拟演示）
        </p>
      </header>

      <IphoneFrame>
        <WorkbenchApp />
      </IphoneFrame>
    </div>
  )
}
