import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { ArrowUp, Camera, FileText, Image, Mic, Paperclip, Plus, Square, X } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { offlineMenuContentClass, offlineMenuItemClass } from '@/components/offline/offline-chat-sidebar'
import { Button } from '@/components/ui/button'
import { defaultAttachmentQuestion, offlineAttachmentPresets, offlineVoicePresets } from '@/lib/offline-chat-demo'
import type { ChatAttachment } from '@/lib/offline-chat-history'

const listeningDuration = 1800

const attachmentMenu = [
  { icon: Paperclip, label: '发送文件', preset: offlineAttachmentPresets.file },
  { icon: Image, label: '发送照片', preset: offlineAttachmentPresets.photo },
  { icon: Camera, label: '相机', preset: offlineAttachmentPresets.camera },
]

export function OfflineAttachmentChip({ attachment, onRemove }: { attachment: ChatAttachment; onRemove?: () => void }) {
  const image = attachment.kind === 'image'
  return (
    <div className="flex max-w-full min-w-0 items-center gap-2.5 rounded-xl border border-border bg-background py-1.5 pr-2 pl-1.5 shadow-(--offline-shadow-sm)">
      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${image ? 'bg-emerald-50 text-emerald-600' : 'bg-(--offline-accent-surface) text-primary'}`}>
        {image ? <Image className="size-[18px]" aria-hidden="true" /> : <FileText className="size-[18px]" aria-hidden="true" />}
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[13px] leading-tight font-medium">{attachment.name}</span>
        <span className="tabular mt-0.5 block text-[11px] text-muted-foreground">{image ? '图片' : '文档'} · {attachment.size}</span>
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={`移除附件：${attachment.name}`}
          className="ml-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onRemove}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

type OfflineComposerProps = {
  draft: string
  onDraftChange: (draft: string) => void
  generating: boolean
  desktop: boolean
  composerRef: RefObject<HTMLTextAreaElement | null>
  onSend: (question: string, attachments: ChatAttachment[]) => void
  onStop: () => void
}

export function OfflineComposer({ draft, onDraftChange, generating, desktop, composerRef, onSend, onStop }: OfflineComposerProps) {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [listening, setListening] = useState(false)
  const voiceIndex = useRef(0)
  const canSend = !generating && !listening && (draft.trim() !== '' || attachments.length > 0)

  useEffect(() => {
    if (!listening) return
    const timer = window.setTimeout(() => {
      onDraftChange(offlineVoicePresets[voiceIndex.current % offlineVoicePresets.length])
      voiceIndex.current += 1
      setListening(false)
      composerRef.current?.focus({ preventScroll: true })
    }, listeningDuration)
    return () => window.clearTimeout(timer)
  }, [listening, onDraftChange, composerRef])

  function send() {
    if (!canSend) return
    onSend(draft.trim() || defaultAttachmentQuestion(attachments), attachments)
    setAttachments([])
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault()
      send()
    }
  }

  return (
    <form
      data-listening={listening || undefined}
      className="flex flex-col rounded-2xl border border-border bg-background p-2 shadow-(--offline-shadow-md) transition-[border-color,box-shadow] focus-within:border-primary/40 focus-within:shadow-[var(--offline-shadow-md),0_0_0_4px_color-mix(in_oklch,var(--primary)_8%,transparent)] data-listening:border-primary/40 data-listening:shadow-[var(--offline-shadow-md),0_0_0_4px_color-mix(in_oklch,var(--primary)_8%,transparent)]"
      onSubmit={(event) => {
        event.preventDefault()
        if (generating) onStop()
        else send()
      }}
    >
      {attachments.length > 0 && (
        <ul aria-label="已添加的附件" className="flex flex-wrap gap-2 px-1 pt-1 pb-1.5">
          {attachments.map((attachment, index) => (
            <li key={`${attachment.name}-${index}`} className="min-w-0 duration-200 animate-in fade-in zoom-in-95 motion-reduce:animate-none">
              <OfflineAttachmentChip attachment={attachment} onRemove={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))} />
            </li>
          ))}
        </ul>
      )}

      {listening ? (
        <div role="status" className="flex min-h-10 items-center gap-3 px-2 py-2 text-base text-primary lg:text-[15px]">
          <span className="flex h-5 items-center gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((bar) => (
              <span key={bar} className="offline-voice-bar w-[3px] rounded-full bg-primary" style={{ animationDelay: `${bar * 0.12}s` }} />
            ))}
          </span>
          正在聆听…
        </div>
      ) : (
        <textarea
          ref={composerRef}
          aria-label="对话消息输入"
          placeholder={attachments.length ? '补充说明（可选）' : desktop ? '问问安小能，比如：值班交接需要记录哪些内容？' : '给安小能发消息'}
          rows={1}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="max-h-40 min-h-10 w-full field-sizing-content resize-none px-2 py-2 text-base leading-6 outline-none placeholder:text-muted-foreground/75 lg:text-[15px]"
        />
      )}

      <div className="mt-1 flex items-center justify-between gap-2">
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <Button type="button" variant="ghost" size="icon-lg" aria-label="添加附件" title="添加附件" disabled={listening} className="size-9 rounded-lg text-muted-foreground hover:text-foreground data-[state=open]:text-foreground">
              <Plus className="size-5 transition-transform duration-200 in-data-[state=open]:rotate-45" aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content side="top" align="start" sideOffset={8} className={`offline-assistant ${offlineMenuContentClass} min-w-40`}>
              {attachmentMenu.map(({ icon: Icon, label, preset }) => (
                <DropdownMenu.Item
                  key={label}
                  className={offlineMenuItemClass}
                  onSelect={() => {
                    setAttachments((current) => current.some(({ name }) => name === preset.name) ? current : [...current, preset])
                    window.setTimeout(() => composerRef.current?.focus({ preventScroll: true }), 0)
                  }}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={listening ? '停止语音输入' : '语音输入'}
            aria-pressed={listening}
            title={listening ? '停止语音输入' : '语音输入'}
            disabled={generating}
            className="size-9 rounded-lg text-muted-foreground hover:text-foreground aria-pressed:bg-(--offline-accent-surface) aria-pressed:text-primary"
            onClick={() => setListening((current) => !current)}
          >
            <Mic className="size-[18px]" aria-hidden="true" />
          </Button>
          {generating ? (
            <Button type="submit" size="icon-lg" aria-label="停止生成" title="停止生成" className="rounded-full">
              <Square className="size-3.5 fill-current" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-lg"
              aria-label="发送消息"
              title="发送"
              disabled={!canSend}
              className="size-9 rounded-full transition-colors disabled:bg-muted disabled:text-muted-foreground/60 disabled:opacity-100"
            >
              <ArrowUp className="size-5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
