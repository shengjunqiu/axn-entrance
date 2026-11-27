import { Wifi } from 'lucide-react'
import { AlertDialog } from 'radix-ui'
import { Button } from '@/components/ui/button'
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

export function OfflineStatus() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        type="button"
        aria-label="安小能离线版"
        className="inline-flex h-6 shrink-0 cursor-pointer items-center rounded-md bg-(--offline-accent-surface) px-1.5 text-[11px] leading-none font-medium whitespace-nowrap text-primary ring-1 ring-primary/15 ring-inset transition-colors hover:bg-primary/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        离线版
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[60] bg-black/30" />
        <AlertDialog.Content className="offline-assistant fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-4 text-foreground shadow-(--offline-shadow-lg)">
          <AlertDialog.Title className="flex items-center gap-2 text-base font-semibold">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-(--offline-accent-surface) text-primary" aria-hidden="true">
              <Wifi className="size-4" />
            </span>
            当前网络已恢复
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-5 text-muted-foreground">
            是否返回「安小能在线版」继续使用？
          </AlertDialog.Description>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">继续使用离线版</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button>返回在线版</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
