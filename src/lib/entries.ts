import { Monitor, Smartphone, SquareStack } from 'lucide-react'

export type EntryId = 'desktop-portal' | 'phase-one' | 'mobile'

export type Entry = {
  id: EntryId
  title: string
  description: string
  icon: typeof Monitor
  tags: string[]
}

/** 三个集成入口的展示配置，跳转目标在后续步骤补充 */
export const entries: Entry[] = [
  {
    id: 'desktop-portal',
    title: '桌面门户集成入口',
    description: '通过桌面门户单点登录进入安小能，适用于 PC 端日常办公场景。',
    icon: Monitor,
    tags: ['PC', '单点登录'],
  },
  {
    id: 'phase-one',
    title: '一期系统集成入口',
    description: '对接一期系统既有页面，保持原有操作习惯，能力无缝衔接。',
    icon: SquareStack,
    tags: ['一期系统', '既有页面'],
  },
  {
    id: 'mobile',
    title: '移动端集成入口',
    description: '面向手机端的轻量入口，适配移动浏览器与内嵌 WebView。',
    icon: Smartphone,
    tags: ['H5', 'WebView'],
  },
]
