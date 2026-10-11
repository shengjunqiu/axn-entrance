import { Plus, Settings } from 'lucide-react'
import { orgTabs, statusBar } from '@/lib/mobile-data'

/** iOS 信号强度图标（4 格） */
function SignalBars() {
  return (
    <span className="flex h-[11px] items-end gap-[2px]">
      {[4, 6, 8, 10.5].map((h, i) => (
        <span key={i} className="w-[3px] rounded-[1px] bg-black" style={{ height: h }} />
      ))}
    </span>
  )
}

/** iOS 电量图标：黑底数字 + 未充满部分的灰底 */
function Battery({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-[1px]">
      <span className="relative h-[15px] w-[33px] overflow-hidden rounded-[4.5px] bg-[#3C3C43]/25">
        <span
          className="absolute inset-y-0 left-0 bg-black"
          style={{ width: `${level}%` }}
        />
        <span
          className="absolute inset-y-0 flex items-center text-[11px] font-semibold text-white"
          style={{ left: 0, width: `${level}%` }}
        >
          <span className="w-full text-center">{level}</span>
        </span>
      </span>
      <span className="h-[5px] w-[2px] rounded-r-[1px] bg-[#3C3C43]/40" />
    </span>
  )
}

/**
 * 手机内页头部（参考图 0~151）：状态栏 + 导航条 + 组织切换页签，白底不随内容滚动。
 */
export function AppStatusHeader() {
  return (
    <header className="relative z-10 shrink-0 bg-white">
      {/* 状态栏 */}
      <div className="flex h-[47px] items-center pr-[31px] pl-[53px] text-black">
        <span className="text-[17px] font-semibold tracking-tight">{statusBar.time}</span>
        <div className="ml-auto flex items-center gap-[6px]">
          <SignalBars />
          <span className="text-[13px] font-medium">4G</span>
          <Battery level={statusBar.battery} />
        </div>
      </div>

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
