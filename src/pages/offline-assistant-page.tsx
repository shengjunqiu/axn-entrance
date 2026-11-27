import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Ellipsis, Menu, Pin, PinOff, SquarePen, Trash2 } from 'lucide-react'
import { Dialog, DropdownMenu } from 'radix-ui'
import { OfflineAvatar } from '@/components/offline/offline-brand'
import { OfflineChatSidebar, offlineDangerItemClass, offlineMenuContentClass, offlineMenuItemClass } from '@/components/offline/offline-chat-sidebar'
import { OfflineChatTranscript } from '@/components/offline/offline-chat-transcript'
import { OfflineComposer } from '@/components/offline/offline-composer'
import { OfflineLoginView } from '@/components/offline/offline-login-view'
import { Button } from '@/components/ui/button'
import { answerOfflineQuestion } from '@/lib/offline-chat-demo'
import {
  appendOfflineTurn,
  deleteOfflineConversation,
  loadOfflineHistory,
  offlineHistoryStorageKey,
  restoreOfflineConversation,
  setOfflineConversationPinned,
  type ChatAttachment,
  type OfflineConversation,
} from '@/lib/offline-chat-history'
import './offline-assistant.css'

const profileKey = 'axn-offline-display-name'
const desktopBreakpoint = '(min-width: 1024px)'
const undoDuration = 5000

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(desktopBreakpoint)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function isDesktop() {
  return window.matchMedia(desktopBreakpoint).matches
}

function loadProfile() {
  try {
    return localStorage.getItem(profileKey)?.trim() || null
  } catch {
    return null
  }
}

export function OfflineAssistantPage() {
  const [draft, setDraft] = useState('')
  const [history, setHistory] = useState(loadOfflineHistory)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [profile, setProfile] = useState(loadProfile)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [streaming, setStreaming] = useState<{ id: string; index: number } | null>(null)
  const [deleted, setDeleted] = useState<{ conversation: OfflineConversation; wasActive: boolean } | null>(null)
  const desktop = useSyncExternalStore(subscribeToDesktop, isDesktop)
  const page = useRef<HTMLElement>(null)
  const composer = useRef<HTMLTextAreaElement>(null)
  const focusComposerAfterHistory = useRef(false)
  const activeConversation = history.conversations.find(({ id }) => id === activeId)
  const turns = activeConversation?.turns
  const streamingIndex = streaming && streaming.id === activeId ? streaming.index : null
  const generating = streamingIndex !== null

  useEffect(() => {
    function syncHistory(event: StorageEvent) {
      if (event.key === offlineHistoryStorageKey || event.key === null) {
        const updated = loadOfflineHistory()
        setHistory((current) => current.saved ? updated : current)
      }
    }

    window.addEventListener('storage', syncHistory)
    return () => window.removeEventListener('storage', syncHistory)
  }, [])

  useLayoutEffect(() => {
    const viewport = window.visualViewport
    const element = page.current
    if (!viewport || !element) return

    const updateViewport = () => {
      // A mobile keyboard can both shrink and pan the visual viewport.
      if (viewport.scale !== 1) return
      element.style.setProperty('--offline-height', `${viewport.height}px`)
      element.style.setProperty('--offline-top', `${viewport.offsetTop}px`)
    }

    updateViewport()
    viewport.addEventListener('resize', updateViewport)
    viewport.addEventListener('scroll', updateViewport)
    return () => {
      viewport.removeEventListener('resize', updateViewport)
      viewport.removeEventListener('scroll', updateViewport)
    }
  }, [])

  useEffect(() => {
    if (!deleted) return
    const timer = window.setTimeout(() => setDeleted(null), undoDuration)
    return () => window.clearTimeout(timer)
  }, [deleted])

  function updateProfile(name: string | null) {
    setProfile(name)
    try {
      if (name) localStorage.setItem(profileKey, name)
      else localStorage.removeItem(profileKey)
    } catch {
      // The identity remains available for this visit when browser storage is blocked.
    }
  }

  function returnToHistory() {
    setLoginOpen(false)
    setHistoryOpen(!desktop)
  }

  function selectConversation(id: string | null) {
    if (id !== activeId) {
      setDraft('')
      setStreaming(null)
    }
    setActiveId(id)
  }

  function startConversation() {
    selectConversation(null)
    if (historyOpen && !desktop) {
      focusComposerAfterHistory.current = true
      setHistoryOpen(false)
    } else {
      composer.current?.focus({ preventScroll: true })
    }
  }

  function sendMessage(question: string, attachments: ChatAttachment[] = []) {
    if (!question || generating) return

    const { history: updated, id } = appendOfflineTurn(history, activeId, answerOfflineQuestion(question, attachments))
    const index = updated.conversations.find((conversation) => conversation.id === id)!.turns.length - 1
    setHistory(updated)
    setActiveId(id)
    setStreaming({ id, index })
    setDraft('')
  }

  function deleteConversation(id: string) {
    const conversation = history.conversations.find((item) => item.id === id)
    if (!conversation) return
    setHistory(deleteOfflineConversation(history, id))
    setDeleted({ conversation, wasActive: id === activeId })
    if (id === activeId) selectConversation(null)
  }

  function undoDelete() {
    if (!deleted) return
    setHistory(restoreOfflineConversation(history, deleted.conversation))
    if (deleted.wasActive) setActiveId(deleted.conversation.id)
    setDeleted(null)
  }

  const sidebar = (
    <OfflineChatSidebar
      conversations={history.conversations}
      activeId={activeId}
      profile={profile}
      mobile={!desktop}
      onNewChat={startConversation}
      onPin={(id, pinned) => setHistory(setOfflineConversationPinned(history, id, pinned))}
      onDelete={deleteConversation}
      onSelect={(id) => {
        selectConversation(id)
        setHistoryOpen(false)
      }}
      onSignIn={() => {
        setHistoryOpen(false)
        setLoginOpen(true)
      }}
      onSignOut={() => updateProfile(null)}
    />
  )

  const title = turns?.[0].question ?? '新对话'

  return (
    <main ref={page} className="offline-assistant offline-assistant-page flex min-w-0 overflow-clip bg-background text-foreground antialiased lg:bg-muted">
      {loginOpen ? (
        <OfflineLoginView
          onBack={returnToHistory}
          onSignIn={(name) => {
            updateProfile(name)
            returnToHistory()
          }}
        />
      ) : (
        <Dialog.Root open={historyOpen && !desktop} onOpenChange={setHistoryOpen}>
          {desktop ? (
            <aside aria-labelledby="desktop-history-title" className="flex w-[272px] shrink-0 flex-col bg-muted">
              {sidebar}
            </aside>
          ) : (
            <>
              <Dialog.Overlay className="absolute inset-0 z-30 bg-foreground/25 backdrop-blur-[2px] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in motion-reduce:animate-none" />
              <Dialog.Content
                aria-describedby={undefined}
                className="absolute inset-y-0 left-0 z-40 flex w-[85%] max-w-[320px] flex-col bg-muted shadow-(--offline-shadow-lg) duration-200 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-full data-[state=open]:animate-in data-[state=open]:slide-in-from-left-full motion-reduce:animate-none"
                onCloseAutoFocus={(event) => {
                  if (focusComposerAfterHistory.current) {
                    focusComposerAfterHistory.current = false
                    event.preventDefault()
                    composer.current?.focus({ preventScroll: true })
                  }
                }}
              >
                {sidebar}
              </Dialog.Content>
            </>
          )}

          <div className="relative flex min-w-0 flex-1 flex-col lg:my-2 lg:mr-2 lg:overflow-hidden lg:rounded-2xl lg:bg-background lg:shadow-(--offline-shadow-sm) lg:ring-1 lg:ring-border/80">
            {deleted && (
              <div
                role="status"
                className="pointer-events-none absolute inset-x-0 top-16 z-20 flex justify-center px-4 duration-200 animate-in fade-in slide-in-from-top-2 motion-reduce:animate-none"
              >
                <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-foreground py-1.5 pr-1.5 pl-4 text-sm text-background shadow-(--offline-shadow-lg)">
                  已删除会话
                  <button type="button" className="h-7 cursor-pointer rounded-full px-3 font-medium text-background transition-colors hover:bg-background/15" onClick={undoDelete}>
                    撤销
                  </button>
                </div>
              </div>
            )}
            <header className="flex h-14 shrink-0 items-center gap-1 border-b border-border/70 px-2 lg:border-transparent lg:px-5">
              {!desktop && (
                <Dialog.Trigger asChild>
                  <Button type="button" variant="ghost" size="icon-lg" aria-label="历史会话" title="历史会话" className="size-10 text-muted-foreground">
                    <Menu className="size-5" aria-hidden="true" />
                  </Button>
                </Dialog.Trigger>
              )}
              <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-medium lg:text-left" title={title}>
                {title}
              </h1>
              {desktop && activeConversation && (
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger asChild>
                    <Button type="button" variant="ghost" size="icon-lg" aria-label="当前会话操作" title="会话操作" className="text-muted-foreground">
                      <Ellipsis className="size-[18px]" aria-hidden="true" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content align="end" sideOffset={6} className={`offline-assistant ${offlineMenuContentClass}`}>
                      <DropdownMenu.Item className={offlineMenuItemClass} onSelect={() => setHistory(setOfflineConversationPinned(history, activeConversation.id, !activeConversation.pinned))}>
                        {activeConversation.pinned ? <PinOff aria-hidden="true" /> : <Pin aria-hidden="true" />}
                        {activeConversation.pinned ? '取消置顶' : '置顶'}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="mx-1 my-1 h-px bg-border" />
                      <DropdownMenu.Item className={offlineDangerItemClass} onSelect={() => deleteConversation(activeConversation.id)}>
                        <Trash2 aria-hidden="true" />
                        删除会话
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
              {!desktop && (
                <Button type="button" variant="ghost" size="icon-lg" aria-label="新建对话" title="新建对话" className="size-10 text-muted-foreground" onClick={startConversation}>
                  <SquarePen className="size-5" aria-hidden="true" />
                </Button>
              )}
            </header>

            <div data-empty={!turns?.length || undefined} className="offline-chat-workspace flex min-h-0 flex-1 flex-col">
              {!turns?.length ? (
                <div className="offline-welcome flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
                  <div className="mx-auto my-auto w-full max-w-(--offline-chat-width) shrink-0 px-4 pt-8 pb-[max(2rem,12vh)] duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:px-6 lg:pb-8">
                    <OfflineAvatar size="lg" className="mx-auto mb-6 bg-background shadow-(--offline-shadow-md)" />
                    <h2 className="text-center text-2xl leading-tight font-semibold sm:text-[28px]">你好，我是安小能</h2>
                    <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-balance text-muted-foreground">
                      你的应急救援知识问答助手
                    </p>
                  </div>
                </div>
              ) : (
                <OfflineChatTranscript
                  key={activeId}
                  turns={turns}
                  streamingIndex={streamingIndex}
                  onStreamDone={() => setStreaming(null)}
                  onRegenerate={() => activeId && setStreaming({ id: activeId, index: turns.length - 1 })}
                />
              )}

              <div className="shrink-0">
                <div className="mx-auto w-full max-w-(--offline-chat-width) px-3 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-3">
                  {!history.saved && <p role="status" className="mb-2 px-2 text-xs text-amber-700">浏览器存储不可用，本次改动可能无法在刷新后恢复。</p>}
                  <OfflineComposer
                    draft={draft}
                    onDraftChange={setDraft}
                    generating={generating}
                    desktop={desktop}
                    composerRef={composer}
                    onSend={sendMessage}
                    onStop={() => setStreaming(null)}
                  />
                  <p className="mt-2 text-center text-[11px] text-muted-foreground/80">
                    内容由本地模型生成，请核对后使用<span className="hidden lg:inline"> · Enter 发送，Shift + Enter 换行</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Root>
      )}
    </main>
  )
}
