import nodemailer from 'nodemailer'

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } }
}

const MAX_FIELD_LENGTH = 5000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value, max = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  // Honeypot: silently accept automated spam without sending it to the office.
  if (clean(body.website, 200)) return res.status(200).json({ success: true, message: 'Lead received' })

  const firstName = clean(body.firstName || body.name, 80)
  const lastName = clean(body.lastName, 80)
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const phone = clean(body.phone, 30)
  const email = clean(body.email, 254)
  const project = clean(body.project, 150)
  const details = clean(body.details)
  const customerType = clean(body.customerType, 30) || 'residential'
  const phoneDigits = phone.replace(/\D/g, '')

  if (name.length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({ success: false, error: 'Please provide a name and a valid phone number.' })
  }
  if (email && !emailPattern.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' })
  }
  if (body.contactConsent !== 'yes') {
    return res.status(400).json({ success: false, error: 'Please confirm that Amy Electric may contact you about this project.' })
  }
  if (!project || !details) {
    return res.status(400).json({ success: false, error: 'Please provide a project type and project details.' })
  }
  if (customerType !== 'residential' && customerType !== 'commercial') {
    return res.status(400).json({ success: false, error: 'Invalid customer type.' })
  }

  const fields = {
    'Customer type': customerType,
    'Name': name,
    'Phone': phone,
    'Email': email || 'Not provided',
    'Company': clean(body.company, 200),
    'Contact role': clean(body.role, 100),
    'Project type': project,
    'Project name': clean(body.projectName, 200),
    'Project address': clean(body.address, 250),
    'City': clean(body.city, 100),
    'State': clean(body.state, 50),
    'ZIP code': clean(body.zipCode, 15),
    'Project details': details,
    'Preferred contact': clean(body.preferredContact, 50),
    'Bid deadline': clean(body.bidDeadline, 80),
    'Project start': clean(body.projectStart, 80),
    'Service voltage': clean(body.serviceVoltage, 50),
    'Service phase': clean(body.servicePhase, 50),
    'Service amperage': clean(body.serviceAmperage, 50),
    'Plans/files': clean(body.fileLinks, 1000),
    'Landing page': clean(body.pageUrl, 500),
    'Referrer': clean(body.referrer, 500),
    'UTM source': clean(body.utm_source, 150),
    'UTM medium': clean(body.utm_medium, 150),
    'UTM campaign': clean(body.utm_campaign, 150),
    'Google click ID': clean(body.gclid, 250),
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_TO) {
    console.error('Lead delivery is not configured: required SMTP environment variables are missing.')
    return res.status(503).json({ success: false, error: 'The request service is temporarily unavailable. Please call (818) 302-5614.' })
  }

  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([label, value]) => '<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee">' + escapeHtml(label) + '</th><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap">' + escapeHtml(value) + '</td></tr>')
    .join('')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
    secure: Number.parseInt(process.env.SMTP_PORT || '587', 10) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: '"AMY Electric Website" <' + (process.env.EMAIL_FROM || process.env.SMTP_USER) + '>',
      to: process.env.EMAIL_TO,
      replyTo: email || undefined,
      subject: 'New ' + (customerType === 'commercial' ? 'Commercial Bid' : 'Residential Lead') + ': ' + project,
      html: '<h2>New AMY Electric Website Lead</h2><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">' + rows + '</table>',
      text: Object.entries(fields).filter(([, value]) => value).map(([label, value]) => label + ': ' + value).join('\n'),
    })
    return res.status(200).json({ success: true, message: 'Lead received' })
  } catch (error) {
    console.error('Lead email delivery failed:', error && error.message ? error.message : 'Unknown error')
    return res.status(502).json({ success: false, error: 'We could not deliver your request. Please call (818) 302-5614.' })
  }
}
