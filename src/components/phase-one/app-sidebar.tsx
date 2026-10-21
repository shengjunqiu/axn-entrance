import { ChevronDown, ChevronUp, PanelLeftClose, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sideItems, type SideItem } from '@/lib/phase-one-data'
import { Link } from 'react-router-dom'

/** 品牌 logo：白底圆 + 蓝红「A」形标记（参考图 logo 的近似画法） */
function BrandLogo() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.14)]">
      <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
        <path d="M13.4 6.5 20.4 25h-4.6l-2.4-7-2.6 7H6.2z" fill="#2F6BFF" />
        <path d="M17.6 6.5h8.4L20.5 25h-4.4z" fill="#EE3B33" />
      </svg>
    </span>
  )
}

function MenuRow({ item }: { item: SideItem }) {
  const child = item.level === 'child'
  const Icon = item.icon

  const content = (
    <div
      className={cn(
        'relative flex items-center',
        item.active && 'bg-[#2C4A8C]',
        item.dark && 'bg-[#1D2B4F]',
        child ? 'h-[45px]' : 'h-[60px] border-b border-white/7',
      )}
    >
      {/* 选中项左侧亮蓝竖条 */}
      {item.active && <span className="absolute inset-y-0 left-0 w-[3px] bg-[#3B86F2]" />}

      {child ? (
        <>
          <Icon className="ml-[57px] size-[11px] text-[#8C99B4]" strokeWidth={3} />
          <span className="ml-[14px] text-[15px] text-[#E4EAF6]">{item.label}</span>
        </>
      ) : (
        <>
          <Icon className="ml-[30px] size-[17px] shrink-0 text-[#DCE4F2]" strokeWidth={1.6} />
          <span className="ml-[14px] text-[15px] text-[#E4EAF6]">{item.label}</span>
          {item.chevron === 'up' && <ChevronUp className="ml-auto mr-4 size-4 text-[#C6D0E4]" />}
          {item.chevron === 'down' && <ChevronDown className="ml-auto mr-4 size-4 text-[#C6D0E4]" />}
        </>
      )}
    </div>
  )
  return item.href ? <Link to={item.href} className="block cursor-pointer hover:brightness-110" aria-current={item.active ? 'page' : undefined}>{content}</Link> : content
}

/** 左侧深色导航栏（参考图 axn2.png 左侧） */
export function AppSidebar({ items = sideItems, userName = '王小明' }: { items?: SideItem[]; userName?: string }) {
  return (
    <aside className="relative flex w-60 shrink-0 flex-col bg-[#2A3962] text-[#E4EAF6]">
      {/* 品牌区 */}
      <div className="relative h-[146px] shrink-0 overflow-hidden bg-[linear-gradient(155deg,#30528E_0%,#2A3E89_100%)] px-4 pt-9">
        {/* 斜向纹理 */}
        <span className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:repeating-linear-gradient(118deg,rgba(255,255,255,.9)_0_2px,transparent_2px_16px)]" />
        <div className="relative flex items-center justify-center gap-3">
          <BrandLogo />
          <span className="text-[18px] font-bold tracking-wide text-white">应急救援</span>
        </div>
        <p className="relative mt-6 text-center text-[23px] leading-none font-bold tracking-tight text-white">
          综合业务管理系统
        </p>
      </div>

      {/* 菜单 */}
      <nav className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <MenuRow key={item.label} item={item} />
        ))}
      </nav>

      {/* 折叠按钮 */}
      <button
        type="button"
        aria-label="收起菜单"
        className="absolute right-2 bottom-[142px] flex size-7 items-center justify-center rounded text-[#B9C3D6]/70 transition hover:text-white"
      >
        <PanelLeftClose className="size-4" strokeWidth={1.6} />
      </button>

      {/* 用户与技术支持 */}
      <div className="shrink-0 bg-[#2D4171] px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#7C8BA6_0%,#2A3A55_60%,#16202F_100%)] ring-2 ring-white/10">
            <span className="text-[15px] font-medium text-white/85">{userName[0]}</span>
          </span>
          <span className="text-[15px] text-white">{userName}</span>
        </div>

        <div className="mt-3 border-t border-dashed border-white/25 pt-3">
          <p className="flex items-center gap-2 text-[13px] text-[#C3CDE0]">
            <Phone className="size-[15px] text-[#8FA6D6]" strokeWidth={1.8} />
            技术支持：
          </p>
          <p className="mt-1 text-[13px] leading-snug text-white">
            18501981563、15801264928
          </p>
        </div>
      </div>
    </aside>
  )
}
