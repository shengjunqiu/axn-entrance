import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { openedTabs } from '@/lib/phase-one-data'
import { Link } from 'react-router-dom'

/** 已打开页签栏（参考图 axn2.png 顶栏下方一行） */
export function AppTabBar({ tabs = openedTabs }: { tabs?: { label: string; active: boolean }[] }) {
  return (
    <div className="flex h-11 shrink-0 items-stretch bg-[#F9F9F9] pr-3">
      {tabs.map((tab) => (
        <div
          key={tab.label}
          className={cn(
            'flex items-center gap-2.5 border-r border-[#EFF2F6] bg-white px-4 text-[15px] whitespace-nowrap',
            tab.active
              ? 'border-b-2 border-b-[#367AF0] text-[#367AF0]'
              : 'text-[#3A4256]',
          )}
        >
          {tab.label === '编写日报' ? <Link to="/phase-one/duty-report/new" className="hover:text-[#367AF0]">{tab.label}</Link> : tab.label}
          <X className="size-3.5 text-[#98A0AE]" strokeWidth={2} />
        </div>
      ))}

      {/* 右侧「更多页签」 */}
      <div className="ml-auto flex items-center bg-[#EFF2F7] px-4">
        <ChevronDown className="size-4 text-[#7C8698]" strokeWidth={2} />
      </div>
    </div>
  )
}
