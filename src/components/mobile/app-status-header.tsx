import { Plus, Settings } from 'lucide-react'
import { StatusBar } from '@/components/mobile/status-bar'
import { orgTabs } from '@/lib/mobile-data'

/**
 * 手机内页头部（参考图 0~151）：状态栏 + 导航条 + 组织切换页签，白底不随内容滚动。
 */
export function AppStatusHeader() {
  return (
    <header className="relative z-10 shrink-0 bg-white">
      <StatusBar />

      {/* 导航条 */}
      <div className="flex h-[58px] items-center justify-between pt-[4px] pr-[16px] pl-[14px]">
        <h1 className="text-[21px] leading-none font-bold text-[#212121]">工作台</h1>
        <div className="flex items-center gap-[21px] text-[#212121]">
          <Settings className="size-[21px]" strokeWidth={1.9} />
          <Plus className="size-[23px]" strokeWidth={2} />
        </div>
      </div>

      {/* 组织切换页签 */}
      <div className="flex h-[46px] items-center gap-[32px] pl-[20px]">
        {orgTabs.map((tab) => (
          <span
            key={tab.label}
            className={
              'relative text-[15px] leading-none ' +
              (tab.active ? 'font-medium text-[#347AFB]' : 'text-[#6C737E]')
            }
          >
            {tab.label}

            {tab.dot && (
              <span className="absolute -top-[4px] -right-[2px] size-[6px] rounded-full bg-[#FE495C]" />
            )}
            {tab.badge && (
              <span className="absolute -top-[12.5px] -right-[9.5px] flex size-[19px] items-center justify-center rounded-full bg-[#FE495C] text-[12px] font-medium text-white">
                {tab.badge}
              </span>
            )}
            {tab.active && (
              <span className="absolute -bottom-[15px] left-1/2 h-[4px] w-[28px] -translate-x-1/2 rounded-[2px] bg-[#347AFB]" />
            )}
          </span>
        ))}
      </div>
    </header>
  )
}
