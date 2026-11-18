import http from 'node:http'
import { timingSafeEqual } from 'node:crypto'
import { saveLead } from '../lib/db.js'
import { processLead, processPendingLeads } from '../lib/lead-outbox.js'

const port = Number.parseInt(process.env.LEAD_API_PORT || '3000', 10)
const token = process.env.LEAD_INGEST_TOKEN || ''

function authorized(value) {
  if (!token || typeof value !== 'string') return false
  const expected = Buffer.from('Bearer ' + token)
  const supplied = Buffer.from(value)
  return expected.length === supplied.length && timingSafeEqual(expected, supplied)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.setEncoding('utf8')
    req.on('data', chunk => {
      raw += chunk
      if (raw.length > 1024 * 1024) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')) } catch { reject(new Error('Invalid JSON')) }
    })
    req.on('error', reject)
  })
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { success: false, error: 'Method not allowed' })
  if (!authorized(req.headers.authorization)) return send(res, 401, { success: false, error: 'Unauthorized' })

  try {
    const body = await readBody(req)
    if (req.url === '/api/leads') {
      if (!/^[0-9a-f-]{36}$/i.test(String(body.idempotencyKey || ''))) {
        return send(res, 400, { success: false, error: 'Invalid idempotency key' })
      }
      if (!['residential', 'commercial'].includes(body.customerType) ||
          typeof body.name !== 'string' || body.name.trim().length < 2 ||
          typeof body.phone !== 'string' || !body.payload || typeof body.payload !== 'object') {
        return send(res, 400, { success: false, error: 'Invalid lead payload' })
      }
      const saved = await saveLead(body)
      let delivery = { espocrm: 'pending', email: 'pending' }
      try { delivery = await processLead(saved.id) } catch (error) {
        console.error('Lead delivery deferred:', error?.message || 'Unknown error')
      }
      return send(res, 200, {
        success: true,
        message: 'Lead safely recorded',
        leadId: saved.id,
        duplicate: saved.duplicate,
        delivery,
      })
    }

    if (req.url === '/api/process-pending') {
      const limit = Math.min(100, Math.max(1, Number.parseInt(process.env.LEAD_WORKER_BATCH_SIZE || '25', 10)))
      const results = await processPendingLeads(limit)
      return send(res, 200, { success: true, processed: results.length, results })
    }

    return send(res, 404, { success: false, error: 'Not found' })
  } catch (error) {
    console.error('Local lead API error:', error?.message || 'Unknown error')
    return send(res, 503, { success: false, error: 'Lead service temporarily unavailable' })
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log('Amy Electric local lead API listening on port ' + port)
})
