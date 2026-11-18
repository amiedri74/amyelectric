import Head from 'next/head'
import { useMemo, useState } from 'react'
import { trackEvent } from '../lib/analytics'

export default function Estimate() {
  const [charger, setCharger] = useState('Level 2')
  const [distance, setDistance] = useState(50)
  const [panel, setPanel] = useState('200A')
  const [location, setLocation] = useState('Garage')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const estimate = useMemo(() => {
    let low = charger === 'Level 2' ? 900 : 700
    let high = charger === 'Level 2' ? 1800 : 1400
    if (distance > 50) { low += (distance - 50) * 8; high += (distance - 50) * 15 }
    if (panel === '100A') { low += 500; high += 1800 }
    if (panel === 'Unknown') { low += 250; high += 900 }
    if (location === 'Exterior') { low += 150; high += 400 }
    return { low: Math.round(low), high: Math.round(high) }
  }, [charger, distance, panel, location])

  async function submitLead(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    values.customerType = 'residential'
    values.project = 'EV Charger Installation'
    values.details = [
      'Calculator inputs:',
      'Charger: ' + charger,
      'Existing panel: ' + panel,
      'Approximate circuit route: ' + distance + ' ft',
      'Location: ' + location,
      'Preliminary displayed range: $' + estimate.low.toLocaleString() + '–$' + estimate.high.toLocaleString(),
      'Customer notes: ' + (values.details || 'Not provided'),
      'This range is preliminary and is not a final proposal.'
    ].join('\n')
    values.pageUrl = window.location.href
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to submit your request.')
      trackEvent('generate_lead', { lead_type: 'ev_estimate', project_type: 'EV Charger Installation' })
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
        <title>EV Charger Installation Estimate | Amy Electric Los Angeles</title>
        <meta name="description" content="Use Amy Electric's EV charger installation estimator to explore cost factors in Los Angeles. Final pricing requires electrical load and site evaluation." />
        <link rel="canonical" href="https://www.amyelectric.com/estimate" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">EVITP credential listed on company website</p>
          <h1>EV Charger Installation Estimate</h1>
          <p className="lead">Explore a preliminary installation range. This is not a final quote or electrical capacity approval; actual requirements depend on the property, service, load calculation and site conditions.</p>
          <div className="form-grid">
            <label>Charger Type<select value={charger} onChange={(e) => setCharger(e.target.value)}><option>Level 2</option><option>Standard EV Charger</option></select></label>
            <label>Existing Panel<select value={panel} onChange={(e) => setPanel(e.target.value)}><option>200A</option><option>100A</option><option>Unknown</option></select></label>
            <label>Approximate route: {distance} ft<input type="range" min="10" max="200" step="5" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /></label>
            <label>Installation Location<select value={location} onChange={(e) => setLocation(e.target.value)}><option>Garage</option><option>Exterior</option></select></label>
          </div>
          <div className="estimate-box" aria-live="polite">
            <p>Preliminary installation range</p>
            <strong>${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</strong>
          </div>
          <p className="disclaimer">This calculator is an indicative marketing tool, not a load calculation or binding estimate. Final pricing requires verification of the utility service, panel and breaker ratings, existing calculated load, charger specifications, conductor and raceway route, permits and site conditions.</p>
          <div className="actions">
            <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
            <button className="button secondary" type="button" onClick={() => { setShowLeadForm(true); trackEvent('quote_start', { quote_type: 'ev_charger' }) }}>Request a Project Evaluation</button>
          </div>
          {showLeadForm && !submitted && (
            <form className="contact-form" onSubmit={submitLead}>
              <h2>Send Your EV Project Details</h2>
              <div className="form-grid">
                <label>First name<input name="firstName" required maxLength="80" /></label>
                <label>Last name<input name="lastName" required maxLength="80" /></label>
                <label>Phone<input name="phone" type="tel" required maxLength="30" /></label>
                <label>Email<input name="email" type="email" maxLength="254" /></label>
                <label>ZIP code<input name="zipCode" inputMode="numeric" pattern="[0-9]{5}" required /></label>
                <label className="full-width">Project address<input name="address" maxLength="250" /></label>
                <label className="full-width">Additional details<textarea name="details" rows="3" maxLength="3000" /></label>
                <label className="full-width consent"><input type="checkbox" name="contactConsent" value="yes" required /> I agree that Amy Electric may contact me about this project.</label>
              </div>
              <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
              <button className="button primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit EV Evaluation Request'}</button>
              {error && <p role="alert" className="form-error">{error}</p>}
            </form>
          )}
          {submitted && <div className="estimate-box" role="status"><strong>Request received.</strong><p>Our team will review your EV project information. Call (818) 302-5614 if you need immediate assistance.</p></div>}
        </div>
      </main>
    </>
  )
}
