# 安小能集成入口演示

三个集成入口的演示入口页。

- React 19 + TypeScript + Vite
- UI: [shadcn/ui](https://ui.shadcn.com/) (Radix + Tailwind CSS v4)
- 图标: lucide-react
- 包管理: pnpm

## 开发

```bash
pnpm install
pnpm dev      # http://localhost:5177
pnpm build    # tsc -b && vite build
pnpm lint     # oxlint
```

应急要情的 AI 写作功能和模型配置见 [功能说明](docs/report-writing.md)。

## 目录

```text
src/
  App.tsx                     # 首页：标题 + 三个入口卡片
  components/entry-card.tsx   # 入口卡片
  components/ui/              # shadcn/ui 组件（button / card / badge）
  lib/entries.ts              # 三个入口的配置（标题、描述、图标、标签）
  lib/utils.ts                # cn()
```

## 待办

- 三个入口的跳转目标尚未确定，当前统一走 `src/App.tsx` 里的 `handleEnter`。
  目标确定后在此处替换为对应跳转（外链 / 路由 / 新窗口）。

## 新增 shadcn 组件

```bash
pnpm dlx shadcn@latest add dialog
```
