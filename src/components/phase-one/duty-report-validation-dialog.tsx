import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Circle, LoaderCircle, ShieldCheck, TriangleAlert, X } from 'lucide-react'
import { dutyRows, dutyTotal } from '@/lib/duty-report-data'
import { runDutyReportChecks } from '@/lib/duty-report-demo'
import { createDutyValidationDemo } from '@/lib/duty-report-validation'

export function DutyReportValidationDialog({ rescue, publicOpinion, onClose }: { rescue: string; publicOpinion: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [checked, setChecked] = useState(0)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    const controller = new AbortController()
    runDutyReportChecks({ signal: controller.signal, onCheck: setChecked })
      .then(() => { if (!controller.signal.aborted) setFinished(true) })
      .catch(() => { if (!controller.signal.aborted) setError('校验中断，请关闭后重试。') })
    return () => { controller.abort(); element.close() }
  }, [])

  const issues = createDutyValidationDemo(dutyRows, dutyTotal)
  const personnelIssues = issues.filter(issue => issue.category === 'personnel')
  const totalIssues = issues.filter(issue => issue.category === 'total')
  const checks = [
    { label: '人员数据校验', valid: !personnelIssues.length, detail: `发现 ${personnelIssues.length} 家单位总人数与分项合计不一致` },
    { label: '分类合计核对', valid: !totalIssues.length, detail: `发现 ${totalIssues.length} 项分类合计差异` },
    { label: '选填信息检查', valid: true, detail: `应急救援情况：${rescue.trim() ? '已填写' : '无'}；舆情上访情况：${publicOpinion.trim() ? '已填写' : '无'}` },
  ]

  return (
    <dialog ref={dialog} id="duty-report-validation-dialog" className="dr-validation-dialog" aria-labelledby="duty-validation-title" onCancel={event => { event.preventDefault(); onClose() }}>
      <header><h3 id="duty-validation-title"><ShieldCheck />AI 数据校验</h3><button type="button" className="er-ai-close" aria-label="关闭数据校验" onClick={onClose}><X /></button></header>
      <div className="dr-ai-process">
        <div className="er-ai-result-heading"><h4>{finished ? '校验完成 · 发现异常' : '正在校验数据'}</h4><span>模拟演示</span></div>
        <ol aria-live="polite">
          {checks.map((item, index) => <li key={item.label} className={checked > index ? 'is-complete' : checked === index ? 'is-current' : ''}>
            {checked > index ? item.valid ? <CheckCircle2 /> : <TriangleAlert className="dr-validation-warning" /> : checked === index ? <LoaderCircle className="er-ai-spin" /> : <Circle />}
            <div><strong>{item.label}</strong><p>{checked > index ? item.detail : checked === index ? '正在核对…' : '等待校验'}</p></div>
          </li>)}
        </ol>
      </div>
      {error && <p className="er-ai-error" role="alert">{error}</p>}
      {finished && <section className="dr-validation-issues" aria-label="异常数据明细">
        <div className="dr-validation-summary" role="status"><TriangleAlert /><strong>发现 {issues.length} 处数据异常</strong></div>
        <p className="dr-validation-demo-note">以下为模拟异常样例，页面原始数据保持不变。</p>
        <div className="dr-validation-table-wrap"><table>
          <thead><tr><th>单位 / 位置</th><th>异常字段</th><th>当前值</th><th>校验值</th></tr></thead>
          <tbody>{issues.map(issue => <tr key={`${issue.unit}-${issue.field}`}>
            <td>{issue.unit}</td><td>{issue.field}<small>{issue.detail}</small></td><td className="dr-validation-current">{issue.current} 人</td><td>{issue.expected} 人</td>
          </tr>)}</tbody>
        </table></div>
      </section>}
      <footer><button type="button" className="er-ai-secondary" onClick={onClose}>{finished ? '完成' : '取消校验'}</button></footer>
    </dialog>
  )
}
