import type { CSSProperties } from 'react'
import { PortalBackground } from '@/components/portal-background'
import { PortalCard } from '@/components/portal-card'
import { portalEntries, type PortalEntry } from '@/lib/portal-entries'

/**
 * 卡片宽度：5 张卡 + 间隙占整屏 88vw，同时不超过 33.5vh（高宽比 971:679），取小值。
 * 间隙为卡片宽度的 11.57%，与参考图一致。
 */
const rowStyle = {
  '--card-w': 'min(16.1vw, 33.5vh)',
  gap: 'calc(min(16.1vw, 33.5vh) * 0.1157)',
} as CSSProperties

/** 桌面门户集成入口：与参考图 axn.png 一致的整屏门户页 */
export function PortalPage() {
  const handleEnter = (entry: PortalEntry) => {
    // TODO: 各入口的跳转目标待确认后在此实现
    console.log('[portal entry]', entry.id)
  }

  return (
    <div className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[#1f3382]">
      <PortalBackground />

      <div className="relative z-10 flex items-center justify-center" style={rowStyle}>
        {portalEntries.map((entry) => (
          <PortalCard key={entry.id} entry={entry} onEnter={handleEnter} />
        ))}
      </div>
    </div>
  )
}
