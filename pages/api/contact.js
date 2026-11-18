import { randomUUID } from 'crypto'
import { saveLead } from '../../lib/db'
import { processLead } from '../../lib/lead-outbox'

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } }
}

const MAX_FIELD_LENGTH = 5000
const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function clean(value, max = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  if (clean(body.website, 200)) return res.status(200).json({ success: true, message: 'Lead received' })

  const firstName = clean(body.firstName || body.name, 80)
  const lastName = clean(body.lastName, 80)
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const phone = clean(body.phone, 30)
  const email = clean(body.email, 254)
  const project = clean(body.project, 150)
  const details = clean(body.details)
  const customerType = clean(body.customerType, 30) || 'residential'
  const phoneDigits = phone.replace(/\\D/g, '')

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

  const payload = {
    customerType,
    name,
    firstName,
    lastName,
    phone,
    email,
    company: clean(body.company, 200),
    role: clean(body.role, 100),
    project,
    projectName: clean(body.projectName, 200),
    address: clean(body.address, 250),
    city: clean(body.city, 100),
    state: clean(body.state, 50),
    zipCode: clean(body.zipCode, 15),
    details,
    preferredContact: clean(body.preferredContact, 50),
    bidDeadline: clean(body.bidDeadline, 80),
    projectStart: clean(body.projectStart, 80),
    serviceVoltage: clean(body.serviceVoltage, 50),
    servicePhase: clean(body.servicePhase, 50),
    serviceAmperage: clean(body.serviceAmperage, 50),
    fileLinks: clean(body.fileLinks, 1000),
    pageUrl: clean(body.pageUrl, 500),
    referrer: clean(body.referrer, 500),
    utm_source: clean(body.utm_source, 150),
    utm_medium: clean(body.utm_medium, 150),
    utm_campaign: clean(body.utm_campaign, 150),
    utm_term: clean(body.utm_term, 150),
    utm_content: clean(body.utm_content, 150),
    gclid: clean(body.gclid, 250),
    contactConsent: 'yes',
    consentCapturedAt: new Date().toISOString(),
  }

  const suppliedKey = req.headers['idempotency-key']
  const idempotencyKey = typeof suppliedKey === 'string' && uuidPattern.test(suppliedKey) ? suppliedKey : randomUUID()

  try {
    const saved = await saveLead({
      idempotencyKey,
      customerType,
      name,
      phone,
      email,
      project,
      address: payload.address,
      zipCode: payload.zipCode,
      pageUrl: payload.pageUrl,
      payload,
    })

    let delivery = { espocrm: 'pending', email: 'pending' }
    try {
      delivery = await processLead(saved.id)
    } catch (error) {
      console.error('Lead delivery processing deferred:', error && error.message ? error.message : 'Unknown error')
    }

    return res.status(200).json({
      success: true,
      message: 'Lead safely recorded',
      leadId: saved.id,
      duplicate: saved.duplicate,
      delivery,
    })
  } catch (error) {
    console.error('Lead persistence failed:', error && error.message ? error.message : 'Unknown error')
    return res.status(503).json({
      success: false,
      error: 'We could not safely record your request. Please call (818) 302-5614.',
    })
  }
}
