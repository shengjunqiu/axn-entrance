import { Bot, Box, Laptop, Send, ShieldUser, type LucideIcon } from 'lucide-react'

export type PortalEntryId =
  | 'business'
  | 'coordination'
  | 'decision-map'
  | 'mobile-app'
  | 'an-xiaoneng'

export type PortalEntry = {
  id: PortalEntryId
  title: string
  icon: LucideIcon
  /**
   * 点击后的跳转地址（可选）。填写后点卡片就会跳到该地址，
   * 留空则在 portal-page.tsx 的 handleEnter 里走待定的分支。
   */
  href?: string
  /**
   * 卡片背景图（可选）。把图片放到 src/assets/ 后在这里引用，例如：
   *   import businessShot from '@/assets/portal-business.jpg'
   *   image: businessShot
   * 留空则只显示蓝色渐变底（效果见 portal-card.tsx 的降级样式）。
   */
  image?: string
}

/**
 * 桌面门户页的入口卡片。
 * 前四个来自参考图 axn.png，第五个「安小能」是本次演示新增的模拟入口。
 * 点击后要去哪里，等各入口的跳转目标确认后在这里补充（或加 href 字段）。
 */
export const portalEntries: PortalEntry[] = [
  { id: 'business', title: '综合业务系统', icon: Box },
  { id: 'coordination', title: '综合协调保障系统', icon: Laptop },
  { id: 'decision-map', title: '辅助决策一张图', icon: Send },
  { id: 'mobile-app', title: '移动应用子系统', icon: ShieldUser },
  // 标注（vibe_1791766663815_wzsqskq61）：点击安小能卡片跳转到真实演示站点
  { id: 'an-xiaoneng', title: '安小能', icon: Bot, href: 'https://axn-demo.pages.dev/' },
]
