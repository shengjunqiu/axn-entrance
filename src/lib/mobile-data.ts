import {
  Archive,
  BookOpen,
  BookUser,
  Bot,
  Boxes,
  CalendarDays,
  ClipboardList,
  FileSignature,
  FileText,
  Grid2x2,
  Inbox,
  Lightbulb,
  Mail,
  MessageSquareMore,
  Newspaper,
  Plane,
  Receipt,
  Send,
  Shield,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

import { AXN_DEMO_URL } from '@/lib/demo-links'

/** 手机屏幕逻辑尺寸（CSS px）。参考图 axn3.png 为 1284×2778，即 428×926 @3x，此处 1:1 对应 */
export const SCREEN_W = 428
export const SCREEN_H = 926

/** 安全区：状态栏高（参考图头部第一段），底部 Home 指示条区（页签栏 80 = 49 + 31 的安全区） */
export const STATUS_BAR_H = 47
export const HOME_INDICATOR_H = 31

export type AppItem = {
  label: string
  /** 图标底色，逐像素采样自参考图 */
  color: string
  icon?: LucideIcon
  /** 用文字代替图标（如 AI、A） */
  text?: string
  badge?: number
  /** 点击后在手机模拟器内打开的页面地址（iframe），无值则不可点 */
  previewUrl?: string
}

export type AppSection = {
  title: string
  items: AppItem[]
}

/** 分区卡片里的应用网格（参考图：5 列，与卡片等宽） */
export const appSections: AppSection[] = [
  {
    title: '办文',
    items: [
      { label: '公文中心', color: '#00A7FF', icon: FileText },
      { label: '统一待办', color: '#005AF4', icon: ClipboardList },
      { label: '公文中心-安能通', color: '#00A6FF', icon: Boxes },
    ],
  },
  {
    title: '常用应用',
    items: [
      { label: '统一待办', color: '#005AF4', icon: ClipboardList },
      { label: '公文中心-安能通', color: '#00A7FF', icon: Boxes },
      { label: '财务共享', color: '#075BFF', icon: Receipt },
      { label: '一局合同管理系统', color: '#00A7FF', icon: BookOpen },
      { label: '合同管理', color: '#1557E8', icon: FileSignature },
      { label: '差旅管理', color: '#8363F1', icon: Plane },
      { label: '综合平台', color: '#F0AA2A', icon: Lightbulb, badge: 9 },
      { label: '监督员平台', color: '#EE7259', icon: Shield },
      { label: '规章制度', color: '#3E90F2', text: 'AI' },
      { label: '企业邮箱', color: '#007BFF', icon: Mail },
      { label: '会议日程-安能通', color: '#FFAD00', icon: CalendarDays },
      { label: '安全生产监管系统', color: '#1357EA', text: 'A' },
      // 标注（vibe_1791773714406_pg01o976q）：新增「安小能」功能入口（参考图外的新增项）
      { label: '安小能', color: '#347AFB', icon: Bot, previewUrl: AXN_DEMO_URL },
    ],
  },
  {
    // 参考图里这一屏被底部页签栏裁掉，只露出标题
    title: '公文',
    items: [
      { label: '收文登记', color: '#00A7FF', icon: Inbox },
      { label: '发文管理', color: '#005AF4', icon: Send },
      { label: '公文归档', color: '#1557E8', icon: Archive },
    ],
  },
]

export const tabBarItems: { label: string; icon: LucideIcon; active?: boolean; dot?: boolean }[] = [
  { label: '消息', icon: MessageSquareMore },
  { label: '通讯录', icon: BookUser },
  // 工作台上有个红点（参考图里图标右上角）
  { label: '工作台', icon: Grid2x2, active: true, dot: true },
  { label: '资讯', icon: Newspaper },
  { label: '我的', icon: UserRound },
]

/** 顶部组织切换页签 */
export const orgTabs = [
  { label: '辽宁公司', dot: true },
  { label: '第一工程局', badge: 9, active: true },
]

export const statusBar = { time: '18:29', battery: 53 }

export const weather = {
  condition: '阴',
  wind: '南风 ≤3级',
  temp: 22,
  city: '北京市',
}
