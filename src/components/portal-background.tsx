/**
 * 门户页整屏背景：纯 CSS 近似参考图 axn.png 的蓝色大屏氛围
 * （蓝紫渐变 + 左上紫色光晕 + 斜向光束 + 下方流光带 + 点阵网格 + 右下点阵地球与光路）。
 *
 * 如果要和参考图完全一致，请把真实背景图放到 src/assets/ 后引用，
 * 取消下面「真实背景图接入位」的注释即可覆盖全部 CSS 近似层。
 */
export function PortalBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#2a3f9c]">
      {/* 基础蓝紫渐变 */}
      <div className="absolute inset-0 bg-[linear-gradient(150deg,#4a3c9c_0%,#35479f_18%,#2b4cb2_44%,#20409a_72%,#24407f_100%)]" />
      {/* 左上紫色光晕 */}
      <div className="absolute -left-[14%] -top-[22%] size-[56%] rounded-full bg-[radial-gradient(circle,rgba(155,85,225,.55),transparent_66%)] blur-3xl" />
      {/* 顶部中间亮蓝 */}
      <div className="absolute -top-[14%] left-[22%] h-[50%] w-[52%] rounded-full bg-[radial-gradient(circle,rgba(88,100,240,.55),transparent_68%)] blur-3xl" />
      {/* 画面中部偏右的整体提亮（卡片背后的光） */}
      <div className="absolute left-[34%] top-[8%] h-[86%] w-[58%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(105,150,255,.42),transparent_70%)] blur-3xl" />
      {/* 右下亮蓝 */}
      <div className="absolute -bottom-[22%] -right-[12%] size-[64%] rounded-full bg-[radial-gradient(circle,rgba(95,165,255,.55),transparent_68%)] blur-3xl" />

      {/* 斜向光束 */}
      <div className="absolute -top-[30%] left-[34%] h-[170%] w-[20%] rotate-[24deg] bg-[linear-gradient(180deg,rgba(195,228,255,.32),transparent_72%)] blur-2xl" />
      <div className="absolute -top-[30%] left-[62%] h-[170%] w-[13%] rotate-[24deg] bg-[linear-gradient(180deg,rgba(195,228,255,.22),transparent_68%)] blur-2xl" />
      <div className="absolute -top-[25%] left-[8%] h-[150%] w-[9%] rotate-[24deg] bg-[linear-gradient(180deg,rgba(200,230,255,.14),transparent_65%)] blur-2xl" />

      {/* 下方流光带 */}
      <div className="absolute -bottom-[10%] left-[-2%] h-[46%] w-[86%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(80,145,255,.4),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[2%] left-[6%] h-[22%] w-[74%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(130,205,255,.4),transparent_72%)] blur-xl" />
      <div className="absolute bottom-[13%] left-[10%] h-[5%] w-[70%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(190,235,255,.45),transparent_70%)] blur-lg" />

      {/* 全屏点阵网格（右下浓、左上淡） */}
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(150,210,255,.9)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(125%_85%_at_78%_96%,#000_12%,transparent_72%)]" />

      {/* 右下点阵地球 */}
      <div className="absolute -bottom-[26%] -right-[4%] size-[56%] rounded-full opacity-35 [background-image:radial-gradient(rgba(175,225,255,.9)_1.5px,transparent_1.5px)] [background-size:13px_13px] [mask-image:radial-gradient(circle_at_center,#000_40%,transparent_70%)]" />

      {/* 右下光路与光点 */}
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="absolute bottom-0 right-0 h-[42%] w-[38%] opacity-70"
      >
        <g stroke="rgba(160,220,255,.5)" strokeWidth="0.12" fill="none">
          <path d="M2 46 L26 30 L52 38 L78 16 L96 26" />
          <path d="M20 58 L40 34 L70 44" />
        </g>
        <g fill="#d8f0ff">
          <circle cx="26" cy="30" r="0.7" />
          <circle cx="52" cy="38" r="0.55" />
          <circle cx="78" cy="16" r="0.8" />
          <circle cx="40" cy="34" r="0.5" />
          <circle cx="70" cy="44" r="0.6" />
        </g>
      </svg>
      <div className="absolute bottom-[15%] right-[15%] size-2 rounded-full bg-[#bfe6ff] shadow-[0_0_18px_6px_rgba(140,210,255,.65)]" />
      <div className="absolute bottom-[26%] right-[30%] size-1.5 rounded-full bg-[#d4f0ff] shadow-[0_0_14px_5px_rgba(140,210,255,.5)]" />
      <div className="absolute bottom-[7%] right-[26%] size-1.5 rounded-full bg-[#d4f0ff] shadow-[0_0_14px_5px_rgba(140,210,255,.5)]" />

      {/* 真实背景图接入位：放图后可用它整体替换上面的近似层 */}
      {/* <img src={portalBg} alt="" className="absolute inset-0 size-full object-cover" /> */}
    </div>
  )
}
