import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { AN_XIAONENG_ICON_URL } from '@/lib/an-xiaoneng-icon'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type OfflineLoginViewProps = {
  onSignIn: (name: string) => void
  onBack: () => void
}

const demoAccount = 'demo'
const demoPassword = 'demo1234'
const fieldClass = 'h-11 w-full rounded-lg border border-border bg-background px-3.5 text-base transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-primary/50 focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_10%,transparent)] focus:outline-none aria-invalid:border-red-400 lg:text-[15px]'

function BrandPanel({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-[linear-gradient(160deg,color-mix(in_oklch,var(--primary)_80%,#0b1b4d)_0%,var(--primary)_48%,color-mix(in_oklch,var(--primary)_60%,#7dd3fc)_100%)] text-white', className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_right_top,black_10%,transparent_70%)]" />
      <div aria-hidden="true" className="absolute -top-28 -right-28 size-96 rounded-full bg-white/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-36 -left-24 size-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div aria-hidden="true" className={cn('absolute rounded-full border border-white/10', compact ? '-top-24 -right-20 size-56' : '-top-48 -right-48 size-[34rem]')} />
      <div aria-hidden="true" className={cn('absolute rounded-full border border-white/15 bg-white/[0.04]', compact ? '-top-12 -right-8 size-32' : '-top-24 -right-24 size-80')} />

      {compact ? (
        <div className="relative flex items-center gap-3.5 p-5">
          <img src={AN_XIAONENG_ICON_URL} alt="" className="size-12 shrink-0 rounded-xl shadow-sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-tight font-semibold">安小能</span>
              <PanelBadge />
            </div>
            <p className="mt-1 text-sm text-white/85">你的应急救援知识问答助手</p>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col justify-center px-12 pb-[8vh]">
          <div className="flex items-center gap-3">
            <img src={AN_XIAONENG_ICON_URL} alt="" className="size-12 shrink-0 rounded-xl shadow-sm" />
            <span className="text-xl font-semibold">安小能</span>
            <PanelBadge />
          </div>
          <p className="mt-10 text-[36px] leading-[1.35] font-semibold">你的应急救援<br />知识问答助手</p>
          <span className="mt-8 block h-1 w-12 rounded-full bg-white/60" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

function PanelBadge() {
  return <span className="inline-flex h-5 items-center rounded-md bg-white/15 px-1.5 text-[11px] font-medium ring-1 ring-white/25 ring-inset">离线版</span>
}

export function OfflineLoginView({ onSignIn, onBack }: OfflineLoginViewProps) {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const fieldDescription = invalidCredentials ? 'offline-login-error' : undefined

  useLayoutEffect(() => {
    heading.current?.focus()
  }, [])

  return (
    <section aria-labelledby="offline-login-title" className="flex min-h-0 min-w-0 flex-1 bg-background">
      <BrandPanel className="m-3 hidden w-[42%] max-w-[560px] shrink-0 lg:block" />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header className="relative flex h-14 w-full shrink-0 items-center px-3 sm:h-16 sm:px-5">
          <Button type="button" variant="ghost" className="h-9 gap-2 rounded-lg px-3 text-muted-foreground hover:bg-foreground/5 hover:text-foreground" onClick={onBack}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            返回对话
          </Button>
        </header>

        <div className="relative flex min-h-0 flex-1 scroll-py-5 flex-col overflow-y-auto px-6 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))] lg:justify-center-safe lg:pt-0 lg:pb-20">
        <div className="mx-auto w-full max-w-[360px] shrink-0 duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none">
          <BrandPanel compact className="-mx-3 mb-7 lg:hidden" />
          <div className="mb-7 lg:mb-9">
            <h1 id="offline-login-title" ref={heading} tabIndex={-1} className="text-2xl leading-tight font-semibold outline-none lg:text-[28px]">欢迎回来</h1>
            <p className="mt-2 text-sm text-muted-foreground">登录你的安小能账号</p>
          </div>

          <form
            className="w-full"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault()
              const valid = account.trim() === demoAccount && password === demoPassword
              if (valid) onSignIn('演示用户')
              else setInvalidCredentials(true)
            }}
          >
            <label htmlFor="offline-login-account" className="mb-1.5 block text-[13px] font-medium">账号</label>
            <input
              id="offline-login-account"
              type="text"
              autoCapitalize="none"
              spellCheck={false}
              required
              placeholder="输入账号"
              value={account}
              onChange={(event) => {
                setAccount(event.target.value)
                setInvalidCredentials(false)
              }}
              aria-invalid={invalidCredentials || undefined}
              aria-describedby={fieldDescription}
              className={fieldClass}
            />
            <label htmlFor="offline-login-password" className="mt-4 mb-1.5 block text-[13px] font-medium">密码</label>
            <div className="relative">
              <input
                id="offline-login-password"
                type={passwordVisible ? 'text' : 'password'}
                autoCapitalize="none"
                spellCheck={false}
                required
                placeholder="输入密码"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setInvalidCredentials(false)
                }}
                aria-invalid={invalidCredentials || undefined}
                aria-describedby={fieldDescription}
                className={`${fieldClass} pr-11`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={passwordVisible ? '隐藏密码' : '显示密码'}
                aria-controls="offline-login-password"
                className="absolute top-1.5 right-1.5 text-muted-foreground"
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                {passwordVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </Button>
            </div>
            {invalidCredentials && (
              <p id="offline-login-error" role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700 duration-200 animate-in fade-in">账号或密码有误，请重试。</p>
            )}
            <Button
              type="submit"
              disabled={!account.trim() || !password}
              className="mt-6 h-11 w-full gap-2 rounded-lg text-[15px] shadow-(--offline-shadow-sm) disabled:bg-muted disabled:text-muted-foreground/70 disabled:opacity-100"
            >
              登录
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
        </div>
      </div>
    </section>
  )
}
