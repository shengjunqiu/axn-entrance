import assert from 'node:assert/strict'
import { test } from 'node:test'
import { runDutyReportChecks, runDutyReportDemo } from '../src/lib/duty-report-demo.ts'

test('独立校验按顺序完成三项检查', async () => {
  const completed: number[] = []
  await runDutyReportChecks({ signal: new AbortController().signal, onCheck: value => completed.push(value), wait: async () => {} })
  assert.deepEqual(completed, [0, 1, 2, 3])
})

test('独立校验取消后不再推进检查', async () => {
  const controller = new AbortController()
  const completed: number[] = []
  await assert.rejects(runDutyReportChecks({ signal: controller.signal, onCheck: value => completed.push(value), wait: async () => { controller.abort() } }), { name: 'AbortError' })
  assert.deepEqual(completed, [0])
})

test('校验完成后逐步写入，完整保留中文、输入内容及进度', async () => {
  const text = '一、人员在岗情况\n共1422人。\n二、应急救援情况\n已投入30人🚒\n三、舆情上访情况\n【待核实】'
  const checks: number[] = []
  const writes: { text: string; progress: number }[] = []
  await runDutyReportDemo({ text, signal: new AbortController().signal, wait: async () => {}, onCheck: value => checks.push(value), onWrite: (partial, progress) => {
    assert.deepEqual(checks, [0, 1, 2, 3])
    assert.ok(text.startsWith(partial))
    if (writes.length) assert.ok(progress >= writes.at(-1)!.progress)
    writes.push({ text: partial, progress })
  } })
  assert.ok(writes.length > 2)
  assert.equal(writes[0].text, '')
  assert.deepEqual(writes.at(-1), { text, progress: 100 })
})

test('校验期间取消，不写入编辑器', async () => {
  const controller = new AbortController()
  await assert.rejects(runDutyReportDemo({ text: '日报', signal: controller.signal, wait: async () => { controller.abort() }, onCheck: () => {}, onWrite: () => assert.fail('取消后不应写入') }), { name: 'AbortError' })
})

test('写入期间取消，后续不再更新文稿', async () => {
  const controller = new AbortController()
  const writes: string[] = []
  await assert.rejects(runDutyReportDemo({ text: '这是一份需要分多次写入的模拟值班日报正文。', signal: controller.signal, wait: async () => {}, onCheck: () => {}, onWrite: partial => {
    writes.push(partial)
    if (partial) controller.abort()
  } }), { name: 'AbortError' })
  assert.equal(writes.length, 2)
})
