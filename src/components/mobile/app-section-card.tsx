import { ChevronUp } from 'lucide-react'
import type { AppItem, AppSection } from '@/lib/mobile-data'

function AppTile({ item, onOpenPreview }: { item: AppItem; onOpenPreview: (url: string) => void }) {
  const Icon = item.icon

  const body = (
    <>
      <div className="relative">
        <div
          className="flex size-[45.3px] items-center justify-center rounded-[12px] text-white"
          style={{ backgroundColor: item.color }}
        >
          {Icon ? (
            <Icon className="size-[23px]" strokeWidth={1.9} />
          ) : (
            <span className="text-[22px] leading-none font-semibold tracking-tight">
              {item.text}
            </span>
          )}
        </div>

        {/* 未读数角标 */}
        {item.badge && (
          <span className="absolute -top-[4px] -right-[4px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FE495C] px-[4px] text-[11px] leading-none font-medium text-white">
            {item.badge}
          </span>
        )}
      </div>

      {/* 标签最多两行，宽度收窄到 70px 以复现参考图的换行位置 */}
      <span className="mt-[7px] w-[70px] text-center text-[13px] leading-[16px] text-[#212121]">
        {item.label}
      </span>
    </>
  )

  // 有 previewUrl 的入口渲染成 <button>，点击后在手机屏幕内打开该页面（见 phone-browser.tsx）；
  // 样式类与普通图标块保持一致，保证网格布局不变
  if (item.previewUrl) {
    const url = item.previewUrl
    return (
      <button
        type="button"
        onClick={() => onOpenPreview(url)}
        className="flex cursor-pointer flex-col items-center p-0"
      >
        {body}
      </button>
    )
  }

  return <div className="flex flex-col items-center">{body}</div>
}

/** 首页分区卡片：标题 + 5 列应用网格（参考图里卡片与屏幕等宽内边距 10，网格铺满卡片） */
export function AppSectionCard({
  section,
  onOpenPreview,
}: {
  section: AppSection
  onOpenPreview: (url: string) => void
}) {
  return (
    <section className="mt-[7px] rounded-[18px] bg-white pb-[17px]">
      <header className="flex h-[60px] items-center justify-between px-[16px]">
        <h2 className="text-[17px] leading-none font-bold text-[#212121]">{section.title}</h2>
        <ChevronUp className="size-[18px] text-[#B4B8BE]" strokeWidth={2.4} />
      </header>

      <div className="grid grid-cols-5 gap-y-[17px] pt-[4px]">
        {section.items.map((item) => (
          <AppTile key={item.label + item.color} item={item} onOpenPreview={onOpenPreview} />
        ))}
      </div>
    </section>
  )
}
