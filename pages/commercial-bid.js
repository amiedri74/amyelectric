import Head from 'next/head'
import { useState } from 'react'
import { trackEvent } from '../lib/analytics'

export default function CommercialBid() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    values.customerType = 'commercial'
    values.project = values.projectType
    values.details = [
      'Scope: ' + (values.scope || 'Not provided'),
      'Building type: ' + (values.buildingType || 'Not provided'),
      'Project stage: ' + (values.projectStage || 'Not provided'),
      'Bid deadline: ' + (values.bidDeadline || 'Not provided'),
      'Expected start: ' + (values.projectStart || 'Not provided'),
      'Service: ' + [values.serviceVoltage, values.servicePhase, values.serviceAmperage].filter(Boolean).join(' / '),
      'Site visit requested: ' + (values.siteVisit || 'Not specified'),
      'Additional notes: ' + (values.notes || 'None')
    ].join('\n')
    values.pageUrl = window.location.href
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to submit your bid request.')
      trackEvent('generate_lead', { lead_type: 'commercial', project_type: values.projectType })
      setSubmitted(true)
      form.reset()
    } catch (err) {
      setError(err.message || 'Network error. Please call (818) 302-5614.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Commercial Electrical Bid Request | Amy Electric</title>
        <meta name="description" content="Submit a commercial electrical project or bid request to Amy Electric. Provide project scope, service information, schedule and bid deadline." />
        <link rel="canonical" href="https://www.amyelectric.com/commercial-bid" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">General contractors • Property managers • Commercial owners</p>
          <h1>Commercial Electrical Bid Request</h1>
          <p className="lead">Send project information so our team can review the electrical scope and bid requirements. For urgent questions, call <a href="tel:18183025614">(818) 302-5614</a>.</p>
          {submitted ? (
            <div className="estimate-box" role="status"><strong>Bid request received.</strong><p>Thank you. Our team will review the project details and follow up.</p></div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <h2>Company and Contact</h2>
              <div className="form-grid">
                <label>Company name<input name="company" required maxLength="200" /></label>
                <label>Contact name<input name="firstName" required maxLength="120" /></label>
                <label>Phone<input name="phone" type="tel" required maxLength="30" /></label>
                <label>Email<input name="email" type="email" required maxLength="254" /></label>
                <label>Role<select name="role" defaultValue="General Contractor"><option>General Contractor</option><option>Property Manager</option><option>Owner / Developer</option><option>Architect / Engineer</option><option>Other</option></select></label>
                <label>Project name<input name="projectName" required maxLength="200" /></label>
              </div>
              <h2>Project Location and Scope</h2>
              <div className="form-grid">
                <label className="full-width">Project address<input name="address" required maxLength="250" /></label>
                <label>City<input name="city" required maxLength="100" /></label>
                <label>ZIP code<input name="zipCode" inputMode="numeric" pattern="[0-9]{5}" required /></label>
                <label>Building type<select name="buildingType" defaultValue="Commercial"><option>Commercial</option><option>Office</option><option>Retail</option><option>Industrial</option><option>Multi-family</option><option>Hospitality</option><option>Other</option></select></label>
                <label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select project type</option><option>Tenant Improvement</option><option>New Construction</option><option>Service Upgrade</option><option>Panel / Switchgear</option><option>Lighting</option><option>EV Fleet Charging</option><option>Electrical Maintenance</option><option>Other Commercial</option></select></label>
                <label>Service voltage<input name="serviceVoltage" placeholder="e.g. 120/208V or 277/480V" maxLength="50" /></label>
                <label>Phase<select name="servicePhase" defaultValue=""><option value="">Unknown</option><option>Single-phase</option><option>Three-phase</option></select></label>
                <label>Service amperage<input name="serviceAmperage" placeholder="e.g. 400A" maxLength="50" /></label>
                <label>Bid deadline<input name="bidDeadline" type="date" /></label>
                <label>Expected project start<input name="projectStart" type="date" /></label>
                <label>Site visit<select name="siteVisit" defaultValue="Requested"><option>Requested</option><option>Not required yet</option><option>To be determined</option></select></label>
                <label className="full-width">Electrical scope<textarea name="scope" rows="5" required maxLength="5000" placeholder="Describe electrical work, equipment, quantities and project requirements." /></label>
                <label className="full-width">Additional notes<textarea name="notes" rows="3" maxLength="3000" /></label>
                <label className="full-width consent"><input type="checkbox" name="contactConsent" value="yes" required /> I agree that Amy Electric may contact me about this project.</label>
              </div>
              <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
              <button className="button primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Commercial Bid Request'}</button>
              {error && <p role="alert" className="form-error">{error}</p>}
              <p className="form-note">Do not upload confidential or restricted project documents through this initial form. A secure document exchange process can be arranged for qualified bid packages.</p>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
