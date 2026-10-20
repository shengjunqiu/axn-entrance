import { FileText, ListStart, Search, SquarePen, Upload } from 'lucide-react'
import { ReportDocumentPreview } from './report-document-preview'

const records = [
  { title: '周边分析', time: '2026-10-09 09:15:08', text: '已生成周边分析报告', file: '重庆市县城口县堰塞湖险情事件周边资源分析报告.docx', unit: '中国安能', user: '管理员' },
  { title: '抽组方案', time: '2026-10-05 19:11:56', text: '生成抽组方案', unit: '中国安能', user: '李霖枫' },
  { title: '现场情况反馈', time: '2026-10-05 16:09:54', text: '现场情况', unit: '中国安能', user: '管理员' },
  { title: '处置方案', time: '2026-10-04 10:57:10', text: '生成处置方案', file: '36fd93f030514031a9c7ba28a8f28b80.docx', unit: '重庆队', user: '任博涵' },
  { title: '现场情况反馈', time: '2026-10-03 20:17:55', text: '灾情位置图', unit: '中国安能', user: '管理员' },
  { title: '力量调度建议', time: '2026-10-03 11:31:26', text: '已生成调度建议方案', unit: '中国安能', user: '管理员' },
]

export function SummaryReportContent() {
  return (
    <div className="sr-content">
      <section className="sr-report-column" aria-label="总结报告">
        <div className="sr-name-row">
          <span className="sr-label"><i>*</i>报告名称</span>
          <div className="er-input er-placeholder sr-name">请输入标题</div>
          <div className="sr-actions">{['保存', '提交', '导出'].map(label => <button type="button" key={label} className="sr-outline-button">{label}</button>)}</div>
        </div>
        <div className="sr-attachment-row"><span className="sr-label"><i>*</i>附件上传</span><button type="button" className="sr-outline-button"><Upload />上传文件</button></div>
        <ReportDocumentPreview summary />
      </section>
      <aside className="sr-records" aria-label="全过程记录">
        <div className="sr-record-tabs"><span className="sr-record-tab-active">全过程记录</span><span>历史报告</span><span className="sr-record-decoration"><FileText /></span></div>
        <div className="sr-record-heading"><SquarePen /><span>全过程记录</span><ListStart /></div>
        <div className="sr-record-search"><div className="er-input er-placeholder">请输入关键字</div><span><Search /></span></div>
        <div className="sr-timeline">
          {records.map(record => (
            <article className="sr-record" key={record.time}>
              <div className="sr-record-title"><span>{record.title}</span><time>{record.time}</time></div>
              <div className="sr-record-body"><p>{record.text}</p>{record.file && <div className="sr-record-file"><span>W</span>{record.file}</div>}</div>
              <div className="sr-record-author"><span>{record.unit}</span><span>{record.user}</span></div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  )
}
