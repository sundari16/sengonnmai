// Weekly cron paused.
// Vercel Hobby plan does not honour preferredRegion.
// Manual trigger still works via authenticated GET.
// Resume by adding back to crons array in vercel.json.

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300          // 5 min — Pro plan
export const preferredRegion = ['bom1'] // Mumbai — reaches TN .gov.in

// ── Types ─────────────────────────────────────────────────────────────────────

interface Source {
  name: string
  url:  string
  type: 'webpage' | 'pdf' | 'json_api'
}

interface SourceGroup {
  sources:  Source[]
  prompt:   string
  pipeline: string
}

// ── Sources ───────────────────────────────────────────────────────────────────

// India-only: TN govt sites unreachable from US runners but reachable from bom1
const INDIA_SOURCES: Record<string, Source[]> = {
  budget: [
    { name: 'TN Budget Highlights 2024-25',
      url:  'https://tnbudget.tn.gov.in/tnweb_files/budget%20highlights/HIGHLIGHTS%20ENG%202024_25.pdf',
      type: 'pdf' },
    { name: 'TN Budget Speech 2024-25',
      url:  'https://tnbudget.tn.gov.in/tnweb_files/budget%20speech/BUDGET%20SPEECH%202024_25_ENG.pdf',
      type: 'pdf' },
  ],
  gazette: [
    { name: 'eGazette TN latest',
      url:  'https://egazette.tn.gov.in/',
      type: 'webpage' },
    { name: 'TN Gazette',
      url:  'https://www.tngazette.gov.in/',
      type: 'webpage' },
  ],
}

// International: verified reachable from any region
const INTL_SOURCES: Record<string, Source[]> = {
  budget: [
    { name: 'PRS India TN Budget Analysis 2024-25',
      url:  'https://prsindia.org/budgets/states/tamil-nadu-budget-analysis-2024-25',
      type: 'webpage' },
  ],
  gazette: [
    { name: 'India Code TN Acts',
      url:  'https://www.indiacode.nic.in/handle/123456789/1362',
      type: 'webpage' },
  ],
  schemes: [
    { name: 'NHM Tamil Nadu Key Indicators',
      url:  'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1043&lid=418',
      type: 'webpage' },
    { name: 'DBT Bharat TN Schemes',
      url:  'https://dbtbharat.gov.in',
      type: 'webpage' },
    { name: 'myScheme.gov.in TN',
      url:  'https://www.myscheme.gov.in/search?keyword=&state=Tamil+Nadu',
      type: 'webpage' },
  ],
  cag: [],
}

const PROMPTS: Record<string, string> = {
  budget: (
    'Extract ALL department budget figures from this Tamil Nadu budget document. ' +
    'Return ONLY a JSON array:\n' +
    '[{"dept_name":"","budget_estimate_cr":0,"revised_estimate_cr":0,"actual_expenditure_cr":0,"financial_year":"2024-25"}]\n' +
    'All monetary values must be numeric (crore rupees). If revised or actual are unavailable use 0. Text:\n'
  ),
  gazette: (
    'Extract officer transfers and new scheme Government Orders from this Tamil Nadu Gazette text. ' +
    'Return ONLY JSON:\n' +
    '{"transfers":[{"officer_name":"","from_post":"","to_post":"","department":"","go_number":"","date":""}],' +
    '"new_schemes":[{"scheme_name":"","department":"","go_number":"","date":"","brief":""}]}\n' +
    'Text:\n'
  ),
  schemes: (
    'Extract Tamil Nadu government scheme details from this text. ' +
    'Return ONLY a JSON array:\n' +
    '[{"scheme_name":"","department":"","funding_type":"central|state|css","status":"active|discontinued","eligibility":"","brief":""}]\n' +
    'Only include schemes with non-empty scheme_name. Text:\n'
  ),
  cag: (
    'Extract CAG audit report titles and findings for Tamil Nadu. ' +
    'Return ONLY a JSON array:\n' +
    '[{"report_title":"","department":"","financial_year":"","finding":"","amount_cr":0,"finding_type":"irregularity|shortage|excess|other"}]\n' +
    'Only include entries with a non-empty finding. Use neutral factual language. Numbers in crore rupees (0 if unknown). Text:\n'
  ),
}

// ── HTML stripping ────────────────────────────────────────────────────────────

function stripBom(s: string): string {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s
}

function stripHtml(html: string): string {
  let text = stripBom(html)
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, ' ')
  text = text.replace(/\s+/g, ' ').trim()
  return text.slice(0, 12000)
}

function stripBomFromItem(item: unknown): unknown {
  if (typeof item === 'string') return stripBom(item)
  if (Array.isArray(item)) return item.map(stripBomFromItem)
  if (item && typeof item === 'object') {
    return Object.fromEntries(
      Object.entries(item as Record<string, unknown>).map(([k, v]) => [k, stripBomFromItem(v)])
    )
  }
  return item
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

async function fetchPage(url: string): Promise<string> {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,*/*' },
      signal: AbortSignal.timeout(20_000),
    })
    if (!r.ok) return `HTTP_${r.status}`
    const html = await r.text()
    const stripped = stripHtml(html)
    return stripped.length > 500 ? stripped : `SHORT_${stripped.length}`
  } catch (e) {
    return `ERROR:${e}`
  }
}

async function fetchJsonApi(url: string): Promise<{ records: unknown[]; fallback: string }> {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!r.ok) return { records: [], fallback: `HTTP_${r.status}` }
    const data = await r.json() as Record<string, unknown>
    const records =
      (data.records as unknown[]) ??
      ((data.result as Record<string, unknown>)?.records as unknown[]) ??
      []
    if (records.length) return { records: records.slice(0, 30), fallback: '' }
    return { records: [], fallback: JSON.stringify(data).slice(0, 8000) }
  } catch (e) {
    return { records: [], fallback: `ERROR:${e}` }
  }
}

// ── Groq extraction ───────────────────────────────────────────────────────────

async function extract(text: string, sourceType: string): Promise<unknown[]> {
  if (!text || text.startsWith('HTTP_') || text.startsWith('ERROR:') || text.startsWith('SHORT_')) {
    console.log(`  Skip: ${text.slice(0, 80)}`)
    return []
  }
  if (text.trim().length < 500) {
    console.log(`  Skip: insufficient content (${text.trim().length} chars)`)
    return []
  }

  const prompt = PROMPTS[sourceType] ?? PROMPTS.budget
  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) throw new Error('GROQ_API_KEY not set')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON. No explanation. No markdown. No code blocks. Start with [ or {.' },
        { role: 'user',   content: prompt + text.slice(0, 8000) },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!res.ok) {
    console.log(`  Groq HTTP ${res.status}`)
    return []
  }

  const json = await res.json() as { choices: Array<{ message: { content: string } }> }
  let raw = json.choices[0]?.message?.content?.trim() ?? ''

  // Strip markdown fences
  if (raw.startsWith('```')) {
    raw = raw.split('```')[1] ?? ''
    if (raw.startsWith('json')) raw = raw.slice(4)
    raw = raw.trim()
  }

  // Trim to outermost JSON
  if (raw.startsWith('['))      raw = raw.slice(0, raw.lastIndexOf(']') + 1)
  else if (raw.startsWith('{')) raw = raw.slice(0, raw.lastIndexOf('}') + 1)

  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    if (parsed && typeof parsed === 'object') {
      // Flatten dict-of-lists (gazette returns {transfers:[...], new_schemes:[...]})
      return Object.values(parsed as Record<string, unknown>).flatMap(v =>
        Array.isArray(v) ? v : [v]
      )
    }
    return [parsed]
  } catch (e) {
    console.log(`  JSON parse error: ${e}. Raw: ${raw.slice(0, 100)}`)
    return []
  }
}

// ── Filter ────────────────────────────────────────────────────────────────────

function isMeaningful(item: unknown): boolean {
  if (!item || typeof item !== 'object') return false
  const values = Object.values(item as Record<string, unknown>).filter(v => typeof v === 'string')
  const PLACEHOLDERS = new Set(['active|discontinued', 'central|state|css', 'irregularity|shortage|excess|other'])
  return values.some(v => {
    const s = (v as string).trim()
    return s.length > 0 && !PLACEHOLDERS.has(s)
  })
}

// ── Supabase save (raw REST — bypasses JS client header encoding issues) ──────

function sbEnv(key: string): string {
  // Strip ALL BOM characters (U+FEFF) anywhere in the string — they can
  // appear mid-value when copied from certain editors or terminal emulators
  // and cause a Fetch ByteString error if they land in an HTTP header.
  return (process.env[key] ?? '').replace(/﻿/g, '').trim()
}

async function saveQueue(
  items: unknown[],
  sourceName: string,
  sourceType: string,
  log: string[],
): Promise<number> {
  const supabaseUrl = sbEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey  = sbEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceKey) {
    log.push('  Supabase error: env vars missing')
    return 0
  }

  const endpoint = `${supabaseUrl}/rest/v1/admin_queue`
  let saved = 0

  for (const item of items) {
    if (!isMeaningful(item)) continue

    // Serialise and scrub any stray BOM from the body too
    const bodyStr = JSON.stringify({
      source_type:   sourceType,
      pipeline_name: sourceName,
      data:          item,
      confidence:    0.82,
      status:        'pending_review',
      created_at:    new Date().toISOString(),
    }).replace(/﻿/g, '')

    try {
      const r = await fetch(endpoint, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey':        serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer':        'return=minimal',
        },
        body: bodyStr,
        signal: AbortSignal.timeout(10_000),
      })
      if (r.ok) {
        saved++
      } else {
        const msg = await r.text().catch(() => '(no body)')
        log.push(`  Supabase error: HTTP ${r.status} — ${msg.slice(0, 120)}`)
      }
    } catch (e) {
      log.push(`  Supabase error: ${e}`)
    }
  }
  return saved
}

// ── Pipeline runner ───────────────────────────────────────────────────────────

async function runPipeline(
  sourceType: string,
  sources: Source[],
): Promise<{ saved: number; log: string[] }> {
  const log: string[] = []
  let saved = 0

  for (const source of sources) {
    log.push(`Fetching: ${source.name}`)

    let text = ''
    let directItems: unknown[] = []

    if (source.type === 'json_api') {
      const { records, fallback } = await fetchJsonApi(source.url)
      if (records.length) {
        log.push(`  API: ${records.length} records direct`)
        directItems = records
      } else {
        text = fallback
        log.push(`  Got ${text.length} chars (fallback)`)
      }
    } else if (source.type === 'pdf') {
      // No PDF parser available in Edge-compatible Node runtime — skip and note
      log.push(`  SKIP: PDF source requires pdfplumber (Python pipeline only)`)
      text = ''
    } else {
      text = await fetchPage(source.url)
      log.push(`  Got ${text.length} chars`)
    }

    let items: unknown[]
    if (directItems.length > 0) {
      items = directItems
    } else if (!text || text.startsWith('HTTP_') || text.startsWith('ERROR:') || text.startsWith('SHORT_') || text === '') {
      log.push(`  Skip extract: ${text ? text.slice(0, 80) : 'empty'}`)
      items = []
    } else {
      items = await extract(text, sourceType)
    }

    log.push(`  Extracted: ${items.length}`)

    const meaningful = items.filter(isMeaningful).map(stripBomFromItem)
    log.push(`  Meaningful: ${meaningful.length}`)

    const n = await saveQueue(meaningful, source.name, sourceType, log)
    log.push(`  Saved: ${n}`)
    saved += n
  }

  return { saved, log }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Auth — Vercel sends Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const results: Record<string, { saved: number; log: string[] }> = {}
  const pipelineTypes = ['budget', 'gazette', 'schemes', 'cag']

  for (const pt of pipelineTypes) {
    // Merge india-only + international sources for this pipeline
    const sources = [
      ...(INDIA_SOURCES[pt] ?? []),
      ...(INTL_SOURCES[pt] ?? []),
    ]
    if (!sources.length) {
      results[pt] = { saved: 0, log: ['No sources configured'] }
      continue
    }
    console.log(`\n=== ${pt.toUpperCase()} pipeline (${sources.length} sources) ===`)
    results[pt] = await runPipeline(pt, sources)
  }

  const totalSaved = Object.values(results).reduce((s, r) => s + r.saved, 0)
  const region = process.env.VERCEL_REGION ?? 'unknown'
  return NextResponse.json({ ok: true, region, totalSaved, results })
}
