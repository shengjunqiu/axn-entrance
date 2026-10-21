import { LogOut, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toneStyles, topModules } from '@/lib/phase-one-data'
import { Link } from 'react-router-dom'

/** 顶部业务模块导航（参考图 axn2.png 顶部一行） */
export function AppTopNav({ activeModule = '信息接报' }: { activeModule?: string }) {
  return (
    <header className="flex h-24 shrink-0 items-stretch bg-white">
      {/* 八个模块靠右排列，右侧再留出工具栏 */}
      <div className="ml-auto flex items-stretch">
        {topModules.map((module) => {
          const Icon = module.icon
          const active = module.label === activeModule
          const content = (
            <div
              key={module.label}
              className={cn(
                'flex w-[116px] shrink-0 flex-col items-center justify-center gap-1.5',
                active && 'border-b-2 border-[#367AF0] bg-[#EAF1FD]',
              )}
            >
              <span
                className={cn(
                  'flex size-[35px] items-center justify-center rounded-lg border',
                  toneStyles[module.tone],
                )}
              >
                <Icon className="size-[19px]" strokeWidth={1.6} />
              </span>
              <span
                className={cn(
                  'text-[15px]',
                  active ? 'text-[#2F7BFF]' : 'text-[#3A4256]',
                )}
              >
                {module.label}
              </span>
            </div>
          )
          const href = module.label === '值班值守' ? '/phase-one/duty-report/new' : module.label === '信息接报' ? '/phase-one' : undefined
          return href ? <Link key={module.label} to={href} className="flex hover:bg-[#F2F6FC]" aria-current={active ? 'page' : undefined}>{content}</Link> : content
        })}
      </div>

      {/* 右侧工具区 */}
      <div className="flex w-[156px] shrink-0 items-center justify-center gap-4 bg-[#F7F9FB] text-[#5A6376]">
        <Monitor className="size-[22px]" strokeWidth={1.5} />
        <span className="h-7 w-px bg-[#DDE2EA]" />
        <LogOut className="size-[22px]" strokeWidth={1.5} />
      </div>
    </header>
  )
}
