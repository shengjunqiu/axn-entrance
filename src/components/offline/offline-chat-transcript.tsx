import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Check, Copy, FileText, RotateCcw, ThumbsDown, ThumbsUp, Volume2 } from 'lucide-react'
import { Popover } from 'radix-ui'
import { OfflineAvatar } from '@/components/offline/offline-brand'
import { OfflineAttachmentChip } from '@/components/offline/offline-composer'
import { Button } from '@/components/ui/button'
import { getOfflineReplySourceIds } from '@/lib/offline-chat-demo'
import type { ChatTurn } from '@/lib/offline-chat-history'
import { offlineChatSources } from '@/lib/offline-chat-sources'

type ReplyBlock = { type: 'heading' | 'paragraph'; text: string } | { type: 'list'; items: string[] }

const listItemPattern = /^\d+[.、]\s*/
const thinkingDelay = 700
const typingInterval = 28

/** Turns the plain-text reply into headings, paragraphs and ordered lists. */
function parseReply(reply: string): ReplyBlock[] {
  const sections = reply.split('\n\n').filter((section) => section.trim())
  const blocks: ReplyBlock[] = []

  sections.forEach((section, sectionIndex) => {
    const lines = section.split('\n').filter((line) => line.trim())
    const isTitle = sectionIndex === 0 && sections.length > 1 && lines.length === 1
      && lines[0].length <= 20 && !listItemPattern.test(lines[0]) && !/[。：:，,！？!?.]$/.test(lines[0])
    if (isTitle) {
      blocks.push({ type: 'heading', text: lines[0] })
      return
    }

    let paragraph: string[] = []
    let list: string[] = []
    const flush = () => {
      if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
      if (list.length) blocks.push({ type: 'list', items: list })
      paragraph = []
      list = []
    }
    for (const line of lines) {
      if (listItemPattern.test(line)) {
        if (paragraph.length) {
          blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
          paragraph = []
        }
        list.push(line.replace(listItemPattern, ''))
      } else {
        if (list.length) flush()
        paragraph.push(line)
      }
    }
    flush()
  })
  return blocks
}

/** Cuts the parsed blocks down to the first `budget` characters, so streaming never reflows the structure. */
function truncateBlocks(blocks: ReplyBlock[], budget: number) {
  const visible: ReplyBlock[] = []
  let remaining = budget
  for (const block of blocks) {
    if (remaining <= 0) break
    if (block.type === 'list') {
      const items: string[] = []
      for (const item of block.items) {
        if (remaining <= 0) break
        items.push(item.slice(0, remaining))
        remaining -= item.length
      }
      visible.push({ type: 'list', items })
    } else {
      visible.push({ ...block, text: block.text.slice(0, remaining) })
      remaining -= block.text.length
    }
  }
  return visible
}

function ReplyContent({ blocks }: { blocks: ReplyBlock[] }) {
  return (
    <div className="space-y-3 text-[15px] leading-[1.8] wrap-anywhere">
      {blocks.map((block, index) => {
        if (block.type === 'heading') return <h3 key={index} className="text-base leading-snug font-semibold">{block.text}</h3>
        if (block.type === 'list') {
          return (
            <ol key={index} className="tabular list-decimal space-y-1.5 pl-5 marker:font-medium marker:text-muted-foreground">
              {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1">{item}</li>)}
            </ol>
          )
        }
        return <p key={index} className="whitespace-pre-wrap">{block.text}</p>
      })}
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div role="status" className="flex h-7 items-center gap-2.5 text-sm text-muted-foreground">
      <span className="flex gap-1" aria-hidden="true">
        <span className="offline-thinking-dot size-1.5 rounded-full bg-primary" />
        <span className="offline-thinking-dot size-1.5 rounded-full bg-primary" />
        <span className="offline-thinking-dot size-1.5 rounded-full bg-primary" />
      </span>
      正在检索本地知识库…
    </div>
  )
}

function StreamingReply({ blocks, onDone }: { blocks: ReplyBlock[]; onDone: () => void }) {
  const total = blocks.reduce((sum, block) => sum + (block.type === 'list' ? block.items.join('').length : block.text.length), 0)
  const [count, setCount] = useState(-1)
  const done = useRef(onDone)

  useLayoutEffect(() => {
    done.current = onDone
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      done.current()
      return
    }
    let shown = -1
    let timer = window.setTimeout(function tick() {
      shown = shown < 0 ? 0 : shown + 2 + Math.round(Math.random() * 2)
      if (shown >= total) {
        setCount(total)
        done.current()
        return
      }
      setCount(shown)
      timer = window.setTimeout(tick, typingInterval)
    }, thinkingDelay)
    return () => window.clearTimeout(timer)
  }, [total])

  if (count < 0) return <ThinkingIndicator />
  return <ReplyContent blocks={truncateBlocks(blocks, count)} />
}

function SourceChips({ turn }: { turn: ChatTurn }) {
  const ids = getOfflineReplySourceIds(turn)
  return (
    <section aria-label="参考资料" className="mt-4">
      <p className="mb-2 text-xs text-muted-foreground" aria-hidden="true">参考资料</p>
      <ul className="flex flex-wrap gap-1.5">
      {ids.map((id, index) => {
        const { title, section } = offlineChatSources[id]
        return (
          <li key={id} className="min-w-0 max-w-full">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-7 max-w-full cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background pr-2.5 pl-1 text-xs text-foreground/80 transition-colors hover:border-primary/25 hover:bg-(--offline-accent-surface) hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring data-[state=open]:border-primary/25 data-[state=open]:bg-(--offline-accent-surface)"
              >
                <span className="tabular grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">{index + 1}</span>
                <span className="truncate">{title}</span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="top"
                align="start"
                sideOffset={6}
                className="offline-assistant z-50 w-72 rounded-xl border border-border bg-background p-3 text-foreground shadow-(--offline-shadow-lg) outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
              >
                <div className="flex items-start gap-2.5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-(--offline-accent-surface) text-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug font-medium">{title}</p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">章节：{section}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80">来自本地知识库</p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          </li>
        )
      })}
      </ul>
    </section>
  )
}

const actionClass = 'size-8 rounded-lg text-muted-foreground hover:text-foreground'

/** Simulated read-aloud: shows a playback state for roughly as long as the reply would take to speak. */
function useSpeech(text: string) {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!speaking) return
    const timer = window.setTimeout(() => setSpeaking(false), Math.min(Math.max(text.length * 180, 2500), 12000))
    return () => window.clearTimeout(timer)
  }, [speaking, text])

  return { speaking, toggle: () => setSpeaking((current) => !current) }
}

function ReplyActions({ reply, canRegenerate, onRegenerate }: { reply: string; canRegenerate: boolean; onRegenerate: () => void }) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const speech = useSpeech(reply)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <div className="mt-3 -ml-1.5 flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={copied ? '已复制' : '复制回复'}
        title={copied ? '已复制' : '复制'}
        className={actionClass}
        onClick={() => navigator.clipboard?.writeText(reply).then(() => setCopied(true), () => {})}
      >
        {copied ? <Check className="size-4 text-emerald-600" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={speech.speaking ? '停止播放' : '语音播放'}
        aria-pressed={speech.speaking}
        title={speech.speaking ? '停止播放' : '语音播放'}
        className={`${actionClass} aria-pressed:bg-(--offline-accent-surface) aria-pressed:text-primary`}
        onClick={speech.toggle}
      >
        {speech.speaking ? (
          <span className="flex h-4 items-center gap-[2px]" aria-hidden="true">
            {[0, 1, 2, 3].map((bar) => (
              <span key={bar} className="offline-speak-bar w-[2px] rounded-full bg-current" style={{ animationDelay: `${bar * 0.14}s` }} />
            ))}
          </span>
        ) : (
          <Volume2 className="size-4" aria-hidden="true" />
        )}
      </Button>
      {canRegenerate && (
        <Button type="button" variant="ghost" size="icon-sm" aria-label="重新生成" title="重新生成" className={actionClass} onClick={onRegenerate}>
          <RotateCcw className="size-4" aria-hidden="true" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="有帮助"
        aria-pressed={feedback === 'up'}
        title="有帮助"
        className={`${actionClass} aria-pressed:text-primary`}
        onClick={() => setFeedback((current) => current === 'up' ? null : 'up')}
      >
        <ThumbsUp className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="没有帮助"
        aria-pressed={feedback === 'down'}
        title="没有帮助"
        className={`${actionClass} aria-pressed:text-primary`}
        onClick={() => setFeedback((current) => current === 'down' ? null : 'down')}
      >
        <ThumbsDown className="size-4" aria-hidden="true" />
      </Button>
      <span role="status" className="sr-only">{copied ? '已复制到剪贴板' : ''}</span>
    </div>
  )
}

type OfflineChatTranscriptProps = {
  turns: ChatTurn[]
  streamingIndex: number | null
  onStreamDone: () => void
  onRegenerate: () => void
}

export function OfflineChatTranscript({ turns, streamingIndex, onStreamDone, onRegenerate }: OfflineChatTranscriptProps) {
  const scrollArea = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLOListElement>(null)
  const stickToBottom = useRef(true)

  // New turns always bring the latest reply into view.
  useLayoutEffect(() => {
    const element = scrollArea.current
    if (!element) return
    stickToBottom.current = true
    element.scrollTop = element.scrollHeight
  }, [turns.length, streamingIndex])

  // While a reply streams in, follow it unless the reader has scrolled up.
  useEffect(() => {
    const element = scrollArea.current
    const list = content.current
    if (!element || !list) return
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) element.scrollTop = element.scrollHeight
    })
    observer.observe(list)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={scrollArea}
      role="log"
      aria-label="对话消息"
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
      onScroll={(event) => {
        const element = event.currentTarget
        stickToBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80
      }}
    >
      <ol ref={content} className="mx-auto w-full max-w-(--offline-chat-width) space-y-10 px-4 py-6 sm:px-6 sm:py-10">
        {turns.map((turn, index) => {
          const streaming = index === streamingIndex
          const blocks = parseReply(turn.reply)
          return (
            <li key={index} className="flex flex-col gap-6 duration-300 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
              {turn.attachments?.length ? (
                <ul aria-label="你发送的附件" className="-mb-4 flex max-w-[85%] flex-wrap justify-end gap-2 self-end sm:max-w-[75%]">
                  {turn.attachments.map((attachment, attachmentIndex) => (
                    <li key={attachmentIndex} className="min-w-0"><OfflineAttachmentChip attachment={attachment} /></li>
                  ))}
                </ul>
              ) : null}
              <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-(--offline-accent-surface) px-4 py-2.5 text-[15px] leading-relaxed wrap-anywhere whitespace-pre-wrap sm:max-w-[75%]">
                <span className="sr-only">你：</span>{turn.question}
              </p>

              <article aria-label="安小能的回复" aria-busy={streaming || undefined} className="flex items-start gap-3">
                <OfflineAvatar size="sm" className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  {streaming ? (
                    <StreamingReply key={`${index}-${turn.reply.length}`} blocks={blocks} onDone={onStreamDone} />
                  ) : (
                    <>
                      <ReplyContent blocks={blocks} />
                      <SourceChips turn={turn} />
                      <ReplyActions reply={turn.reply} canRegenerate={index === turns.length - 1} onRegenerate={onRegenerate} />
                    </>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
