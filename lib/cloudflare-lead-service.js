import { getCloudflareContext } from '@opennextjs/cloudflare'

export function getRuntimeEnv() {
  try {
    return getCloudflareContext().env || process.env
  } catch {
    return process.env
  }
}

export async function postToLocalLeadApi(path, payload) {
  const env = getRuntimeEnv()
  const baseUrl = env.LEAD_INGEST_URL
  if (!baseUrl || !env.LEAD_INGEST_TOKEN || !env.CF_ACCESS_CLIENT_ID || !env.CF_ACCESS_CLIENT_SECRET) {
    throw new Error('Local lead API integration is not configured')
  }

  return fetch(baseUrl.replace(/\/$/, '') + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + env.LEAD_INGEST_TOKEN,
      'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID,
      'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  })
}
