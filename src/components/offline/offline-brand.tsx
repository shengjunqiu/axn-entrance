import { AN_XIAONENG_ICON_URL } from '@/lib/an-xiaoneng-icon'
import { cn } from '@/lib/utils'

const avatarSizes = {
  sm: 'size-8 rounded-lg',
  md: 'size-9 rounded-lg',
  lg: 'size-16 rounded-2xl sm:size-[72px]',
} as const

export function OfflineAvatar({ size = 'md', className }: { size?: keyof typeof avatarSizes; className?: string }) {
  return (
    <img src={AN_XIAONENG_ICON_URL} alt="" className={cn('shrink-0', avatarSizes[size], className)} />
  )
}

export function OfflineStatus({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex h-5 shrink-0 items-center rounded-md bg-(--offline-accent-surface) px-1.5 text-[11px] leading-none font-medium whitespace-nowrap text-primary ring-1 ring-primary/15 ring-inset', className)}>
      离线版
    </span>
  )
}
