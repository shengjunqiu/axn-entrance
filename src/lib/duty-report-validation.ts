type DutyRow = { unit: string; values: number[] }
export type DutyValidationIssue = { unit: string; field: string; current: number; expected: number; detail: string; category: 'personnel' | 'total' }

/** 在副本中注入演示异常，保留页面原始数据。 */
export function createDutyValidationDemo(sourceRows: DutyRow[], sourceTotals: number[]) {
  const rows = sourceRows.map(row => ({ ...row, values: [...row.values] }))
  if (rows[0]) rows[0].values[0] += 3
  if (rows[2]) rows[2].values[1] += 4
  const issues: DutyValidationIssue[] = []
  for (const row of rows) {
    const expected = row.values.slice(1).reduce((sum, value) => sum + value, 0)
    if (row.values[0] !== expected) issues.push({
      unit: row.unit, field: '总人数', current: row.values[0], expected, category: 'personnel',
      detail: `人员分项合计为 ${expected} 人，与总人数相差 ${Math.abs(row.values[0] - expected)} 人，请核对该单位各项人数。`,
    })
  }
  const fields = ['总人数', '公司本部上班', '一线施工', '应急备勤', '休假、出差等人数', '转隶前长期待岗职工']
  sourceTotals.forEach((current, index) => {
    const expected = rows.reduce((sum, row) => sum + row.values[index], 0)
    if (current !== expected) issues.push({
      unit: '合计行', field: fields[index], current, expected, category: 'total',
      detail: `各单位该列汇总为 ${expected} 人，与合计行相差 ${Math.abs(current - expected)} 人，请核对各单位数据及合计。`,
    })
  })
  return issues
}
