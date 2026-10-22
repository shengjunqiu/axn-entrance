function pause(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    signal.throwIfAborted()
    const cancel = () => { clearTimeout(timer); reject(signal.reason) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve() }, milliseconds)
    signal.addEventListener('abort', cancel, { once: true })
  })
}

export async function runDutyReportChecks({ signal, onCheck, wait = pause }: {
  signal: AbortSignal
  onCheck: (completed: number) => void
  wait?: (milliseconds: number, signal: AbortSignal) => Promise<void>
}) {
  signal.throwIfAborted()
  onCheck(0)
  for (let completed = 1; completed <= 3; completed++) {
    await wait(650, signal)
    signal.throwIfAborted()
    onCheck(completed)
  }
  await wait(600, signal)
  signal.throwIfAborted()
}

/** 本地演示时序；检查阶段完成后才逐步写入文稿。 */
export async function runDutyReportDemo({ text, signal, onCheck, onWrite, wait = pause }: {
  text: string
  signal: AbortSignal
  onCheck: (completed: number) => void
  onWrite: (text: string, progress: number) => void
  wait?: (milliseconds: number, signal: AbortSignal) => Promise<void>
}) {
  await runDutyReportChecks({ signal, onCheck, wait })
  const characters = Array.from(text)
  const chunkSize = Math.max(8, Math.ceil(characters.length / 100))
  onWrite('', 0)
  for (let end = chunkSize; end < characters.length + chunkSize; end += chunkSize) {
    await wait(35, signal)
    signal.throwIfAborted()
    const length = Math.min(end, characters.length)
    onWrite(characters.slice(0, length).join(''), Math.round(length / characters.length * 100))
  }
}
