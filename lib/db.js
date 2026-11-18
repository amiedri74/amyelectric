import { Pool } from 'pg'

let pool

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured')
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
      max: Number.parseInt(process.env.DATABASE_POOL_MAX || '5', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }
  return pool
}

export async function saveLead(input) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const inserted = await client.query(
      'INSERT INTO website_leads (idempotency_key, customer_type, full_name, phone, email, project_type, project_address, zip_code, source_page, payload) VALUES ($1,$2,$3,$4,NULLIF($5,\'\'),$6,NULLIF($7,\'\'),NULLIF($8,\'\'),NULLIF($9,\'\'),$10::jsonb) ON CONFLICT (idempotency_key) DO NOTHING RETURNING id',
      [input.idempotencyKey, input.customerType, input.name, input.phone, input.email, input.project, input.address, input.zipCode, input.pageUrl, JSON.stringify(input.payload)]
    )
    let leadId = inserted.rows[0]?.id
    const duplicate = !leadId
    if (duplicate) {
      const existing = await client.query('SELECT id FROM website_leads WHERE idempotency_key = $1', [input.idempotencyKey])
      leadId = existing.rows[0]?.id
      if (!leadId) throw new Error('Unable to resolve idempotent lead record')
    } else {
      await client.query("INSERT INTO lead_outbox (lead_id, channel) VALUES ($1, 'espocrm'), ($1, 'email') ON CONFLICT (lead_id, channel) DO NOTHING", [leadId])
    }
    await client.query('COMMIT')
    return { id: leadId, duplicate }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getLead(leadId) {
  const result = await getPool().query('SELECT * FROM website_leads WHERE id = $1', [leadId])
  return result.rows[0] || null
}

export async function updateDelivery(leadId, channel, status, errorMessage = null, externalId = null) {
  const column = channel === 'espocrm' ? 'espocrm_status' : 'email_status'
  await getPool().query(
    'UPDATE website_leads SET ' + column + ' = $2, last_error = $3, espocrm_record_id = COALESCE($4, espocrm_record_id), updated_at = NOW() WHERE id = $1',
    [leadId, status, errorMessage ? String(errorMessage).slice(0, 1000) : null, externalId]
  )
  await getPool().query(
    "UPDATE lead_outbox SET status = $3, attempts = attempts + 1, last_error = $4, locked_at = NULL, updated_at = NOW(), available_at = CASE WHEN $3 = 'failed' THEN NOW() + LEAST(INTERVAL '6 hours', INTERVAL '1 minute' * POWER(2, LEAST(attempts, 8))) ELSE available_at END WHERE lead_id = $1 AND channel = $2",
    [leadId, channel, status, errorMessage ? String(errorMessage).slice(0, 1000) : null]
  )
}
