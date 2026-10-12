import { HexagonIcon } from '@/components/hexagon-icon'
import type { PortalEntry } from '@/lib/portal-entries'

type PortalCardProps = {
  entry: PortalEntry
  onEnter: (entry: PortalEntry) => void
}

/** 卡片外观（两种交互元素共用，保证 <a> 与 <button> 视觉完全一致） */
const CARD_CLASS =
  'relative block aspect-[679/971] w-full cursor-pointer overflow-hidden rounded-[3.8cqw] border-[0.6cqw] border-[#a6d1ff]/85 text-left shadow-[0_0_1.8cqw_rgba(125,200,255,.6),inset_0_0_4cqw_rgba(120,190,255,.18)] outline-none transition duration-300 hover:border-[#d6ecff] hover:shadow-[0_0_3cqw_rgba(140,215,255,.75),inset_0_0_5cqw_rgba(140,205,255,.28)] focus-visible:border-[#d6ecff] focus-visible:shadow-[0_0_3cqw_rgba(140,215,255,.75)]'

/**
 * 门户入口卡片，几何比例取自参考图 axn.png（卡片高宽比 971:679）。
 * 外层容器声明 @container，卡片内部尺寸全部用 cqw（卡片宽度的百分之一），
 * 整卡缩放时比例保持不变：
 *   顶部高光条 left 9.6cqw / top 0 / 1.9x13.6cqw
 *   标题中心 43.8cqw，六边形图标中心 83.4cqw、宽 31cqw
 *
 * entry.href 有值时整卡渲染为 <a>（浏览器原生跳转，支持中键/右键），
 * 否则渲染为 <button> 交给 onEnter。
 */
export function PortalCard({ entry, onEnter }: PortalCardProps) {
  const Icon = entry.icon

  const content = (
    <>
        {/* 卡片底色：半透明蓝叠在页面背景之上 */}
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(135,195,255,.36)_0%,rgba(72,128,218,.2)_46%,rgba(46,92,182,.36)_100%)]" />
        {/* 斜向高光 + 左上提亮：近似参考图卡片内的照片光感 */}
        <span className="absolute inset-0 bg-[linear-gradient(118deg,transparent_30%,rgba(200,232,255,.2)_47%,transparent_64%)]" />
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_0%,rgba(170,215,255,.24),transparent_60%)]" />

        {/* 卡片背景图（可选），见 portal-entries.ts 的 image 字段 */}
        {entry.image ? (
          <img
            src={entry.image}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-45 mix-blend-luminosity"
          />
        ) : null}

        {/* 顶部高光条 */}
        <span className="absolute left-[9.6cqw] top-0 h-[13.6cqw] w-[1.9cqw] rounded-full bg-[linear-gradient(180deg,rgba(125,175,245,.45)_0%,#7ee0ff_36%,#4d8ef7_100%)] shadow-[0_0_2cqw_rgba(110,215,255,.95)]" />

        {/* 标题 */}
        <span className="absolute inset-x-0 top-[43.8cqw] -translate-y-1/2 text-center text-[7cqw] leading-none font-normal text-white [text-shadow:0_0_1.6cqw_rgba(150,215,255,.8)]">
          {entry.title}
        </span>

        {/* 六边形图标 */}
        <span className="absolute left-1/2 top-[83.4cqw] size-[31cqw] -translate-x-1/2 -translate-y-1/2">
          <HexagonIcon icon={Icon} />
        </span>
    </>
  )

  return (
    <div className="@container w-[var(--card-w)] shrink-0">
      {entry.href ? (
        <a href={entry.href} rel="noopener" className={CARD_CLASS}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={() => onEnter(entry)} className={CARD_CLASS}>
          {content}
        </button>
      )}
    </div>
  )
}
