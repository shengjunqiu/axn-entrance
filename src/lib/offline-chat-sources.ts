export const offlineChatSources = {
  // https://www.mem.gov.cn/xw/xwfbh/2025n08y05xwfbh/wzsl_4260/202508/t20250805_553395.shtml
  urbanFloodSafety: { title: '应急管理部汛期安全知识发布会', section: '城市内涝避险' },
  // https://www.mem.gov.cn/xw/xwfbh/2025n05y12xwfbh/
  earthquakeSafety: { title: '应急管理部 2025 年 5 月 12 日新闻发布会', section: '室内外地震避险' },
  // https://yjglj.beijing.gov.cn/art/2022/7/11/art_2768_244332.html
  landslideSafety: { title: '北京市应急管理局《滑坡征兆与避险逃生》', section: '识别滑坡征兆' },
  // https://www.mem.gov.cn/kp/zrzh/202208/t20220809_419856.shtml
  typhoonSafety: { title: '应急管理部《台风来了，如何应对？》', section: '台风前准备与避险' },
  // https://www.mem.gov.cn/kp/shaq/202011/t20201129_372149.shtml
  householdSupplies: { title: '全国基础版家庭应急物资储备建议清单', section: '生活、照明和急救物资' },
  // https://www.fjyc.gov.cn/hdjl/hdzsk/xfdd/202309/t20230927_2944498.htm
  fireReporting: { title: '永春县消防大队《如何正确拨打119火警电话？》', section: '报警时的关键信息' },
  floodRoster: { title: '防汛转移安置演练台账', section: '转移人数与安置登记' },
  shelterHandover: { title: '临时安置点交接记录', section: '照护交接与物资需求' },
  earthquakeDispatch: { title: '地震救援演练调度台账', section: '第一轮任务签收' },
  exerciseRoles: { title: '地震救援联合演练方案', section: '任务点设置与分组职责' },
  landslideProgress: { title: '地质灾害救援演练进展表', section: '跨部门反馈与待核查事项' },
  typhoonHandover: { title: '台风应急值班交接簿', section: '通报、点位回执与下班事项' },
  supplyLedger: { title: '应急救援物资调拨演练台账', section: '物资发放与签收回执' },
  shelterDaily: { title: '临时安置点运行演练日报', section: '入住登记与服务需求' },
  exerciseReview: { title: '跨部门救援演练复盘纪要', section: '协同流程与改进事项' },
  shiftTemplate: { title: '应急值班交接记录样例', section: '交接记录填写项' },
  briefingTemplate: { title: '应急工作简报编写样例', section: '简报结构与内容要点' },
  meetingTemplate: { title: '应急会商会议纪要样例', section: '议题、结论与待办事项' },
  demoGuide: { title: '安小能本地知识库说明', section: '可回答的问题范围' },
} as const

export type OfflineChatSourceId = keyof typeof offlineChatSources
