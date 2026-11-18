import { timingSafeEqual } from 'crypto'
import { getRuntimeEnv, postToLocalLeadApi } from '../../../lib/cloudflare-lead-service'

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

  const env = getRuntimeEnv()
  if (!isAuthorized(req.headers.authorization, env.LEAD_WORKER_TOKEN)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const response = await postToLocalLeadApi('/api/process-pending', {})
    const result = await response.json().catch(() => ({}))
    return res.status(response.ok ? 200 : 503).json(result)
  } catch (error) {
    console.error('Local lead worker unavailable:', error?.message || 'Unknown error')
    return res.status(503).json({ success: false, error: 'Lead service temporarily unavailable' })
  }
}
