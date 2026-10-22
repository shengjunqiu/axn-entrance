import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createDutyValidationDemo } from '../src/lib/duty-report-validation.ts'

test('模拟异常由副本计算，列出单位和合计差异，保留原始数据', () => {
  const rows = [
    { unit: '总部', values: [95, 85, 0, 0, 10, 0] },
    { unit: '一局', values: [129, 89, 2, 12, 7, 19] },
    { unit: '二局', values: [175, 92, 35, 0, 26, 22] },
  ]
  const totals = [399, 266, 37, 12, 43, 41]
  const before = structuredClone({ rows, totals })
  const issues = createDutyValidationDemo(rows, totals)
  assert.deepEqual({ rows, totals }, before)
  assert.equal(issues.length, 4)
  assert.deepEqual(issues.map(({ unit, field, current, expected }) => ({ unit, field, current, expected })), [
    { unit: '总部', field: '总人数', current: 98, expected: 95 },
    { unit: '二局', field: '总人数', current: 175, expected: 179 },
    { unit: '合计行', field: '总人数', current: 399, expected: 402 },
    { unit: '合计行', field: '公司本部上班', current: 266, expected: 270 },
  ])
})
