import { tabBarItems } from '@/lib/mobile-data'

/** 底部页签栏（参考图 y 846 起，含 31px 安全区） */
export function AppTabBar() {
  return (
    <nav className="flex h-[80px] shrink-0 items-start bg-white pt-[2px]">
      {tabBarItems.map((item) => {
        const Icon = item.icon
        const color = item.active ? '#347AFB' : undefined

        return (
          <div key={item.label} className="flex flex-1 flex-col items-center">
            <span className="relative">
              <Icon
                className={item.active ? 'size-[19px] text-[#347AFB]' : 'size-[19px] text-[#404957]'}
                strokeWidth={1.9}
              />
              {item.dot && (
                <span className="absolute -top-[3px] -right-[3px] size-[8px] rounded-full bg-[#FE495C]" />
              )}
            </span>
            <span
              className="mt-[9px] text-[12px] leading-[14px]"
              style={{ color: color ?? '#707781' }}
            >
              {item.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}
