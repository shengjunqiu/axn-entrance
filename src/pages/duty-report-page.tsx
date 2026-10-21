import { ArrowLeft, CalendarDays, ChevronDown, FilePlus2, FileText, Paperclip, Save, Upload } from 'lucide-react'
import { AppSidebar } from '@/components/phase-one/app-sidebar'
import { AppTopNav } from '@/components/phase-one/app-top-nav'
import { AppTabBar } from '@/components/phase-one/app-tab-bar'
import { ReportDocumentPreview } from '@/components/phase-one/report-document-preview'
import { dutyRows, dutySideItems, dutyTabs, dutyTotal } from '@/lib/duty-report-data'
import './emergency-report.css'
import './duty-report.css'

export function DutyReportPage() {
  return (
    <div className="duty-page">
      <AppSidebar items={dutySideItems} userName="李霖枫" />
      <div className="dr-workspace">
        <AppTopNav activeModule="值班值守" />
        <AppTabBar tabs={dutyTabs} />
        <main className="dr-main">
          <div className="dr-heading">
            <span className="dr-back"><ArrowLeft />返回</span><h1>新增日报</h1>
            <div className="dr-heading-actions">
              <button type="button" className="er-button"><Upload />上传文件</button>
              <button type="button" className="dr-outline-button"><FileText />使用上次数据</button>
              <button type="button" className="er-button"><Save />保存草稿</button>
              <button type="button" className="er-button"><FilePlus2 />提交审批</button>
            </div>
          </div>
          <div className="dr-columns">
            <section className="dr-form-column" aria-label="日报信息">
              <div className="dr-form-grid">
                <div className="dr-field"><span className="dr-label"><i>*</i>值班日期</span><div className="dr-input">2026-10-21 11:28:30<CalendarDays /></div></div>
                <div className="dr-field"><span className="dr-label"><i>*</i>标题</span><div className="dr-input">值班日报(2026-10-21)</div></div>
                <div className="dr-field"><span className="dr-label"><i>*</i>带班领导</span><div className="dr-personnel"><button type="button" className="dr-outline-button">添加人员</button><span>徐正东<b>×</b></span></div></div>
                <div className="dr-field"><span className="dr-label"><i>*</i>值班员</span><div className="dr-personnel"><button type="button" className="dr-outline-button">添加人员</button><span>陈芝春<b>×</b></span></div></div>
                <div className="dr-field"><span className="dr-label">值班电话</span><div className="dr-input">18911858677</div></div>
                <div className="dr-field"><span className="dr-label"><i>*</i>值班单位类别</span><div className="dr-input">集团<ChevronDown /></div></div>
                <div className="dr-field dr-attachments"><span className="dr-label">附件</span><div><button type="button" className="dr-attachment-button">上传文件<Paperclip /></button><p>支持Excel，Word，Pdf，图片，视频</p></div></div>
              </div>

              <section className="dr-attendance" aria-label="人员在岗情况">
                <h2>人员在岗情况</h2>
                <div className="dr-table-wrap">
                  <table>
                    <colgroup><col className="dr-unit-col" /><col />{Array.from({ length: 5 }, (_, i) => <col key={i} />)}<col /></colgroup>
                    <thead>
                      <tr><th rowSpan={2}>单位</th><th rowSpan={2}>总人数</th><th colSpan={3}>在岗工作总数</th><th rowSpan={2}>休假、出差等人数</th><th rowSpan={2}>转隶前长期待岗职工</th><th rowSpan={2}>备注</th></tr>
                      <tr><th>公司本部上班</th><th>一线施工</th><th>应急备勤</th></tr>
                    </thead>
                    <tbody>
                      {dutyRows.map(row => <tr key={row.unit}><td title={row.unit}><span className="dr-unit-name">{row.unit}</span></td>{row.values.map((value, index) => <td key={index}>{index === 0 ? value : <span className="dr-table-input">{value}</span>}</td>)}<td><span className="dr-table-input dr-placeholder">请输入</span></td></tr>)}
                      <tr className="dr-total"><td>合计</td>{dutyTotal.map((value, index) => <td key={index}>{value}</td>)}<td /></tr>
                    </tbody>
                  </table>
                </div>
              </section>
              <div className="dr-generate"><button type="button" className="er-button"><FileText />生成文档并预览</button></div>
            </section>
            <section className="dr-preview-column" aria-label="日报文档预览"><ReportDocumentPreview daily /></section>
          </div>
        </main>
      </div>
    </div>
  )
}
