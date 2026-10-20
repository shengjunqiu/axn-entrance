import { useEffect, useRef, useState } from 'react'
import { FilePenLine, Layers, LoaderCircle, Save, ShieldCheck, Sparkles, Undo2, Upload, WandSparkles, X } from 'lucide-react'
import { ReportDocumentPreview } from './report-document-preview'
import { ReferenceAttachments } from './reference-attachments'
import { demonstrateWriting, sampleMaterial } from '@/lib/report-writing'
import type { WritingAction, WritingResult } from '@/lib/report-writing'

const actionLabels: Record<WritingAction, string> = { draft: 'AI 起草', polish: 'AI 润色', check: 'AI 检查' }
type Selection = { start: number; end: number; text: string }
type Preview = { result: WritingResult; base: string; selection: Selection | null; action: WritingAction }

export function ReportWritingSection({ title }: { title: string }) {
  const [body, setBody] = useState('')
  const [previousBody, setPreviousBody] = useState<{ before: string; after: string } | null>(null)
  const [action, setAction] = useState<WritingAction | null>(null)
  const [material, setMaterial] = useState('')
  const [polishStyle, setPolishStyle] = useState<'规范表述' | '精简内容'>('规范表述')
  const [mode, setMode] = useState<'loading' | 'demo' | 'live' | 'unavailable'>('loading')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmReplace, setConfirmReplace] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const panelHeading = useRef<HTMLHeadingElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const request = useRef<AbortController | null>(null)
  const selectionRef = useRef<Selection | null>(null)

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
    if (!action) return
    panelHeading.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        request.current?.abort()
        setBusy(false)
        setAction(null)
        trigger.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [action])

  function invalidate() {
    request.current?.abort()
    setBusy(false)
    setPreview(null)
    setError('')
    setConfirmReplace(false)
  }

  function open(next: WritingAction, button: HTMLButtonElement) {
    invalidate()
    trigger.current = button
    const selected = selectionRef.current
    setSelection(next === 'polish' && selected && body.slice(selected.start, selected.end) === selected.text ? selected : null)
    setAction(next)
    setNotice('')
  }

  function close() {
    request.current?.abort()
    setBusy(false)
    setAction(null)
    trigger.current?.focus()
  }

  async function generate() {
    if (!action || busy) return
    const source = action === 'draft' ? material : action === 'polish' && selection ? selection.text : body
    if (action !== 'draft' && !source.trim()) { setError('请先在报告中输入正文，或使用 AI 起草。'); return }
    if (source.length > 12000) { setError('单次处理上限为 12000 字，请缩短材料或选中段落后润色。'); return }
    invalidate()
    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    const input = { action, source, title, ...(action === 'polish' ? { style: polishStyle } : {}) }
    const base = body
    const capturedSelection = selection
    try {
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
      if (!controller.signal.aborted) setPreview({ result, base, selection: capturedSelection, action })
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '请求失败，请稍后重试。')
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  function apply(append = false) {
    if (!preview || preview.action === 'check') return
    if (body !== preview.base) { setError('正文在生成后发生了变化，请重新生成，避免覆盖刚才的修改。'); return }
    if (!append && body.trim() && !preview.selection && !confirmReplace) { setConfirmReplace(true); return }
    const text = preview.result.text
    const next = append ? `${body.trimEnd()}${body.trim() ? '\n\n' : ''}${text}`
      : preview.selection ? body.slice(0, preview.selection.start) + text + body.slice(preview.selection.end) : text
    setPreviousBody({ before: body, after: next })
    setBody(next)
    setPreview(null)
    setConfirmReplace(false)
    setNotice('已采用写作结果，可继续编辑或撤销本次采用。')
    setSelection(null)
    selectionRef.current = null
    editor.current?.focus()
  }

  return (
    <section className="er-report-section" aria-label="报告内容">
      <div className="er-report-heading">
        <h3><span className="er-section-mark" />报告内容<span className="er-heading-decoration">◆ · ◆ ·</span></h3>
        <div className="er-report-actions">
          <div className="er-ai-buttons">
            {(['draft', 'polish', 'check'] as const).map((item, index) => {
              const Icon = [Sparkles, WandSparkles, ShieldCheck][index]
              return <button key={item} type="button" className={`er-button er-ai-button ${action === item ? 'is-active' : ''}`} aria-expanded={action === item} aria-controls="report-writing-panel" onClick={event => open(item, event.currentTarget)}><Icon />{actionLabels[item]}</button>
            })}
          </div>
          <button type="button" className="er-button"><Save />存为模板</button>
          <button type="button" className="er-button"><Layers />本单位模板</button>
          <button type="button" className="er-button"><Upload />上传文件</button>
        </div>
      </div>
      <div className="er-writing-hint">
        <span><FilePenLine />正文可直接编辑，选中文字后可单独润色。</span>
        <button type="button" disabled={previousBody === null || previousBody.after !== body} title={previousBody && previousBody.after !== body ? '采用后已继续编辑，为保留手动修改，不能撤销该次采用。' : '恢复采用前的正文'} onClick={() => {
          if (previousBody === null || previousBody.after !== body) return
          setBody(previousBody.before); setPreviousBody(null); selectionRef.current = null; setSelection(null); invalidate(); setNotice('已撤销本次采用。')
        }}><Undo2 />撤销本次采用</button>
      </div>
      <div role="status" className="er-writing-notice">{notice}</div>
      <ReportDocumentPreview wordCount={body.replace(/\s/g, '').length}>
        <textarea ref={editor} className="er-report-body-input" aria-label="报告正文" placeholder="在此输入报告正文，或点击「AI 起草」整理现场材料……" value={body} onChange={event => {
          setBody(event.target.value); selectionRef.current = null; setSelection(null); setNotice('')
        }} onSelect={event => {
          const { selectionStart: start, selectionEnd: end, value } = event.currentTarget
          selectionRef.current = end > start ? { start, end, text: value.slice(start, end) } : null
        }} />
      </ReportDocumentPreview>

      {action && <aside id="report-writing-panel" className="er-ai-panel" role="dialog" aria-modal="false" aria-labelledby="report-writing-title">
        <header className="er-ai-panel-header">
          <div><span className="er-ai-eyebrow"><Sparkles />写作助手</span><h3 id="report-writing-title" ref={panelHeading} tabIndex={-1}>{actionLabels[action]}</h3></div>
          <button type="button" className="er-ai-close" aria-label="关闭写作助手" onClick={close}><X /></button>
        </header>
        <div className="er-ai-panel-content">
          <div className={`er-ai-mode ${mode === 'live' ? 'is-live' : ''}`}>
            {mode === 'loading' ? '正在检查 AI 服务…' : mode === 'live' ? '已连接 AI 服务 · 结果经确认后写入正文' : mode === 'demo' ? '演示模式 · 使用本地模板和规则，未调用 AI 模型' : 'AI 接口未连接，可切换演示模式体验交互。'}
            {mode === 'unavailable' && <button type="button" onClick={() => setMode('demo')}>使用演示模式</button>}
          </div>
          {action === 'draft' ? <>
            <p className="er-ai-description">根据写作要求整理要情草稿。没有提供的事实将标记为待核实。</p>
            <div className="er-ai-label-row"><label htmlFor="report-material">写作要求 <small className="er-ai-small">（选填）</small></label><button type="button" onClick={() => { invalidate(); setMaterial(sampleMaterial) }}>载入示例</button></div>
            <textarea id="report-material" className="er-ai-textarea" maxLength={12000} value={material} onChange={event => { invalidate(); setMaterial(event.target.value) }} placeholder="可填写写作目的、重点内容、结构或语气要求，也可留空。" />
            <div className="er-ai-counter">{material.length} / 12000</div>
            <ReferenceAttachments />
          </> : action === 'polish' ? <>
            <p className="er-ai-description">优化语言和行文，保留事实、数字与不确定表述。</p>
            <div className="er-ai-scope">处理范围：{selection ? `选中文字（${selection.text.length} 字）` : `全文（${body.length} 字）`}</div>
            <div className="er-ai-source">{selection?.text || body || '正文为空，请先输入内容或使用 AI 起草。'}</div>
            <label className="er-ai-select-label">润色方式<select value={polishStyle} onChange={event => { invalidate(); setPolishStyle(event.target.value as typeof polishStyle) }}><option>规范表述</option><option>精简内容</option></select></label>
          </> : <>
            <p className="er-ai-description">检查要素缺项、占位内容，以及数字和时间的表述疑点。只提供建议，由你确认修改。</p>
            <div className="er-ai-scope">检查范围：全文（{body.length} 字）</div>
            <p className="er-ai-small">核查要素：时间、地点、力量投入、处置进展、下一步安排。</p>
          </>}
          <button type="button" className="er-ai-run" disabled={busy || mode === 'loading' || mode === 'unavailable'} onClick={generate}>
            {busy ? <LoaderCircle className="er-ai-spin" /> : <Sparkles />}
            {busy ? '正在处理…' : preview ? '重新生成' : action === 'draft' ? '生成草稿' : action === 'polish' ? '开始润色' : '开始检查'}
          </button>
          {error && <p className="er-ai-error" role="alert">{error}</p>}
          {preview && <div className="er-ai-result" aria-live="polite">
            <div className="er-ai-result-heading"><h4>{action === 'check' ? '检查建议' : '结果预览'}</h4><span>{mode === 'demo' ? '本地演示' : 'AI 生成'}</span></div>
            {preview.result.text && <div className="er-ai-result-text">{preview.result.text}</div>}
            {preview.result.issues.map((issue, index) => <div className="er-ai-issue" key={index}><strong>{issue.title}</strong><p>{issue.detail}</p></div>)}
            {action === 'check' && !preview.result.issues.length && <p className="er-ai-small">暂未发现明显文字问题，事实和数据仍需对照现场记录确认。</p>}
            {body !== preview.base && <p className="er-ai-error">正文已修改，请重新生成以使用最新内容。</p>}
            {action !== 'check' && <>
              {confirmReplace && <div className="er-ai-replace-confirm" role="alert">将替换现有全文，采用后可撤销。确认采用此版本？</div>}
              <div className="er-ai-apply-actions">
                <button type="button" className="er-ai-run" disabled={body !== preview.base} onClick={() => apply()}>{preview.selection ? '替换选中文字' : !body.trim() ? '插入正文' : confirmReplace ? '确认替换全文' : '替换全文'}</button>
                {body.trim() && !preview.selection && <button type="button" className="er-ai-secondary" disabled={body !== preview.base} onClick={() => apply(true)}>追加到文末</button>}
                {confirmReplace && <button type="button" className="er-ai-secondary" onClick={() => setConfirmReplace(false)}>取消替换</button>}
              </div>
            </>}
          </div>}
        </div>
        <footer className="er-ai-panel-footer">内容仅作写作辅助，请核实后采用。不会自动提交审批。</footer>
      </aside>}
    </section>
  )
}
