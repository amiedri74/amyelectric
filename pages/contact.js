import Head from 'next/head'
import { useState } from 'react'
import { trackEvent } from '../lib/analytics'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    values.customerType = 'residential'
    values.pageUrl = window.location.href
    values.referrer = document.referrer
    const query = new URLSearchParams(window.location.search)
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']) {
      if (query.has(key)) values[key] = query.get(key)
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to submit your request.')
      trackEvent('generate_lead', { lead_type: 'residential', project_type: values.project })
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
        <title>Request an Electrical Estimate | Amy Electric</title>
        <meta name="description" content="Request a residential electrical estimate from Amy Electric. Tell us about your EV charger, panel upgrade, repair or electrical project in Greater Los Angeles." />
        <link rel="canonical" href="https://www.amyelectric.com/contact" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Residential electrical service</p>
          <h1>Request an Electrical Estimate</h1>
          <p className="lead">Describe your project and our team can follow up. For immediate assistance, call <a href="tel:18183025614">(818) 302-5614</a>.</p>
          {submitted ? (
            <div className="estimate-box" role="status">
              <strong>Request received.</strong>
              <p>Thank you. Our team will review your information. For urgent questions, call (818) 302-5614.</p>
              <a className="button primary" href="/">Return to Homepage</a>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="form-grid">
                <label>First name<input name="firstName" autoComplete="given-name" required maxLength="80" /></label>
                <label>Last name<input name="lastName" autoComplete="family-name" required maxLength="80" /></label>
                <label>Phone<input name="phone" type="tel" autoComplete="tel" required maxLength="30" /></label>
                <label>Email<input name="email" type="email" autoComplete="email" maxLength="254" /></label>
                <label>Project type
                  <select name="project" required defaultValue="">
                    <option value="" disabled>Select a project</option>
                    <option>EV Charger Installation</option>
                    <option>Electrical Panel Upgrade</option>
                    <option>Main Service Upgrade</option>
                    <option>Electrical Repair</option>
                    <option>Rewiring</option>
                    <option>Lighting</option>
                    <option>Dedicated Circuit</option>
                    <option>Other Residential Project</option>
                  </select>
                </label>
                <label>Project ZIP code<input name="zipCode" inputMode="numeric" pattern="[0-9]{5}" maxLength="5" required /></label>
                <label className="full-width">Property address<input name="address" autoComplete="street-address" maxLength="250" /></label>
                <label className="full-width">Project details<textarea name="details" rows="5" required maxLength="5000" placeholder="Describe the work, existing equipment, approximate distance, and timing." /></label>
                <label>Preferred contact
                  <select name="preferredContact" defaultValue="Phone">
                    <option>Phone</option><option>Email</option><option>Text message</option>
                  </select>
                </label>
                <label className="full-width consent"><input type="checkbox" name="contactConsent" value="yes" required /> I agree that Amy Electric may contact me about this project.</label>
              </div>
              <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
              <button className="button primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Request Estimate'}</button>
              {error && <p role="alert" className="form-error">{error}</p>}
              <p className="form-note">Submitting this form requests contact about your project; it is not an authorization to begin work or a final price quote.</p>
            </form>
          )}
          <p className="contact-line"><a href="/commercial-bid">Are you a general contractor or commercial customer? Submit a commercial bid request.</a></p>
        </div>
      </main>
    </>
  )
}
