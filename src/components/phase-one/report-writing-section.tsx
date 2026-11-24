import { useEffect, useRef, useState } from 'react'
import { FilePenLine, Layers, LoaderCircle, Save, ShieldCheck, Sparkles, Undo2, Upload, X } from 'lucide-react'
import { ReportDocumentPreview } from './report-document-preview'
import { ReferenceAttachments } from './reference-attachments'
import { demonstrateWriting, sampleMaterial } from '@/lib/report-writing'
import type { WritingResult } from '@/lib/report-writing'
import { useFloatingPanel } from '@/lib/use-floating-panel'

type Preview = { result: WritingResult; base: string }

export function ReportWritingSection({ title }: { title: string }) {
  const [body, setBody] = useState('')
  const [previousBody, setPreviousBody] = useState<{ before: string; after: string } | null>(null)
  const [draftOpen, setDraftOpen] = useState(false)
  const [material, setMaterial] = useState('')
  const [mode, setMode] = useState<'loading' | 'demo' | 'live' | 'unavailable'>('loading')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmReplace, setConfirmReplace] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const panelHeading = useRef<HTMLHeadingElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const request = useRef<AbortController | null>(null)
  const { panel: floatingPanel, dragging: panelDragging, style: panelStyle, headerProps } = useFloatingPanel(draftOpen)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/report-writing/status', { signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error('status unavailable')
        const data = await res.json()
        if (typeof data.configured !== 'boolean') throw new Error('invalid status')
        setMode(data.configured ? 'live' : 'demo')
      })
      .catch(() => { if (!controller.signal.aborted) setMode('unavailable') })
    return () => { controller.abort(); request.current?.abort() }
  }, [])

  useEffect(() => {
    if (!draftOpen) return
    panelHeading.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        request.current?.abort()
        setBusy(false)
        setDraftOpen(false)
        trigger.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [draftOpen])

  function invalidate() {
    request.current?.abort()
    setBusy(false)
    setPreview(null)
    setError('')
    setConfirmReplace(false)
  }

  function open(button: HTMLButtonElement) {
    invalidate()
    trigger.current = button
    setDraftOpen(true)
    setNotice('')
  }

  function close() {
    request.current?.abort()
    setBusy(false)
    setDraftOpen(false)
    trigger.current?.focus()
  }

  async function generate() {
    if (!draftOpen || busy || mode === 'loading' || mode === 'unavailable') return
    invalidate()
    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    const base = body
    try {
      const input = { action: 'draft' as const, source: material, title }
      let result: WritingResult
      if (mode === 'demo') {
        result = demonstrateWriting(input)
      } else {
        const response = await fetch('/api/report-writing', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: controller.signal,
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || '生成失败，请重试。')
        result = data
      }
      if (!controller.signal.aborted) setPreview({ result, base })
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '请求失败，请稍后重试。')
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  function apply(append = false) {
    if (!preview) return
    if (body !== preview.base) { setError('正文在生成后发生了变化，请重新生成，避免覆盖刚才的修改。'); return }
    if (!append && body.trim() && !confirmReplace) { setConfirmReplace(true); return }
    const text = preview.result.text
    const next = append ? `${body.trimEnd()}${body.trim() ? '\n\n' : ''}${text}` : text
    setPreviousBody({ before: body, after: next })
    setBody(next)
    setPreview(null)
    setConfirmReplace(false)
    setNotice('已采用写作结果，可继续编辑或撤销本次采用。')
    editor.current?.focus()
  }

  return (
    <section className="er-report-section" aria-label="报告内容">
      <div className="er-report-heading">
        <h3><span className="er-section-mark" />报告内容<span className="er-heading-decoration">◆ · ◆ ·</span></h3>
        <div className="er-report-actions">
          <div className="er-ai-buttons">
            <button type="button" className={`er-button er-ai-button ${draftOpen ? 'is-active' : ''}`} aria-expanded={draftOpen} aria-controls="report-writing-panel" onClick={event => open(event.currentTarget)}><Sparkles />AI 起草</button>
            <button type="button" className="er-button er-ai-button"><ShieldCheck />AI 检查</button>
          </div>
          <button type="button" className="er-button"><Save />存为模板</button>
          <button type="button" className="er-button"><Layers />本单位模板</button>
          <button type="button" className="er-button"><Upload />上传文件</button>
        </div>
      </div>
      <div className="er-writing-hint">
        <span><FilePenLine />正文可直接编辑。</span>
        <button type="button" disabled={previousBody === null || previousBody.after !== body} title={previousBody && previousBody.after !== body ? '采用后已继续编辑，为保留手动修改，不能撤销该次采用。' : '恢复采用前的正文'} onClick={() => {
          if (previousBody === null || previousBody.after !== body) return
          setBody(previousBody.before); setPreviousBody(null); invalidate(); setNotice('已撤销本次采用。')
        }}><Undo2 />撤销本次采用</button>
      </div>
      <div role="status" className="er-writing-notice">{notice}</div>
      <ReportDocumentPreview wordCount={body.replace(/\s/g, '').length}>
        <textarea ref={editor} className="er-report-body-input" aria-label="报告正文" placeholder="在此输入报告正文，或点击「AI 起草」整理现场材料……" value={body} onChange={event => {
          setBody(event.target.value); setNotice('')
        }} />
      </ReportDocumentPreview>

      {draftOpen && <aside ref={floatingPanel} id="report-writing-panel" className={`er-ai-panel er-writing-floating ${panelDragging ? 'is-dragging' : ''}`} style={panelStyle} role="dialog" aria-modal="false" aria-labelledby="report-writing-title">
        <header className="er-ai-panel-header" {...headerProps}>
          <h3 id="report-writing-title" ref={panelHeading} tabIndex={-1}><Sparkles />AI 起草</h3>
          <button type="button" className="er-ai-close" aria-label="关闭写作助手" onClick={close}><X /></button>
        </header>
        <div className="er-ai-panel-content">
          <div className="er-ai-label-row"><label htmlFor="report-material">写作要求 <small className="er-ai-small">（选填）</small></label><button type="button" onClick={() => { invalidate(); setMaterial(sampleMaterial) }}>载入示例</button></div>
          <textarea id="report-material" className="er-ai-textarea" maxLength={12000} value={material} onChange={event => { invalidate(); setMaterial(event.target.value) }} placeholder="可填写写作目的、重点内容、结构或语气要求，也可留空。" />
          <div className="er-ai-counter">{material.length} / 12000</div>
          <ReferenceAttachments showDescription={false} />
          {mode === 'unavailable' && <div className="er-ai-error" role="alert">AI 服务暂不可用。<button type="button" className="er-ai-secondary" onClick={() => setMode('demo')}>使用演示模式</button></div>}
          <button type="button" className="er-ai-run" disabled={busy || mode === 'loading' || mode === 'unavailable'} onClick={generate}>
            {busy ? <LoaderCircle className="er-ai-spin" /> : <Sparkles />}
            {mode === 'loading' ? '正在连接…' : busy ? '正在处理…' : preview ? '重新生成' : '生成草稿'}
          </button>
          {error && <p className="er-ai-error" role="alert">{error}</p>}
          {preview && <div className="er-ai-result" aria-live="polite">
            <div className="er-ai-result-heading"><h4>结果预览</h4><span>{mode === 'demo' ? '本地演示' : 'AI 生成'}</span></div>
            {preview.result.text && <div className="er-ai-result-text">{preview.result.text}</div>}
            {preview.result.issues.map((issue, index) => <div className="er-ai-issue" key={index}><strong>{issue.title}</strong><p>{issue.detail}</p></div>)}
            {body !== preview.base && <p className="er-ai-error">正文已修改，请重新生成以使用最新内容。</p>}
            {confirmReplace && <div className="er-ai-replace-confirm" role="alert">将替换现有全文，采用后可撤销。确认采用此版本？</div>}
            <div className="er-ai-apply-actions">
              <button type="button" className="er-ai-run" disabled={body !== preview.base} onClick={() => apply()}>{!body.trim() ? '插入正文' : confirmReplace ? '确认替换全文' : '替换全文'}</button>
              {body.trim() && <button type="button" className="er-ai-secondary" disabled={body !== preview.base} onClick={() => apply(true)}>追加到文末</button>}
              {confirmReplace && <button type="button" className="er-ai-secondary" onClick={() => setConfirmReplace(false)}>取消替换</button>}
            </div>
          </div>}
        </div>
        <footer className="er-ai-panel-footer">内容仅作写作辅助，请核实后采用。不会自动提交审批。</footer>
      </aside>}
    </section>
  )
}
