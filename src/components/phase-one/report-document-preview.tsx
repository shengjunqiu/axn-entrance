import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownUp,
  Bold, Bot, CheckSquare, ChevronDown, ChevronUp, CloudCheck,
  Eraser, Eye, Globe, Highlighter, IndentDecrease, IndentIncrease,
  Italic, List, ListOrdered, Maximize, Menu, MessageSquarePlus,
  Minus, Paintbrush, Plus, Redo2, Search, Settings2, Strikethrough,
  Underline, Undo2, WrapText,
} from 'lucide-react'
import type { ReactNode } from 'react'

/** 保留文档编辑器外观；传入 children 时在固定抬头下方显示可编辑正文。格式工具栏仍为展示。 */
export function ReportDocumentPreview({ summary = false, daily = false, children, wordCount }: { summary?: boolean; daily?: boolean; children?: ReactNode; wordCount?: number }) {
  return (
    <div className={`er-editor ${summary ? 'sr-editor' : ''} ${daily ? 'dr-editor' : ''}`} aria-label="报告文档预览">
      <div className="er-editor-titlebar">
        <div className="er-editor-filename"><Menu /><strong>{daily ? '值班日报(2026-10-21)' : summary ? '7dfa50be1fb94a378ac3259…' : '应急救援要情'}</strong></div>
        <div className="er-editor-tabs">
          {['开始', '插入', '页面', '审阅', '视图', '效率'].map((tab, index) => (
            <span key={tab} className={index === 0 ? 'er-editor-tab-active' : ''}>{tab}</span>
          ))}
        </div>
        <div className="er-editor-cloud"><Bot /><CloudCheck /></div>
      </div>

      <div className="er-editor-toolbar" aria-label="文档工具栏">
        <Undo2 className="er-tool-muted" /><Redo2 className="er-tool-muted" /><Paintbrush /><Eraser />
        <span className="er-tool-divider" />
        <span className="er-tool-select er-font-select">方正小…<ChevronDown /></span>
        <span className="er-tool-select">{daily ? '一号' : summary ? '二号' : '五号'}<ChevronDown /></span>
        <span className="er-font-adjust">A<sup>+</sup></span><span className="er-font-adjust">A<sup>−</sup></span>
        <span className="er-tool-divider" />
        <Bold /><Italic /><Underline /><Strikethrough />
        <span className="er-tool-select er-text-color"><span>A</span><ChevronDown /></span>
        <span className="er-tool-select er-highlight"><Highlighter /><ChevronDown /></span>
        <span className="er-tool-select er-font-color"><span>A</span><ChevronDown /></span>
        <span className="er-tool-divider" />
        <span className="er-tool-select">正文…<ChevronDown /></span>
        <AlignLeft /><AlignCenter /><AlignRight /><AlignJustify /><WrapText />
        <span className="er-tool-select"><ArrowDownUp /><ChevronDown /></span>
        <IndentDecrease /><IndentIncrease /><CheckSquare />
        <span className="er-tool-select"><List /><ChevronDown /></span>
        <span className="er-tool-select"><ListOrdered /><ChevronDown /></span>
        <span className="er-tool-divider" />
        <span className="er-tool-select er-insert"><Plus />插入<ChevronDown /></span>
        <Settings2 /><ChevronDown /><Search /><ChevronUp />
      </div>

      <div className="er-editor-canvas">
        <article className="er-document-paper" aria-label={daily ? '值班日报文档' : summary ? '任务总结文档' : '应急救援要情文档'}>
          <span className="er-paper-corner er-paper-corner-left" />
          <span className="er-paper-corner er-paper-corner-right" />
          <span className="er-paper-cursor" />
          {daily ? (
            <div className="dr-document-text">
              <div className="dr-document-letterhead"><p>中国安能建设集团有限公司</p><h3>值班日报</h3></div>
              <div className="dr-document-dateline"><span>2026年10月21日11时28分</span><span>审阅：</span></div>
              {!children && <>
              <h4>一、人员在位情况</h4>
              <p>全集团员工共1422人，其中在岗工作1240人（公司本部561人、一线施工440人、应急备勤239人），休假、出差等141人，转隶前长期待岗职工41人。</p>
              <p>（一）集团总部。现有员工95人，其中在岗工作85人（公司本部85人），休假、出差等10人。</p>
              <p>（二）第一工程局。现有员工129人，其中在岗工作103人（公司本部89人、一线施工2人、应急备勤12人），休假、出差等7人，转隶前长期待岗员工19人。</p>
              <p>（三）第二工程局。现有员工175人，其中在岗工作127人（公司本部92人、一线施工35人），休假、出差等26人，转隶前长期待岗员工22人。</p>
              <p>（四）第三工程局。现有员工897人，其中在岗工作808人（公司本部178人、一线施工403人、应急备勤227人），休假、出差等89人。</p>
              <p>（五）安能科工。现有员工45人，其中在岗工作44人，休假、出差等1人。</p>
              </>}
            </div>
          ) : summary ? (
            <div className="sr-document-text">
              <h3>******任务总结</h3>
              <p>***************************************************<br />*****。现将情况总结如下：</p>
              <h4>一、基本情况</h4>
              <p>（一）力量投入情况。工程局从工程局本部和***分公司抽组*人、*台（套）装备（工程局*人、10台（套）装备，***分公司*人、*台（套）装备）参与抢险救援任务，******，连续奋战*个日夜，于*月*日*时*分安全回撤归建。</p>
              <p>（二）任务完成情况。在***联合指挥部统筹协调下，累计转移被困群众*名；******，圆满完成地方政府赋予的各项任务。</p>
              <h4>二、主要做法</h4>
              <p>（一）高度重视，严密组织。收到函请后，工程局立即启动应急响应机制，开设基本指挥所，***，前后密切联动，统一指挥行动，加强与任务区域***对接。</p>
              <p>（二）科学施策，高效应战。建立健全指挥、技术、党建、安全、保障等5个要素指挥体系，严格落实“两点一线”管理和24小时值班值守制度。</p>
            </div>
          ) : <div className="er-document-letterhead">
            <p>应急管理部自然灾害工程应急救援中心</p>
            <p className="er-letterhead-spaced">中央企业应急救援综合平台</p>
            <p className="er-letterhead-spaced">中国安能建设集团有限公司</p>
            <h4>应急救援要情</h4>
          </div>}
          {children}
          <span className="er-paper-comment"><MessageSquarePlus /></span>
        </article>
        <span className="er-editor-assistant"><Bot /></span>
      </div>
      <div className="er-editor-horizontal-scroll"><span /></div>
      <div className="er-editor-statusbar">
        <div className="er-editor-status-left"><List /><span className="er-tool-divider" /><span>{children ? '正文编辑' : daily ? '页面：1/2' : '页面：1/4'}</span><span>节：1/1</span><span>行：1</span><span>列：1</span><span className="er-tool-divider" /><span>字数：{wordCount ?? (daily ? '527' : summary ? '1809' : '1136')}</span></div>
        <div className="er-editor-status-right"><Globe /><span className="er-tool-divider" /><Eye /><span className="er-tool-divider" /><Minus /><span>100%</span><Plus /><Maximize /></div>
      </div>
    </div>
  )
}
