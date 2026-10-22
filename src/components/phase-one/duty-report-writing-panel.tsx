import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Circle, LoaderCircle, Sparkles, X } from 'lucide-react'
import { ReferenceAttachments } from './reference-attachments'
import { dutyRows, dutyTotal } from '@/lib/duty-report-data'
import { runDutyReportDemo } from '@/lib/duty-report-demo'

export function DutyReportWritingPanel({ rescue, publicOpinion, onRescueChange, onPublicOpinionChange, onClose, onStart, onWrite, onFinish, onCancel }: {
  rescue: string
  publicOpinion: string
  onRescueChange: (value: string) => void
  onPublicOpinionChange: (value: string) => void
  onClose: () => void
  onStart: () => void
  onWrite: (text: string, progress: number) => void
  onFinish: () => void
  onCancel: () => void
}) {
  const [phase, setPhase] = useState<'idle' | 'checking' | 'writing' | 'done'>('idle')
  const [checked, setChecked] = useState(0)
  const [progress, setProgress] = useState(0)
  const request = useRef<AbortController | null>(null)
  const checkCancel = useRef<HTMLButtonElement>(null)
  const generateButton = useRef<HTMLButtonElement>(null)
  const [notice, setNotice] = useState('')
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const panel = useRef<HTMLElement>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => { heading.current?.focus() }, [])
  useEffect(() => () => {
    if (request.current) { request.current.abort(); onCancel() }
  }, [onCancel])
  useEffect(() => {
    if (phase === 'checking') checkCancel.current?.focus()
    if (phase === 'writing') heading.current?.focus()
  }, [phase])
  const busy = phase === 'checking' || phase === 'writing'

  function clampPosition(left: number, top: number) {
    const bounds = panel.current?.getBoundingClientRect()
    return {
      left: Math.max(8, Math.min(left, window.innerWidth - (bounds?.width ?? 420) - 8)),
      top: Math.max(8, Math.min(top, window.innerHeight - (bounds?.height ?? 0) - 8)),
    }
  }

  useEffect(() => {
    function keepInView() {
      const bounds = panel.current?.getBoundingClientRect()
      if (bounds) {
        const next = clampPosition(bounds.left, bounds.top)
        setPosition(previous => previous?.left === next.left && previous.top === next.top ? previous : next)
      }
    }
    keepInView()
    window.addEventListener('resize', keepInView)
    const observer = new ResizeObserver(keepInView)
    if (panel.current) observer.observe(panel.current)
    return () => { window.removeEventListener('resize', keepInView); observer.disconnect() }
  }, [])

  function invalidate() {
    setPhase('idle')
    setNotice('')
  }

  function cancelCheck() {
    request.current?.abort()
    request.current = null
    setPhase('idle')
    setChecked(0)
    setNotice('已取消校验。')
    onCancel()
    requestAnimationFrame(() => generateButton.current?.focus())
  }

  async function generate() {
    if (request.current) return
    const [total, office, construction, standby, leave, awaiting] = dutyTotal
    const units = dutyRows.map(row => {
      const [count, inOffice, onSite, onCall, absent, waiting] = row.values
      return `${row.unit}：员工${count}人，公司本部上班${inOffice}人、一线施工${onSite}人、应急备勤${onCall}人，休假、出差等${absent}人，转隶前长期待岗${waiting}人。`
    }).join('\n')
    const text = `一、人员在岗情况\n全集团员工共${total}人，其中在岗工作${office + construction + standby}人（公司本部${office}人、一线施工${construction}人、应急备勤${standby}人），休假、出差等${leave}人，转隶前长期待岗职工${awaiting}人。\n${units}\n\n二、应急救援情况\n${rescue.trim() || '无'}\n\n三、舆情上访情况\n${publicOpinion.trim() || '无'}`
    setNotice('')
    setChecked(0)
    setProgress(0)
    setPhase('checking')
    const controller = new AbortController()
    request.current = controller
    const bounds = panel.current?.getBoundingClientRect()
    if (bounds && bounds.right > window.innerWidth * .65) setPosition(clampPosition(260, bounds.top))
    onStart()
    try {
      await runDutyReportDemo({ text, signal: controller.signal, onCheck: setChecked, onWrite: (partial, percent) => {
        setPhase('writing')
        setProgress(percent)
        onWrite(partial, percent)
      } })
      request.current = null
      setPhase('done')
      onFinish()
    } catch {
      if (!controller.signal.aborted) {
        request.current = null
        setPhase('idle')
        setNotice('生成中断，请重试。')
        onCancel()
      }
    }
  }

  const rowTotalsMatch = dutyRows.every(row => row.values[0] === row.values.slice(1).reduce((sum, value) => sum + value, 0))
  const categoryTotalsMatch = dutyTotal.every((value, index) => value === dutyRows.reduce((sum, row) => sum + row.values[index], 0))
  const checks = [
    { label: '人员数据校验', detail: rowTotalsMatch ? `${dutyRows.length} 家单位人员分项与总人数一致` : '存在单位人数不一致，请核实' },
    { label: '分类合计核对', detail: categoryTotalsMatch ? `各分类与合计行一致，共 ${dutyTotal[0]} 人` : '分类合计存在差异，请核实' },
    { label: '选填信息检查', detail: rescue.trim() && publicOpinion.trim() ? '两项情况已填写，将纳入对应章节' : '未填写的选填项将在文稿中写为“无”' },
  ]

  return (
    <aside ref={panel} id="duty-report-writing-panel" className={`er-ai-panel dr-ai-panel ${dragging ? 'is-dragging' : ''}`} style={position ? { left: position.left, top: position.top, right: 'auto' } : undefined} role="dialog" aria-modal="false" aria-labelledby="duty-report-writing-title" onKeyDown={event => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.stopPropagation(); onClose() }
    }}>
      <header className="er-ai-panel-header" inert={phase === 'checking'} onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button')) return
        const bounds = panel.current!.getBoundingClientRect()
        drag.current = { x: event.clientX, y: event.clientY, left: bounds.left, top: bounds.top }
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
        event.preventDefault()
      }} onPointerMove={event => {
        if (!drag.current) return
        setPosition(clampPosition(drag.current.left + event.clientX - drag.current.x, drag.current.top + event.clientY - drag.current.y))
      }} onPointerUp={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
        drag.current = null
        setDragging(false)
      }} onPointerCancel={() => { drag.current = null; setDragging(false) }} onLostPointerCapture={() => { drag.current = null; setDragging(false) }}>
        <div className="dr-ai-panel-title"><Sparkles /><h3 id="duty-report-writing-title" ref={heading} tabIndex={-1}>AI 编写日报</h3></div>
        <button type="button" className="er-ai-close" aria-label="关闭日报写作助手" onClick={onClose}><X /></button>
      </header>
      <div className="er-ai-panel-content" inert={phase === 'checking'}>
        <fieldset className="dr-ai-inputs" disabled={busy}>
        <div className="dr-ai-field">
          <div className="er-ai-label-row"><label htmlFor="duty-report-rescue">应急救援情况 <small className="er-ai-small">（选填）</small></label></div>
          <textarea id="duty-report-rescue" className="er-ai-textarea" maxLength={12000} value={rescue} onChange={event => { onRescueChange(event.target.value); invalidate() }} placeholder="填写救援任务、力量投入及处置进展等" />
        </div>
        <div className="dr-ai-field">
          <div className="er-ai-label-row"><label htmlFor="duty-report-public-opinion">舆情上访情况 <small className="er-ai-small">（选填）</small></label></div>
          <textarea id="duty-report-public-opinion" className="er-ai-textarea" maxLength={12000} value={publicOpinion} onChange={event => { onPublicOpinionChange(event.target.value); invalidate() }} placeholder="填写舆情动态、上访事项及处理情况等" />
        </div>
        <ReferenceAttachments documentsOnly showDescription={false} maxFiles={null} />
        </fieldset>
        <button ref={generateButton} type="button" className="er-ai-run" disabled={busy} onClick={generate}>{busy ? <LoaderCircle className="er-ai-spin" /> : <Sparkles />}{phase === 'checking' ? '正在校验数据…' : phase === 'writing' ? `正在生成文稿 ${progress}%` : phase === 'done' ? '重新生成文稿' : '生成文稿'}</button>
        {notice && <p className="er-writing-notice" role="status">{notice}</p>}
      </div>
      <footer className="er-ai-panel-footer" inert={phase === 'checking'}>内容仅作写作辅助，请核实后采用。不会自动提交审批。</footer>
      {phase === 'checking' && <div className="dr-ai-check-overlay">
        <div className="dr-ai-process dr-ai-check-dialog" role="dialog" aria-modal="false" aria-labelledby="duty-check-title" onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelCheck() }
          if (event.key === 'Tab') { event.preventDefault(); checkCancel.current?.focus() }
        }}>
          <div className="er-ai-result-heading"><h4 id="duty-check-title">{checked === checks.length ? '数据校验完成' : '正在校验数据'}</h4><span>模拟演示</span></div>
          <p className="dr-ai-check-description">校验完成后，将自动在编辑器中生成文稿。</p>
          <div aria-live="polite" role="status">
          <ol>
            {checks.map((item, index) => <li key={item.label} className={checked > index ? 'is-complete' : checked === index && phase === 'checking' ? 'is-current' : ''}>
              {checked > index ? <CheckCircle2 /> : checked === index && phase === 'checking' ? <LoaderCircle className="er-ai-spin" /> : <Circle />}
              <div><strong>{item.label}</strong><p>{checked > index ? item.detail : checked === index ? '正在核对…' : '等待校验'}</p></div>
            </li>)}
          </ol>
          </div>
          <button ref={checkCancel} type="button" className="er-ai-secondary dr-ai-check-cancel" onClick={cancelCheck}>取消校验</button>
        </div>
      </div>}
    </aside>
  )
}
