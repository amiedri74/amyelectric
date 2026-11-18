function toEspoLead(payload) {
  const parts = String(payload.name || '').trim().split(/\s+/).filter(Boolean)
  const firstName = parts.shift() || 'Website'
  const lastName = parts.join(' ') || 'Lead'
  const description = [
    'Amy Electric website lead',
    'Customer type: ' + (payload.customerType === 'commercial' ? 'Commercial' : 'Residential'),
    'Project type: ' + (payload.project || 'Not provided'),
    'Project details:',
    payload.details || 'Not provided',
    'Preferred contact: ' + (payload.preferredContact || 'Not specified'),
    'Source page: ' + (payload.pageUrl || 'Not provided'),
    'UTM source: ' + (payload.utm_source || 'Not provided'),
    'UTM medium: ' + (payload.utm_medium || 'Not provided'),
    'UTM campaign: ' + (payload.utm_campaign || 'Not provided'),
    'Contact consent: yes',
  ].join('\n')
  const fields = {
    firstName,
    lastName,
    accountName: payload.company || undefined,
    emailAddress: payload.email || undefined,
    phoneNumber: payload.phone || undefined,
    addressStreet: payload.address || undefined,
    addressCity: payload.city || undefined,
    addressState: payload.state || 'CA',
    addressPostalCode: payload.zipCode || undefined,
    description,
    status: 'New',
  }
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined && value !== ''))
}

export async function createEspoLead(payload) {
  const baseUrl = process.env.ESPOCRM_URL
  const apiKey = process.env.ESPOCRM_API_KEY
  const accessClientId = process.env.CF_ACCESS_CLIENT_ID
  const accessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET
  if (!baseUrl || !apiKey) throw new Error('EspoCRM integration is not configured')
  const response = await fetch(baseUrl.replace(/\/$/, '') + '/api/v1/Lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      ...(accessClientId && accessClientSecret ? {
        'CF-Access-Client-Id': accessClientId,
        'CF-Access-Client-Secret': accessClientSecret,
      } : {}),
    },
    body: JSON.stringify(toEspoLead(payload)),
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error('EspoCRM API returned ' + response.status + ': ' + body.slice(0, 300))
  }
  const record = await response.json()
  if (!record.id) throw new Error('EspoCRM did not return a Lead record ID')
  return record.id
}
