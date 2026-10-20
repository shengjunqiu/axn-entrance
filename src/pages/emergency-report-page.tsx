import {
  ArrowLeft, CalendarDays, ChevronDown, ChevronUp, ClipboardList,
  FilePlus2, FileText, Layers, LogOut, MapPinned, Minus,
  MonitorUp, Newspaper, Plus, RotateCcw, Save, ScanLine,
  Siren, Upload, UserRound, UsersRound,
} from 'lucide-react'
import './emergency-report.css'
import { ReportDocumentPreview } from '@/components/phase-one/report-document-preview'
import { SummaryReportContent } from '@/components/phase-one/summary-report-content'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const menuItems = [
  { label: '事件列表', icon: ClipboardList, tone: 'cyan' },
  { label: '研判分析', icon: ScanLine, tone: 'blue', expand: true },
  { label: '应急响应', icon: Siren, tone: 'gold' },
  { label: '力量抽组', icon: UsersRound, tone: 'cyan', expand: true },
  { label: '现场管理', icon: MapPinned, tone: 'cyan', expand: true },
  { label: '要情快报', icon: Newspaper, tone: 'green', expand: true },
  { label: '回撤归建', icon: RotateCcw, tone: 'green', expand: true },
  { label: '总结复盘', icon: FileText, tone: 'orange', expand: true },
]

/** 综合协调保障系统的静态样式复刻，不连接业务接口。 */
export function EmergencyReportPage({ summary = false }: { summary?: boolean }) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(summary ? '总结复盘' : '要情快报')

  return (
    <div className={`emergency-report ${summary ? 'summary-report' : ''}`}>
      <header className="er-header">
        <div className="er-brand">
          <svg viewBox="0 0 36 32" aria-hidden="true"><path d="M2 28 13 4h10L13 28Z" fill="#1384d1" /><path d="m19 4 6 24h9L29 4Z" fill="#d8333e" /></svg>
          <h1>应急救援综合协调保障系统</h1><span className="er-brand-line" />
        </div>
        <div className="er-header-tools">
          <span className="er-avatar"><UserRound /></span><span>李霖枫</span>
          <button type="button" aria-label="大屏展示"><MonitorUp /></button>
          <button type="button" aria-label="退出系统"><LogOut /></button>
        </div>
      </header>

      <div className="er-layout">
        <aside className="er-sidebar">
          <nav aria-label="业务导航">
            {menuItems.map(({ label, icon: Icon, tone, expand }) => {
              const navigable = label === '要情快报' || label === '总结复盘'
              const expanded = expandedMenu === label
              const rowContent = <>
                <span className={`er-menu-icon er-tone-${tone}`}><Icon /></span>
                <span>{label}</span>
                {expand && (expanded ? <ChevronUp className="er-chevron" /> : <ChevronDown className="er-chevron" />)}
              </>
              return (
              <div key={label}>
                {navigable ? (
                  <button type="button" className="er-menu-row er-menu-toggle" aria-expanded={expanded} aria-controls={label === '要情快报' ? 'emergency-report-menu' : 'summary-report-menu'} onClick={() => setExpandedMenu(expanded ? null : label)}>
                    {rowContent}
                  </button>
                ) : <div className="er-menu-row">{rowContent}</div>}
                {label === '要情快报' && expanded && (
                  <div className="er-submenu" id="emergency-report-menu">
                    <div><span className="er-diamond" />快报</div>
                    <Link to="/coordination/emergency-report/new" className={!summary ? 'er-submenu-active' : ''} aria-current={!summary ? 'page' : undefined}><span className="er-diamond" />应急要情</Link>
                  </div>
                )}
                {label === '总结复盘' && expanded && (
                  <div className="er-submenu" id="summary-report-menu">
                    <div><span className="er-diamond" />全过程记录</div>
                    <Link to="/coordination/summary-report/new" className={summary ? 'er-submenu-active' : ''} aria-current={summary ? 'page' : undefined}><span className="er-diamond" />总结报告</Link>
                  </div>
                )}
              </div>
              )
            })}
          </nav>
        </aside>

        <main className="er-main">
          <div className="er-page-heading">
            <span className="er-back"><ArrowLeft />返回</span>
            <h2>{summary ? '新建报告' : '新建应急要情'}</h2>
            {!summary && <div className="er-heading-actions">
              <button type="button" className="er-button"><Save />保存草稿</button>
              <button type="button" className="er-button"><FilePlus2 />提交审批</button>
            </div>}
          </div>

          {summary ? <SummaryReportContent /> : <div className="er-page-body">
            <div className="er-form">
              <div className="er-form-row">
                <div className="er-field">
                  <span className="er-label"><i>*</i>期号</span>
                  <div className="er-period">
                    <div className="er-input er-year">2026<CalendarDays /></div>
                    <span>第</span>
                    <div className="er-input er-stepper"><Minus /><span>0</span><Plus /></div>
                    <span>期</span>
                  </div>
                </div>
                <div className="er-field er-name-field">
                  <span className="er-label"><i>*</i>要情名称</span>
                  <div className="er-input er-name er-placeholder">请输入要情名称</div>
                </div>
              </div>
              <div className="er-form-row">
                <div className="er-field">
                  <span className="er-label"><i>*</i>填写报告时间</span>
                  <div className="er-input er-date">2026-10-20 14:23:32<CalendarDays /></div>
                </div>
              </div>
            </div>

            <section className="er-report-section" aria-label="报告内容">
              <div className="er-report-heading">
                <h3><span className="er-section-mark" />报告内容<span className="er-heading-decoration">◆ · ◆ ·</span></h3>
                <div className="er-report-actions">
                  <button type="button" className="er-button"><Save />存为模板</button>
                  <button type="button" className="er-button"><Layers />本单位模板</button>
                  <button type="button" className="er-button"><Upload />上传文件</button>
                </div>
              </div>
              <ReportDocumentPreview />
            </section>
          </div>}
        </main>
      </div>
      <footer className="er-footer">中央企业应急救援综合平台<span>技术支持：18501981563、15801264928</span></footer>
    </div>
  )
}
