export type WritingAction = 'draft' | 'polish' | 'check'
export type WritingRequest = {
  action: WritingAction
  source: string
  title: string
  style?: '规范表述' | '精简内容'
}
export type WritingResult = { text: string; issues: { title: string; detail: string }[] }

export const sampleMaterial = '10月20日14时，某县青山镇发生山体滑坡，道路受阻。救援队已出动30人、挖掘机3台，正在开展道路清障。伤亡情况正在核实，下一步继续排查现场风险。'

/** 本地规则演示，不调用模型，不推断或补充现场事实。 */
export function demonstrateWriting(request: WritingRequest): WritingResult {
  const source = request.source.trim()
  if (request.action === 'check') {
    const checks = [
      { title: '事件时间', present: /\d{1,4}[年/月日时点]|今天|今日|昨日/.test(source), detail: '请补充事件发生时间，并确认与报告时间的先后关系。' },
      { title: '事发地点', present: /省|市|县|区|镇|乡|村|街道|路段/.test(source), detail: '请补充具体地点，尽量明确到乡镇或现场位置。' },
      { title: '力量投入', present: /\d+\s*(人|名|台|辆|套)/.test(source), detail: '请补充已投入的人员、装备数量及统计口径。' },
      { title: '处置进展', present: /开展|清障|排查|转移|处置|救援|抢险/.test(source), detail: '请补充当前行动和实际进展。' },
      { title: '下一步安排', present: /下一步|后续|继续|计划/.test(source), detail: '请补充下一步工作安排。' },
    ]
    const issues = checks.filter(item => !item.present).map(({ title, detail }) => ({ title: `待补充：${title}`, detail }))
    if (/待核实|核实中|正在核实|待补充|\*{2,}/.test(source)) issues.push({ title: '待核实信息', detail: '正文仍有待核实或占位内容，提交前请逐项确认。' })
    issues.push({ title: '人工核对数字与时间', detail: '请对照现场记录核对人数、装备、伤亡、时间和统计口径。本地演示仅按关键词检查，不能判断事实真实性或全文一致性。' })
    return { text: '', issues }
  }
  if (request.action === 'polish') {
    return {
      text: source.replace(/今天/g, '今日').replace(/目前正在/g, '目前正').replace(/伤亡情况还没核实/g, '伤亡情况正在核实').replace(/已经/g, '已').replace(/[ \t]+$/gm, ''),
      issues: [{ title: '本地规则演示', detail: '仅替换少量常见口语，不执行模型改写或内容精简。真实润色需接入模型。' }],
    }
  }
  return {
    text: `${request.title.trim() || '应急救援情况'}\n\n一、现场情况与处置进展\n${source || '【待核实】事件发生时间、地点、基本情况、力量投入及当前处置进展。'}\n\n二、待补充事项\n【待核实】请根据现场记录补充尚未提供的具体时间、地点、伤亡情况、力量投入及下一步安排；已提供的信息以原始材料为准。`,
    issues: [{ title: '本地模板演示', detail: '原始材料按原文放入模板，未调用模型。请核实后再采用。' }],
  }
}
