import { AppSidebar } from '@/components/phase-one/app-sidebar'
import { AssistantWidget } from '@/components/phase-one/assistant-widget'
import { AppTabBar } from '@/components/phase-one/app-tab-bar'
import { AppTopNav } from '@/components/phase-one/app-top-nav'
import { IncidentList } from '@/components/phase-one/incident-list'

/**
 * 一期系统集成入口：模拟「应急救援综合业务管理系统」页面。
 * 纯静态展示，所有控件没有交互逻辑，仅还原参考图 axn2.png 的视觉。
 */
export function PhaseOnePage() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-white">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopNav />
        <AppTabBar />

        <main className="flex-1 overflow-auto bg-[#EAECF1] p-2.5">
          <IncidentList />
        </main>
      </div>

      <AssistantWidget />
    </div>
  )
}
