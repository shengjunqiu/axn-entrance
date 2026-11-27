import type { ChatAttachment, ChatTurn, OfflineConversation } from './offline-chat-history'
import { offlineChatSources, type OfflineChatSourceId } from './offline-chat-sources'

const scenarios: Omit<OfflineConversation, 'updatedAt'>[] = [
  {
    id: 'demo-rescue-flood',
    pinned: true,
    turns: [
      {
        question: '暴雨内涝转移安置汇总',
        sourceIds: ['floodRoster', 'shelterHandover'],
        reply: '演练简报\n\n本轮模拟强降雨造成低洼片区积水。演练记录显示，社区已转移 36 户、92 人，其中 68 人登记进入临时安置点，24 人投亲靠友。\n\n当前待办是核对转移与安置台账、确认两名行动不便居民的照护交接，以及更新下一班的物资需求。',
      },
      {
        question: '把待交接事项整理成清单。',
        sourceIds: ['shelterHandover', 'shiftTemplate'],
        reply: '1. 社区联络组核对转移名单和安置登记人数。\n2. 安置点联络员确认重点人员的照护交接情况。\n3. 保障组核对饮用水、毛毯和充电设备的库存。\n4. 值班员汇总各组反馈后更新交接台账。',
      },
    ],
  },
  {
    id: 'demo-rescue-earthquake',
    pinned: true,
    turns: [
      {
        question: '地震救援演练调度简报',
        sourceIds: ['earthquakeDispatch', 'exerciseRoles'],
        reply: '演练调度记录\n\n本轮设置三个模拟任务点。现场联络组负责核实任务点状态，医疗保障组负责伤员模拟交接，后勤组负责汇总车辆与物资。\n\n第一轮调度已完成任务签收。下一轮汇报由各组提交进展、待协调事项和下一次反馈时间。',
      },
    ],
  },
  {
    id: 'demo-rescue-landslide',
    turns: [
      {
        question: '山体滑坡救援进展汇报',
        sourceIds: ['landslideProgress'],
        reply: '演练进展\n\n模拟险情已完成报告与跨部门通报。现场组和交通联络组已反馈各自任务进展，应急值班组正在汇总人员核查结果。\n\n仍需确认的信息包括最新人员台账、道路通行状态和下一轮联合会商时间。',
      },
    ],
  },
  {
    id: 'demo-rescue-typhoon',
    turns: [
      {
        question: '台风应急值班交接',
        sourceIds: ['typhoonHandover'],
        reply: '演练交接记录\n\n本班已登记气象信息通报、社区联络反馈和安置点准备情况。下一班需要跟进两处未回执的点位，核对联络表，并按演练安排汇总最新反馈。',
      },
    ],
  },
  {
    id: 'demo-rescue-supplies',
    turns: [
      {
        question: '救援物资调拨台账',
        sourceIds: ['supplyLedger'],
        reply: '演练台账可按物资名称、申请数量、实发数量、接收点和签收状态记录。模拟调拨中，饮用水和毛毯已由安置点签收，应急照明设备仍待保障组回执。\n\n交接时请将未签收事项列出，并记录对应联络人。',
      },
    ],
  },
  {
    id: 'demo-rescue-shelter',
    turns: [
      {
        question: '临时安置点运行日报',
        sourceIds: ['shelterDaily', 'shelterHandover'],
        reply: '演练日报\n\n安置点已完成入住登记、物资发放和需求收集。服务台记录了饮水补给、手机充电和找寻家属三类需求。\n\n下一班需复核入住与离开登记，更新未办结事项，并核对公共物资余量。',
      },
    ],
  },
  {
    id: 'demo-rescue-review',
    turns: [
      {
        question: '跨部门救援演练复盘',
        sourceIds: ['exerciseReview'],
        reply: '本次演练复盘关注三项内容\n\n1. 信息汇总：各组使用同一张进度表，减少重复填报。\n2. 任务交接：接收组在台账上确认负责人和反馈时间。\n3. 待改进项：统一联络表更新方式，并在下一轮演练检查回执是否齐全。',
      },
    ],
  },
]

const cannedReplies: ChatTurn[] = [
  {
    question: '值班交接需要记录哪些内容？',
    sourceIds: ['shiftTemplate'],
    reply: '可以按四项整理交接记录：\n1. 值班时段和交接人员。\n2. 已处理事项及处理结果。\n3. 待跟进事项、负责人和截止时间。\n4. 需要下一班留意的情况和交接资料。',
  },
  {
    question: '给我一份工作简报提纲',
    sourceIds: ['briefingTemplate'],
    reply: '工作简报可分为四部分：\n1. 基本情况：说明时间、范围和背景。\n2. 工作进展：列出已完成的事项和结果。\n3. 存在问题：记录待解决事项及其影响。\n4. 下一步安排：明确行动、负责人和时间节点。',
  },
  {
    question: '怎么整理会议纪要？',
    sourceIds: ['meetingTemplate'],
    reply: '先记下会议时间、参会人和议题，再逐项整理讨论结论。把行动项单独列出，每项注明负责人和截止时间。未达成一致的问题可放到「待确认事项」中。',
  },
  {
    question: '离线状态下你能帮我做什么？',
    sourceIds: ['demoGuide'],
    reply: '离线能力\n\n我是基于本地应急知识库的问答助手，在本机运行，不需要联网，对话内容也只保存在这台设备上。你可以向我查询：\n1. 应急预案、演练方案中的职责分工和流程要求。\n2. 值班交接、工作简报、会商纪要等文书的填写规范。\n3. 演练台账、物资台账中的记录信息。\n\n每条回答都会列出参考资料，方便核对原文。',
  },
]

export const offlineAttachmentPresets = {
  file: { kind: 'file', name: '台风应急值班交接记录.docx', size: '36 KB' },
  photo: { kind: 'image', name: '安置点物资照片.jpg', size: '1.2 MB' },
  camera: { kind: 'image', name: '现场拍摄_1127.jpg', size: '2.4 MB' },
} satisfies Record<string, ChatAttachment>

/** Questions the simulated voice input "hears", in turn. */
export const offlineVoicePresets = cannedReplies.slice(0, 3).map(({ question }) => question)

const attachmentReplies: Record<ChatAttachment['kind'], { question: string; reply: string; sourceIds: readonly OfflineChatSourceId[] }> = {
  file: {
    question: '帮我梳理这份文件的要点',
    sourceIds: ['typhoonHandover', 'shiftTemplate'],
    reply: '文件要点\n\n这份交接记录覆盖了本班的气象通报、社区联络反馈和安置点准备情况，整体信息完整，但有两处点位尚未回执。\n\n建议下一班重点跟进：\n1. 联系两处未回执点位，确认人员转移与安置情况。\n2. 核对社区联络表，更新联系人和联系方式。\n3. 按演练安排汇总最新反馈，补全交接台账。',
  },
  image: {
    question: '帮我看看这张照片',
    sourceIds: ['supplyLedger', 'shelterDaily'],
    reply: '图片识别结果\n\n照片中可以看到饮用水、毛毯和应急照明设备，堆放区域整洁，物资标签清晰可见。\n\n对照物资台账，建议核对：\n1. 饮用水和毛毯的实发数量是否与签收回执一致。\n2. 应急照明设备是否已完成保障组回执。\n3. 公共物资余量是否需要在下一班补充申请。',
  },
}

export function defaultAttachmentQuestion(attachments: ChatAttachment[]) {
  return attachments.length ? attachmentReplies[attachments[0].kind].question : ''
}

const demoGuideSources: readonly OfflineChatSourceId[] = ['demoGuide']
const knownTurns = [...cannedReplies, ...scenarios.flatMap(({ turns }) => turns)]

export function answerOfflineQuestion(question: string, attachments: ChatAttachment[] = []): ChatTurn {
  if (attachments.length) {
    const { reply, sourceIds } = attachmentReplies[attachments[0].kind]
    return { question, reply, sourceIds, attachments }
  }
  return cannedReplies.find((turn) => turn.question === question) ?? {
    question,
    reply: '这个问题暂时超出了本地知识库的覆盖范围，我没能找到可靠的依据。\n\n你可以换个说法再试一次，或者问我应急预案、业务规范、台账记录等相关问题。',
    sourceIds: demoGuideSources,
  }
}

export function getOfflineReplySourceIds(turn: ChatTurn) {
  const ids = Array.isArray(turn.sourceIds)
    ? turn.sourceIds.filter((id): id is OfflineChatSourceId => typeof id === 'string' && Object.hasOwn(offlineChatSources, id))
    : []
  if (ids.length > 0) return ids

  // Earlier saved transcripts only contain question and reply text.
  return knownTurns.find(({ question, reply }) => question === turn.question && reply === turn.reply)?.sourceIds
    ?? demoGuideSources
}

export function createDemoConversations(): OfflineConversation[] {
  const now = Date.now()
  return scenarios.map((scenario, index) => ({ ...scenario, updatedAt: now - (index + 1) * 60 * 60 * 1000 }))
}
