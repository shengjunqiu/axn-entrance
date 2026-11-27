import { useRef, useState } from 'react'
import { ChevronsUpDown, Ellipsis, LogOut, Pin, PinOff, Search, SquarePen, Trash2, UserRound, X } from 'lucide-react'
import { Dialog, DropdownMenu } from 'radix-ui'
import { OfflineAvatar, OfflineStatus } from '@/components/offline/offline-brand'
import { Button } from '@/components/ui/button'
import type { OfflineConversation } from '@/lib/offline-chat-history'

export const offlineMenuContentClass = 'z-50 min-w-36 rounded-xl border border-border bg-background p-1 text-foreground shadow-(--offline-shadow-lg) outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95'
export const offlineMenuItemClass = 'flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm outline-none select-none data-highlighted:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground'
export const offlineDangerItemClass = `${offlineMenuItemClass} text-red-600 data-highlighted:bg-red-50 [&_svg]:text-red-500`

const dayMs = 24 * 60 * 60 * 1000

function recencyGroup(updatedAt: number) {
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  if (updatedAt >= startOfToday) return '今天'
  if (updatedAt >= startOfToday - dayMs) return '昨天'
  if (updatedAt >= startOfToday - 6 * dayMs) return '近 7 天'
  return '更早'
}

type OfflineChatSidebarProps = {
  conversations: OfflineConversation[]
  activeId: string | null
  profile: string | null
  mobile: boolean
  onNewChat: () => void
  onSelect: (id: string) => void
  onPin: (id: string, pinned: boolean) => void
  onDelete: (id: string) => void
  onSignIn: () => void
  onSignOut: () => void
}

export function OfflineChatSidebar({ conversations, activeId, profile, mobile, onNewChat, onSelect, onPin, onDelete, onSignIn, onSignOut }: OfflineChatSidebarProps) {
  const [search, setSearch] = useState('')
  const searchField = useRef<HTMLInputElement>(null)
  const query = search.trim().toLocaleLowerCase()
  const visibleConversations = query
    ? conversations.filter(({ turns }) => turns.some(({ question }) => question.toLocaleLowerCase().includes(query)))
    : conversations

  const groups: { title: string; items: OfflineConversation[] }[] = []
  const pinned = visibleConversations.filter((conversation) => conversation.pinned)
  if (pinned.length) groups.push({ title: '置顶', items: pinned })
  for (const conversation of visibleConversations) {
    if (conversation.pinned) continue
    const title = recencyGroup(conversation.updatedAt)
    const group = groups.find((item) => item.title === title)
    if (group) group.items.push(conversation)
    else groups.push({ title, items: [conversation] })
  }

  const Title = mobile ? Dialog.Title : 'h2'

  return (
    <>
      <div className="shrink-0 px-3 pt-3 pb-2">
        <header className="mb-4 flex h-11 items-center gap-2.5 pl-0.5">
          <OfflineAvatar size="md" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Title id={mobile ? undefined : 'desktop-history-title'} className="truncate text-base leading-none font-semibold">安小能</Title>
            <OfflineStatus />
          </div>
          {mobile && (
            <Dialog.Close asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="关闭历史会话" className="size-9 text-muted-foreground hover:text-foreground">
                <X className="size-5" aria-hidden="true" />
              </Button>
            </Dialog.Close>
          )}
        </header>

        <Button
          type="button"
          variant="outline"
          className="h-9 w-full justify-start gap-2 rounded-lg border-border bg-background px-2.5 font-medium transition-[border-color,color] hover:border-foreground/20 hover:bg-background hover:text-primary"
          onClick={onNewChat}
        >
          <SquarePen className="size-4 text-primary" aria-hidden="true" />
          新建对话
        </Button>

        <div className="mt-2 flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-muted-foreground transition-[border-color,box-shadow] hover:border-foreground/20 focus-within:border-primary/50 focus-within:text-foreground focus-within:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_12%,transparent)]">
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <input
            ref={searchField}
            type="search"
            aria-label="搜索会话"
            placeholder="搜索会话"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/90 lg:text-sm [&::-webkit-search-cancel-button]:appearance-none"
          />
          {search && (
            <button
              type="button"
              aria-label="清空搜索"
              className="-mr-1.5 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md hover:bg-foreground/5"
              onClick={() => {
                setSearch('')
                searchField.current?.focus()
              }}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <nav aria-label="历史会话" className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 pt-2 pb-4 [scrollbar-width:thin]">
        {groups.length === 0 ? (
          <div role="status" className="flex flex-col items-center gap-2 px-2 py-10 text-center text-[13px] text-muted-foreground">
            <Search className="size-[18px]" aria-hidden="true" />
            <p>{query ? '没有匹配的会话' : '还没有会话，开始第一次提问吧'}</p>
          </div>
        ) : (
          groups.map(({ title, items }) => (
            <section key={title} aria-label={title}>
              <h3 className="mb-1 px-2.5 text-xs font-medium text-muted-foreground/80">{title}</h3>
              <ul className="space-y-px">
                {items.map(({ id, pinned: isPinned, turns }) => {
                  const question = turns[0].question
                  const current = id === activeId
                  return (
                    <li key={id}>
                      <div
                        data-current={current || undefined}
                        className="group flex items-center rounded-lg transition-colors hover:bg-foreground/[0.045] data-current:bg-background data-current:shadow-(--offline-shadow-sm) data-current:ring-1 data-current:ring-border"
                      >
                        <button
                          type="button"
                          aria-current={current ? 'true' : undefined}
                          className="min-h-10 min-w-0 flex-1 cursor-pointer truncate rounded-lg px-2.5 text-left text-sm text-foreground/85 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring group-data-current:font-medium group-data-current:text-foreground"
                          title={question}
                          onClick={() => onSelect(id)}
                        >
                          {question}
                        </button>
                        <DropdownMenu.Root modal={false}>
                          <DropdownMenu.Trigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`会话操作：${question}`}
                              className="mr-1 size-7 shrink-0 text-muted-foreground transition-opacity hover:bg-foreground/5 hover:text-foreground lg:opacity-0 lg:group-hover:opacity-100 lg:group-data-current:opacity-100 lg:focus-visible:opacity-100 lg:data-[state=open]:opacity-100"
                            >
                              <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content align="start" sideOffset={4} className={`offline-assistant ${offlineMenuContentClass}`}>
                              <DropdownMenu.Item className={offlineMenuItemClass} onSelect={() => onPin(id, !isPinned)}>
                                {isPinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
                                {isPinned ? '取消置顶' : '置顶'}
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="mx-1 my-1 h-px bg-border" />
                              <DropdownMenu.Item className={offlineDangerItemClass} onSelect={() => onDelete(id)}>
                                <Trash2 aria-hidden="true" />
                                删除
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </nav>

      <footer className="shrink-0 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="rounded-xl border border-border bg-background p-1.5" aria-live="polite">
          {profile ? (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  aria-label={`账户：${profile}`}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring data-[state=open]:bg-muted"
                >
                  <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary)_60%,#7dd3fc)] text-sm font-semibold text-primary-foreground" aria-hidden="true">
                    {Array.from(profile)[0]}
                    <span className="absolute -right-px -bottom-px size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm leading-tight font-medium">{profile}</span>
                    <span className="mt-0.5 block text-xs leading-tight text-muted-foreground">本地账户</span>
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content side="top" align="start" sideOffset={8} className={`offline-assistant ${offlineMenuContentClass} w-(--radix-dropdown-menu-trigger-width)`}>
                  <DropdownMenu.Item className={offlineDangerItemClass} onSelect={onSignOut}>
                    <LogOut aria-hidden="true" />
                    退出登录
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <div className="flex items-center gap-2.5 p-1.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed border-muted-foreground/35 bg-muted text-muted-foreground" aria-hidden="true">
                <UserRound className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-tight font-medium">未登录</span>
                <span className="mt-0.5 block truncate text-xs leading-tight text-muted-foreground">访客模式</span>
              </span>
              <Button type="button" size="sm" className="h-8 shrink-0 rounded-lg px-3.5 text-[13px] font-medium" onClick={onSignIn}>
                登录
              </Button>
            </div>
          )}
        </div>
      </footer>
    </>
  )
}
