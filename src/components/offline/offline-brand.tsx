import figureUrl from '@/assets/an-xiaoneng-figure.png'
import { cn } from '@/lib/utils'

const avatarSizes = {
  sm: 'size-8 rounded-lg [&>img]:size-[26px]',
  md: 'size-9 rounded-lg [&>img]:size-7',
  lg: 'size-16 rounded-2xl [&>img]:size-12 sm:size-[72px] sm:[&>img]:size-14',
} as const

export function OfflineAvatar({ size = 'md', className }: { size?: keyof typeof avatarSizes; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('grid shrink-0 place-items-center bg-linear-to-b from-(--offline-accent-surface) to-background ring-1 ring-primary/10 ring-inset', avatarSizes[size], className)}
    >
      <img src={figureUrl} alt="" className="object-contain" />
    </div>
  )
}

export function OfflineStatus({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-5 shrink-0 items-center rounded-md bg-(--offline-accent-surface) px-1.5 text-[11px] leading-none font-medium whitespace-nowrap text-primary ring-1 ring-primary/15 ring-inset', className)}>
      离线版
    </span>
  )
}
