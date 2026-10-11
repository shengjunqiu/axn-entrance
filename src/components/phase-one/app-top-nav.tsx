import { LogOut, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toneStyles, topModules } from '@/lib/phase-one-data'

/** 顶部业务模块导航（参考图 axn2.png 顶部一行） */
export function AppTopNav() {
  return (
    <header className="flex h-24 shrink-0 items-stretch bg-white">
      {/* 八个模块靠右排列，右侧再留出工具栏 */}
      <div className="ml-auto flex items-stretch">
        {topModules.map((module) => {
          const Icon = module.icon
          return (
            <div
              key={module.label}
              className={cn(
                'flex w-[116px] shrink-0 flex-col items-center justify-center gap-1.5',
                module.active && 'border-b-2 border-[#367AF0] bg-[#EAF1FD]',
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
                  module.active ? 'text-[#2F7BFF]' : 'text-[#3A4256]',
                )}
              >
                {module.label}
              </span>
            </div>
          )
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
