import { CalendarDays, ClipboardList, FilePenLine, Grip } from 'lucide-react'
import type { SideItem } from './phase-one-data'

export const dutySideItems: SideItem[] = [
  { label: '值班日报', level: 'parent', icon: CalendarDays, chevron: 'up', href: '/phase-one/duty-report/new' },
  { label: '编写日报', level: 'child', icon: Grip, active: true, href: '/phase-one/duty-report/new' },
  { label: '接收日报', level: 'child', icon: Grip, dark: true },
  { label: '审批日报', level: 'child', icon: Grip, dark: true },
  { label: '值班表', level: 'parent', icon: CalendarDays },
  { label: '排班管理', level: 'parent', icon: CalendarDays, chevron: 'down' },
  { label: '值班日志', level: 'parent', icon: ClipboardList, chevron: 'down' },
  { label: '文电拟办', level: 'parent', icon: FilePenLine, chevron: 'down' },
]

export const dutyTabs = ['编写日报', '计划统计', '计划呈批', '接收日报', '审批日报'].map((label, index) => ({ label, active: index === 0 }))

export const dutyRows = [
  { unit: '集团总部', values: [95, 85, 0, 0, 10, 0] },
  { unit: '第一工程局', values: [129, 89, 2, 12, 7, 19] },
  { unit: '第二工程局', values: [175, 92, 35, 0, 26, 22] },
  { unit: '第三工程局', values: [897, 178, 403, 227, 89, 0] },
  { unit: '安能科工', values: [45, 44, 0, 0, 1, 0] },
  { unit: '华东投资公司', values: [40, 38, 0, 0, 2, 0] },
  { unit: '华南投资公司', values: [24, 20, 0, 0, 4, 0] },
  { unit: '应急技术研究公司', values: [17, 15, 0, 0, 2, 0] },
  { unit: '林芝分公司', values: [0, 0, 0, 0, 0, 0] },
]

export const dutyTotal = [1422, 561, 440, 239, 141, 41]
