import { statusBar } from '@/lib/mobile-data'

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
 * iOS 状态栏（参考图 0~47）：时间 + 信号 + 4G + 电量，高 47。
 * 工作台头部和内嵌网页视图共用，保证手机顶部始终是同一个状态栏。
 */
export function StatusBar() {
  return (
    <div className="flex h-[47px] shrink-0 items-center bg-white pr-[31px] pl-[53px] text-black">
      <span className="text-[17px] font-semibold tracking-tight">{statusBar.time}</span>
      <div className="ml-auto flex items-center gap-[6px]">
        <SignalBars />
        <span className="text-[13px] font-medium">4G</span>
        <Battery level={statusBar.battery} />
      </div>
    </div>
  )
}
