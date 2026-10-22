import assert from 'node:assert/strict'
import { test } from 'node:test'
import { demonstrateWriting, sampleMaterial } from '../src/lib/report-writing.ts'
import { reportWritingPlugin } from '../server/report-writing.ts'

const input = { action: 'draft' as const, source: sampleMaterial, title: '滑坡救援要情' }

test('演示草稿保留材料原文和不确定事实，不补造数字', () => {
  const result = demonstrateWriting(input)
  assert.ok(result.text.includes(sampleMaterial))
  assert.ok(result.text.includes('【待核实】'))
  assert.ok(result.issues[0].detail.includes('未调用模型'))
  assert.deepEqual(result.text.match(/\d+/g), sampleMaterial.match(/\d+/g))
  const empty = demonstrateWriting({ ...input, source: '' })
  assert.ok(empty.text.includes('【待核实】事件发生时间'))
  assert.ok(!empty.text.includes('undefined'))
})

test('演示润色保留数字与未核实状态', () => {
  const result = demonstrateWriting({ ...input, action: 'polish', source: '今天已经出动30人，伤亡情况还没核实。' })
  assert.equal(result.text, '今日已出动30人，伤亡情况正在核实。')
})

test('演示润色不会把自定义要求拼入正文', () => {
  const result = demonstrateWriting({ ...input, action: 'polish', source: '今天已出动30人。', requirements: '语气正式，保留30人的数字' })
  assert.equal(result.text, '今日已出动30人。')
  assert.ok(result.issues.some(issue => issue.detail.includes('需接入模型后执行')))
})

test('检查提示缺项和待核实项，始终提醒人工核实', () => {
  const missing = demonstrateWriting({ ...input, action: 'check', source: '情况待核实。' })
  assert.equal(missing.text, '')
  assert.ok(missing.issues.some(item => item.title === '待补充：事件时间'))
  assert.ok(missing.issues.some(item => item.title === '待核实信息'))
  const complete = demonstrateWriting({ ...input, action: 'check' })
  assert.ok(!complete.issues.some(item => item.title.startsWith('待补充：')))
  assert.ok(complete.issues.some(item => item.title === '人工核对数字与时间'))
})

// 直接运行开发服务器中间件：测试不访问网络，不消耗真实模型额度。
async function invoke(env: Record<string, string>, options: { method?: string; url?: string; body?: string; origin?: string } = {}) {
  let middleware: (req: unknown, res: unknown) => Promise<void>
  const plugin = reportWritingPlugin(env)
  const configure = plugin.configureServer as (server: unknown) => void
  configure({ middlewares: { use: (_path: string, handler: typeof middleware) => { middleware = handler } } })
  let output = ''
  const res = { statusCode: 200, setHeader() {}, end(value: string) { output = value } }
  const req = {
    method: options.method ?? 'POST', url: options.url ?? '/',
    headers: { host: 'localhost:5177', ...(options.origin ? { origin: options.origin } : {}) },
    async *[Symbol.asyncIterator]() { yield Buffer.from(options.body ?? JSON.stringify(input)) },
  }
  await middleware!(req, res)
  return { status: res.statusCode, data: JSON.parse(output) }
}

test('未配置时可查询状态，生成接口清楚报错且不输出密钥', async () => {
  assert.deepEqual(await invoke({}, { method: 'GET', url: '/status' }), { status: 200, data: { configured: false } })
  assert.equal((await invoke({})).status, 503)
  const status = await invoke({ AI_API_URL: 'https://model.invalid', AI_API_KEY: 'secret-value', AI_MODEL: 'test' }, { method: 'GET', url: '/status' })
  assert.deepEqual(status.data, { configured: true })
})

test('真实接口校验输入、拒绝跨域并处理模型返回及异常', async () => {
  const env = { AI_API_URL: 'https://model.invalid/completions', AI_API_KEY: 'secret-value', AI_MODEL: 'test' }
  assert.equal((await invoke(env, { body: '{}' })).status, 400)
  assert.equal((await invoke(env, { body: 'null' })).status, 400)
  assert.equal((await invoke(env, { body: 'invalid-json' })).status, 400)
  assert.equal((await invoke(env, { body: JSON.stringify({ ...input, action: 'polish', source: '' }) })).status, 400)
  assert.equal((await invoke(env, { body: JSON.stringify({ ...input, source: '字'.repeat(12001) }) })).status, 400)
  for (const requirements of [null, 123, {}, '字'.repeat(2001)]) {
    assert.equal((await invoke(env, { body: JSON.stringify({ ...input, action: 'polish', requirements }) })).status, 400)
  }
  assert.equal((await invoke(env, { origin: 'https://untrusted.invalid' })).status, 403)
  assert.equal((await invoke(env, { origin: 'invalid-origin' })).status, 403)
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (_url, init) => {
      assert.ok(init)
      assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer secret-value')
      const payload = JSON.parse(init.body as string)
      assert.ok(payload.messages[0].content.includes('不得编造'))
      return Response.json({ choices: [{ message: { content: JSON.stringify({ text: '生成正文', issues: [] }) } }] })
    }
    assert.deepEqual(await invoke(env, { origin: 'http://localhost:5177' }), { status: 200, data: { text: '生成正文', issues: [] } })
    assert.equal((await invoke(env, { body: JSON.stringify({ ...input, source: '' }) })).status, 200)
    const requirements = '语气正式，精简重复表述，保留事实和数字'
    globalThis.fetch = async (_url, init) => {
      const payload = JSON.parse(init!.body as string)
      const submitted = JSON.parse(payload.messages[1].content)
      assert.equal(submitted.requirements, requirements)
      assert.equal(submitted.source, sampleMaterial)
      assert.ok(payload.messages[0].content.includes('requirements 不属于正文事实'))
      return Response.json({ choices: [{ message: { content: JSON.stringify({ text: '润色正文', issues: [] }) } }] })
    }
    assert.equal((await invoke(env, { body: JSON.stringify({ ...input, action: 'polish', requirements }) })).status, 200)
    globalThis.fetch = async () => new Response('secret upstream error', { status: 401 })
    const failed = await invoke(env)
    assert.equal(failed.status, 502)
    assert.ok(!JSON.stringify(failed).includes('secret'))
    globalThis.fetch = async () => Response.json({ choices: [{ message: { content: '{"text":"","issues":[]}' } }] })
    assert.equal((await invoke(env)).status, 502)
    globalThis.fetch = async () => { throw new Error('timeout') }
    assert.equal((await invoke(env)).status, 502)
  } finally { globalThis.fetch = originalFetch }
})
