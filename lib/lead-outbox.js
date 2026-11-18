import nodemailer from 'nodemailer'
import { claimDelivery, getLead, getPool, updateDelivery } from './db'
import { createEspoLead } from './espocrm'

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

async function sendLeadEmail(lead) {
  const env = process.env
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.EMAIL_TO) throw new Error('SMTP delivery is not configured')
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number.parseInt(env.SMTP_PORT || '587', 10),
    secure: Number.parseInt(env.SMTP_PORT || '587', 10) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })
  const rows = Object.entries(lead.payload || {}).filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([label, value]) => '<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee">' + escapeHtml(label) +
      '</th><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">' + escapeHtml(String(value)) + '</td></tr>').join('')
  await transporter.sendMail({
    from: '"AMY Electric Website" <' + (env.EMAIL_FROM || env.SMTP_USER) + '>',
    to: env.EMAIL_TO,
    replyTo: lead.email || undefined,
    subject: 'New ' + (lead.customer_type === 'commercial' ? 'Commercial Bid' : 'Residential Lead') + ': ' + lead.project_type,
    html: '<h2>New AMY Electric Website Lead</h2><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">' + rows + '</table>',
    text: Object.entries(lead.payload || {}).map(([key, value]) => key + ': ' + String(value)).join('\n'),
  })
}

export async function processLead(leadId) {
  const lead = await getLead(leadId)
  if (!lead) throw new Error('Lead record not found')
  const results = {}
  if (lead.espocrm_status === 'pending' || lead.espocrm_status === 'failed') {
    const claimed = await claimDelivery(leadId, 'espocrm')
    if (claimed) {
      try {
        const recordId = await createEspoLead(lead.payload)
        await updateDelivery(leadId, 'espocrm', 'sent', null, recordId)
        results.espocrm = 'sent'
      } catch (error) {
        await updateDelivery(leadId, 'espocrm', 'failed', error.message)
        results.espocrm = 'pending'
      }
    } else results.espocrm = 'processing'
  } else results.espocrm = lead.espocrm_status
  if (lead.email_status === 'pending' || lead.email_status === 'failed') {
    const claimed = await claimDelivery(leadId, 'email')
    if (claimed) {
      try {
        await sendLeadEmail(lead)
        await updateDelivery(leadId, 'email', 'sent')
        results.email = 'sent'
      } catch (error) {
        await updateDelivery(leadId, 'email', 'failed', error.message)
        results.email = 'pending'
      }
    } else results.email = 'processing'
  } else results.email = lead.email_status
  return results
}

export async function processPendingLeads(limit = 25) {
  const result = await getPool().query(
    "SELECT DISTINCT lead_id FROM lead_outbox WHERE (status IN ('pending', 'failed') AND available_at <= NOW()) OR (status = 'processing' AND locked_at < NOW() - INTERVAL '10 minutes') ORDER BY lead_id LIMIT $1",
    [limit]
  )
  const processed = []
  for (const row of result.rows) {
    try {
      processed.push({ leadId: row.lead_id, ...(await processLead(row.lead_id)) })
    } catch (error) {
      processed.push({ leadId: row.lead_id, error: error.message })
    }
  }
  return processed
}
