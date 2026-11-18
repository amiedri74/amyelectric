import { timingSafeEqual } from 'crypto'
import { processPendingLeads } from '../../../lib/lead-outbox'

export const config = {
  api: { bodyParser: false },
}

function isAuthorized(header, expected) {
  if (!header || !expected) return false
  const supplied = Buffer.from(String(header))
  const token = Buffer.from('Bearer ' + expected)
  return supplied.length === token.length && timingSafeEqual(supplied, token)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }
  if (!isAuthorized(req.headers.authorization, process.env.LEAD_WORKER_TOKEN)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const results = await processPendingLeads(Number.parseInt(process.env.LEAD_WORKER_BATCH_SIZE || '25', 10))
    return res.status(200).json({ success: true, processed: results.length, results })
  } catch (error) {
    console.error('Lead outbox worker failed:', error && error.message ? error.message : 'Unknown error')
    return res.status(503).json({ success: false, error: 'Worker temporarily unavailable' })
  }
}
