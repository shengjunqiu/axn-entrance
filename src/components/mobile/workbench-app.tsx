import { AppSectionCard } from '@/components/mobile/app-section-card'
import { AppStatusHeader } from '@/components/mobile/app-status-header'
import { AppTabBar } from '@/components/mobile/app-tab-bar'
import { WeatherCard } from '@/components/mobile/weather-card'
import { appSections, SCREEN_H, SCREEN_W } from '@/lib/mobile-data'

/**
 * 手机内模拟页面：安小能「工作台」。
 * 尺寸写死为 428×926（与参考图 axn3.png @3x 一一对应），外层由 IphoneFrame 等比缩放。
 */
export function WorkbenchApp() {
  return (
    <div
      className="flex flex-col overflow-hidden bg-[#F1F3F4] select-none"
      style={{ width: SCREEN_W, height: SCREEN_H }}
    >
      <AppStatusHeader />

      {/* 内容区：参考图未滚动（滚动位置 0） */}
      <div className="min-h-0 flex-1 overflow-y-auto px-[10px] pt-[10px] pb-[10px]">
        <WeatherCard />
        {appSections.map((section) => (
          <AppSectionCard key={section.title} section={section} />
        ))}
      </div>

      <AppTabBar />
    </div>
  )
}
