/**
 * mmx-quota-tool — host entry.
 *
 * Polls MiniMax token-plan remains every 60s and exposes two HTTP routes on
 * the profile's webServer:
 *
 *   GET /api/mmx-quota-tool/quota   → JSON snapshot { rows, lastFetchedAt, ... }
 *   POST /api/mmx-quota-tool/refresh → forces an immediate refresh + snapshot
 *
 * The Client bundle polls /quota every 5s so model-switch visibility is
 * within 5s; the actual upstream fetch only runs every 60s.
 *
 * Configuration:
 *   MMX_API_KEY env var     — required; your MiniMax API key (Bearer + x-api-key)
 *   MMX_REGION              — 'cn' (default, api.minimaxi.com) or 'global' (api.minimax.io)
 *   MMX_REFRESH_MS          — upstream poll interval (default 60000)
 *   MMX_POLL_INTERVAL_MS    — client poll interval (default 5000, see client.js)
 */

import os from 'node:os'

export const name = 'mmx-quota-tool'

const CURL_PATH = '/usr/bin/curl'
const REGION_ENDPOINTS = {
  cn: 'https://api.minimaxi.com/v1/token_plan/remains',
  global: 'https://api.minimax.io/v1/token_plan/remains',
}
const URL = REGION_ENDPOINTS[process.env.MMX_REGION || 'cn'] || REGION_ENDPOINTS.cn
const CWD = os.homedir()

const REFRESH_INTERVAL_MS = Number(process.env.MMX_REFRESH_MS) || 60_000
const SUBPROCESS_GRACE_MS = 12_000

function getApiKey() {
  const key = process.env.MMX_API_KEY
  if (!key || typeof key !== 'string' || key.length < 8) {
    throw new Error('mmx-quota-tool: MMX_API_KEY env var is required; export MMX_API_KEY=<your key> before launching dsh web')
  }
  return key
}

const decoder = new TextDecoder('utf-8')

const MINIMAX_PROVIDERS = ['minimax', 'minimax-cn', 'minimax-global', 'MiniMax', 'MiniMax-M3', 'MiniMax-M2', 'MiniMax-M1']
const MINIMAX_MODEL_PREFIXES = ['MiniMax-', 'minimax-']

function isMmxModel(sel) {
  if (!sel || typeof sel !== 'object') return false
  const provider = String(sel.provider || '').toLowerCase()
  const model = String(sel.model || '').toLowerCase()
  if (MINIMAX_PROVIDERS.some(p => provider === p.toLowerCase())) return true
  if (MINIMAX_MODEL_PREFIXES.some(p => model.startsWith(p.toLowerCase()))) return true
  return false
}

let cached = null, lastFetchedAt = 0, lastError = null, lastStatus = null
let fetchSeq = 0, timerHandle = null, agentDefaultModelRef = null, currentModel = null

function pickNumeric(value, fallback) {
  const n = Number(value); return Number.isFinite(n) ? n : fallback
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return null
  const intervalRemain = pickNumeric(
    row.current_interval_remaining_percent != null ? row.current_interval_remaining_percent : row.interval_pct,
    null,
  )
  const weeklyRemain = pickNumeric(
    row.current_weekly_remaining_percent != null ? row.current_weekly_remaining_percent : row.weekly_pct,
    null,
  )
  return {
    name: String(row.model_name || row.name || 'unknown'),
    interval_remaining_pct: intervalRemain,
    weekly_remaining_pct: weeklyRemain,
    interval_used_pct: intervalRemain === null ? null : (100 - intervalRemain),
    weekly_used_pct: weeklyRemain === null ? null : (100 - weeklyRemain),
    interval_total: pickNumeric(row.current_interval_total_count != null ? row.current_interval_total_count : row.interval_total, 0),
    interval_used: pickNumeric(row.current_interval_usage_count != null ? row.current_interval_usage_count : row.interval_used, 0),
    weekly_total: pickNumeric(row.current_weekly_total_count != null ? row.current_weekly_total_count : row.weekly_total, 0),
    weekly_used: pickNumeric(row.current_weekly_usage_count != null ? row.current_weekly_usage_count : row.weekly_used, 0),
    interval_remaining_ms: pickNumeric(row.remains_time != null ? row.remains_time : row.interval_remaining_ms, 0),
    weekly_remaining_ms: pickNumeric(row.weekly_remains_time != null ? row.weekly_remains_time : row.weekly_remaining_ms, 0),
  }
}

function sanitize(obj) {
  if (obj === null || obj === undefined) return null
  if (Array.isArray(obj)) return obj.map(sanitize)
  if (typeof obj === 'object') {
    const out = {}
    for (const k of Object.keys(obj)) {
      const v = obj[k]
      if (v === undefined) continue
      out[k] = sanitize(v)
    }
    return out
  }
  return obj
}

async function fetchQuota() {
  const sub = agentDefaultModelRef && agentDefaultModelRef.subprocess
    ? agentDefaultModelRef.subprocess
    : null
  // Use the file-system subprocess we keep on a closure map keyed by ctx.
  const sub2 = currentSubprocess()
  if (!sub2 || typeof sub2.spawn !== 'function') throw new Error('subprocess service unavailable')
  const key = getApiKey()
  const argv = [
    CURL_PATH, '-sS', '-i',
    '-H', 'Authorization: Bearer ' + key,
    '-H', 'x-api-key: ' + key,
    '-H', 'Accept: application/json',
    '--max-time', '10',
    URL,
  ]
  const handle = sub2.spawn({
    argv,
    cwd: CWD,
    stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
    graceMs: SUBPROCESS_GRACE_MS,
  })
  const stdoutParts = []
  const stderrParts = []
  handle.stdout.on('data', chunk => stdoutParts.push(decoder.decode(chunk, { stream: true })))
  handle.stderr.on('data', chunk => stderrParts.push(decoder.decode(chunk, { stream: true })))
  const outcome = await handle.waitForExit()
  stdoutParts.push(decoder.decode())
  stderrParts.push(decoder.decode())
  const stdout = stdoutParts.join('')
  const statusMatch = stdout.match(/^HTTP\/[\d.]+\s+(\d+)/m)
  const status = statusMatch ? parseInt(statusMatch[1], 10) : 0
  lastStatus = status
  if (status !== 200) {
    throw new Error('HTTP ' + status + ' | stdout=' + stdout.slice(0, 800))
  }
  let body = stdout
  const rfcIndex = stdout.indexOf('\r\n\r\n')
  if (rfcIndex >= 0) body = stdout.slice(rfcIndex + 4)
  else {
    const blankIndex = stdout.indexOf('\n\n')
    if (blankIndex >= 0) body = stdout.slice(blankIndex + 2)
  }
  let parsed
  try { parsed = JSON.parse(body) } catch (e) {
    throw new Error('non-json body=' + body.slice(0, 800))
  }
  const remains = Array.isArray(parsed && parsed.model_remains) ? parsed.model_remains : []
  if (remains.length === 0) {
    throw new Error('empty model_remains; body=' + body.slice(0, 800))
  }
  const rows = remains.map(normalizeRow).filter(Boolean)
  return { rows, fetchedAt: Date.now() }
}

async function refreshNow() {
  const seq = ++fetchSeq
  try {
    const snapshot = await fetchQuota()
    if (seq !== fetchSeq) return
    cached = snapshot; lastFetchedAt = snapshot.fetchedAt; lastError = null
  } catch (err) {
    if (seq !== fetchSeq) return
    lastError = String(err && err.message ? err.message : err)
    console.error('[mmx-quota-tool] refresh failed:', lastError)
  }
}

// Subprocess is resolved lazily so the plugin does not require it as a hard
// inject. We use ctx.get('subprocess') when needed.
let cachedSubprocess = null
function currentSubprocess() {
  if (cachedSubprocess) return cachedSubprocess
  // stored on closure via hostContext captured during apply; lazy init below
  return hostSubprocess
}
let hostSubprocess = null
let hostCtxGlobal = null

function readCurrentModel() {
  if (!agentDefaultModelRef || typeof agentDefaultModelRef.currentSelection !== 'function') return null
  try {
    const sel = agentDefaultModelRef.currentSelection()
    if (!sel) return null
    return { provider: sel.provider || null, model: sel.model || null }
  } catch (e) { return null }
}

function buildPayload() {
  return sanitize({
    rows: cached ? cached.rows : [],
    lastFetchedAt,
    lastError,
    lastStatus,
    refreshIntervalMs: REFRESH_INTERVAL_MS,
    model: currentModel,
    isMmx: isMmxModel(currentModel),
  })
}

function readBody(req) {
  return new Promise((resolve) => {
    const parts = []
    req.on('data', chunk => parts.push(decoder.decode(chunk, { stream: true })))
    req.on('end', () => {
      parts.push(decoder.decode())
      resolve(parts.join(''))
    })
    req.on('error', () => resolve(''))
  })
}

function writeJson(res, status, body) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

export const inject = ['webServer', 'timer', 'subprocess', 'agentDefaultModel']

export function apply(ctx) {
  hostCtxGlobal = ctx
  hostSubprocess = ctx.subprocess || null
  agentDefaultModelRef = ctx.agentDefaultModel || null
  currentModel = readCurrentModel()
  refreshNow()
  timerHandle = ctx.interval(() => {
    refreshNow()
    currentModel = readCurrentModel()
  }, REFRESH_INTERVAL_MS)

  ctx.webServer.register({
    kind: 'exact',
    path: '/api/mmx-quota-tool/quota',
    handler: async (req, res) => {
      currentModel = readCurrentModel()
      writeJson(res, 200, buildPayload())
    },
  })
  ctx.webServer.register({
    kind: 'exact',
    path: '/api/mmx-quota-tool/refresh',
    handler: async (req, res) => {
      await refreshNow()
      currentModel = readCurrentModel()
      writeJson(res, 200, buildPayload())
    },
  })
}

export function dispose() {
  if (timerHandle && typeof timerHandle.dispose === 'function') timerHandle.dispose()
  timerHandle = null
  cached = null
  agentDefaultModelRef = null
  currentModel = null
  hostCtxGlobal = null
}