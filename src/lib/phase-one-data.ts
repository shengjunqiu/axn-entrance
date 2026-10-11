import {
  Activity,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  FileText,
  Grip,
  Layers,
  Library,
  MapPin,
  MessagesSquare,
  Newspaper,
  Package,
  SquarePen,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

/**
 * 一期系统（综合业务管理系统）模拟页面的静态数据。
 * 文案与表格内容均按参考图 axn2.png 逐字抄录，仅用于演示，不含任何业务逻辑。
 */

/** 左侧深色菜单项。parent = 一级菜单，child = 展开后的二级菜单 */
export type SideItem = {
  label: string
  level: 'parent' | 'child'
  icon: LucideIcon
  /** 一级菜单右侧的展开箭头 */
  chevron?: 'up' | 'down'
  /** 当前选中（接收信息） */
  active?: boolean
  /** 用更深底色（上报信息） */
  dark?: boolean
}

export const sideItems: SideItem[] = [
  { label: '抢险事件', level: 'parent', icon: FileText, chevron: 'up' },
  { label: '接收信息', level: 'child', icon: Grip, active: true },
  { label: '上报信息', level: 'child', icon: Grip, dark: true },
  { label: '央企救援填报', level: 'parent', icon: SquarePen },
  { label: '应急救灾简报', level: 'parent', icon: CalendarDays },
  { label: '演练演练', level: 'parent', icon: Activity },
  { label: '应急要情', level: 'parent', icon: ClipboardList, chevron: 'down' },
  { label: '快报', level: 'parent', icon: Newspaper, chevron: 'down' },
  { label: '救援统计表', level: 'parent', icon: ChartColumn },
  { label: '事件材料管理', level: 'parent', icon: Layers },
]

/** 顶部八个业务模块。tone 决定图标框的配色 */
export type TopModule = {
  label: string
  icon: LucideIcon
  tone: 'blue' | 'orange' | 'purple' | 'indigo' | 'cyan' | 'amber' | 'red' | 'gold'
  active?: boolean
}

export const topModules: TopModule[] = [
  { label: '信息接报', icon: ClipboardList, tone: 'blue', active: true },
  { label: '值班值守', icon: UserRound, tone: 'orange' },
  { label: '通讯管理', icon: MessagesSquare, tone: 'purple' },
  { label: '预案管理', icon: FileText, tone: 'indigo' },
  { label: '训练演练', icon: Activity, tone: 'cyan' },
  { label: '知识库', icon: Library, tone: 'amber' },
  { label: '力量管理', icon: MapPin, tone: 'red' },
  { label: '装备仓储', icon: Package, tone: 'gold' },
]

/** 图标框配色：浅色底 + 同色描边 + 同色图标 */
export const toneStyles: Record<TopModule['tone'], string> = {
  blue: 'border-[#A8CCFF] bg-[#EAF2FF] text-[#4A8CFF]',
  orange: 'border-[#FBD3A0] bg-[#FEF6EC] text-[#F59A3C]',
  purple: 'border-[#EFC2F5] bg-[#FCF3FE] text-[#C86BD8]',
  indigo: 'border-[#B9C8FF] bg-[#F0F3FF] text-[#5B7CFA]',
  cyan: 'border-[#9FDDF0] bg-[#E9FAFD] text-[#22A7C4]',
  amber: 'border-[#F8CF9B] bg-[#FEF3E6] text-[#F0851F]',
  red: 'border-[#F7B9B4] bg-[#FDEDEC] text-[#E8453C]',
  gold: 'border-[#F5D08D] bg-[#FDF6E7] text-[#E8A33D]',
}

/** 内容区顶部已打开的页签 */
export const openedTabs = [
  { label: '接收信息', active: true },
  { label: '事件材料管理', active: false },
  { label: '编写日报', active: false },
]

/** 筛选条 */
export type FilterField = {
  label: string
  placeholder?: string
  /** input = 可输入框，select = 下拉框，range = 时间区间 */
  kind: 'input' | 'select' | 'range'
  /** 控件宽度（px），按参考图量取 */
  width: number
}

export const filterFields: FilterField[] = [
  { label: '标题', placeholder: '请输入标题', kind: 'input', width: 126 },
  { label: '抢险类别', placeholder: '请选择抢险类别', kind: 'select', width: 170 },
  { label: '更新时间', kind: 'range', width: 235 },
  { label: '信息类型', placeholder: '请选择信息类型', kind: 'select', width: 120 },
  { label: '发送单位', placeholder: '请选择信息单位', kind: 'select', width: 190 },
]

/** 表格列：宽度为参考图量取的占比（合计 100） */
export const tableColumns = [
  { key: 'no', label: '序号', width: 5.2, align: 'center' as const },
  { key: 'title', label: '标题', width: 10.2 },
  { key: 'category', label: '抢险类别', width: 13.5 },
  { key: 'caller', label: '调用单位', width: 11.1 },
  { key: 'updatedAt', label: '更新时间', width: 12.9 },
  { key: 'sender', label: '发送单位', width: 11.6 },
  { key: 'reporter', label: '填报单位', width: 10.8 },
  { key: 'infoType', label: '信息类型', width: 8.6 },
  { key: 'actions', label: '操作', width: 16.1 },
]

export type IncidentRow = {
  no: number
  title: string
  category: string
  caller: string
  updatedAt: string
  sender: string
  reporter: string
  infoType: string
  actions: string[]
}

/** 表格数据（含参考图里的省略号，原样抄录） */
export const incidentRows: IncidentRow[] = [
  {
    no: 1,
    title: '山西省太原市阳...',
    category: '泥石流险情',
    caller: '辰安科技...',
    updatedAt: '2026-10-10 10:37:18',
    sender: '',
    reporter: '中国安能',
    infoType: '录入信息',
    actions: ['信息办理', '处置响应'],
  },
  {
    no: 2,
    title: '河北省石家庄市...',
    category: '电力应急险情',
    caller: '辰安科技...',
    updatedAt: '2026-10-10 10:37:12',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
  {
    no: 3,
    title: '重庆市县城口县...',
    category: '堰塞湖险情',
    caller: '重庆市应...',
    updatedAt: '2026-10-03 18:28...',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
  {
    no: 4,
    title: '河南省郑州市中...',
    category: '内涝险情',
    caller: '郑州市防...',
    updatedAt: '2026-09-21 15:30...',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
  {
    no: 5,
    title: '西藏自治区日喀...',
    category: '山体滑坡险情',
    caller: '应急管理部',
    updatedAt: '2026-09-18 16:11:52',
    sender: '',
    reporter: '中国安能',
    infoType: '录入信息',
    actions: ['信息办理', '处置响应'],
  },
  {
    no: 6,
    title: '湖南省郴州市桂...',
    category: '山体滑坡险情',
    caller: '湖南省应...',
    updatedAt: '2026-09-10 16:03...',
    sender: '',
    reporter: '中国安能',
    infoType: '录入信息',
    actions: ['信息办理', '处置响应'],
  },
  {
    no: 7,
    title: '福建省莆田市城...',
    category: '山体滑坡险情',
    caller: '福建省应...',
    updatedAt: '2026-09-06 12:4...',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
  {
    no: 8,
    title: '江西省吉安市遂...',
    category: '山体滑坡险情',
    caller: '江西省应...',
    updatedAt: '2026-09-06 11:23...',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
  {
    no: 9,
    title: '福建省宁德市蕉...',
    category: '内涝险情',
    caller: '福建省应...',
    updatedAt: '2026-09-06 09:3...',
    sender: '',
    reporter: '中国安能/...',
    infoType: '同步信息',
    actions: ['查看', '处置响应'],
  },
]

/** 分页条 */
export const pagination = {
  total: 113,
  current: 1,
  pages: ['1', '2', '3', '4', '5', '6', '7', '...', '12'],
  pageSize: 10,
}
