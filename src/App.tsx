import { Bot } from 'lucide-react'
import { EntryCard } from '@/components/entry-card'
import { entries, type Entry } from '@/lib/entries'

function App() {
  // TODO: 三个入口的跳转目标待确认后在此实现
  const handleEnter = (entry: Entry) => {
    console.log('[entry]', entry.id)
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16 sm:py-24">
        <header className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background">
            <Bot className="size-6" />
          </div>
          <h1 className="font-heading mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            安小能集成入口演示
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            请选择需要体验的集成方式，我们将按对应场景打开安小能。
          </p>
        </header>

        <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onEnter={handleEnter} />
          ))}
        </section>
      </main>

      <footer className="border-t bg-background py-6">
        <p className="text-center text-xs text-muted-foreground">
          安小能集成入口演示 · 仅用于集成联调
        </p>
      </footer>
    </div>
  )
}

export default App
