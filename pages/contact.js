import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const form = event.target
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please call (818) 302-5614.')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Contact Amy Electric | Los Angeles Electrician</title>
        <meta name="description" content="Contact Amy Electric for electrical service, EV charger installation, panel upgrades, repairs and commercial electrical projects in Los Angeles." />
        <link rel="canonical" href="https://www.amyelectric.com/contact" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Electrician",
          "name": "AMY Electric",
          "telephone": "+18183025614",
          "email": "info@amyelectric.com",
          "url": "https://www.amyelectric.com/contact",
          "address": { "@type": "PostalAddress", "streetAddress": "20628 Londelius St", "addressLocality": "Winnetka", "addressRegion": "CA", "postalCode": "91306" },
          "sameAs": ["https://g.page/r/CVdK9ZAvNBrZEAI", "https://www.yelp.com/biz/amy-electric-winnetka"]
        }) }} />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • C-10 #981578</p>
          <h1>Request an Electrical Estimate</h1>
          <p className="lead">Tell us about your project. For urgent questions, call (818) 302-5614.</p>
          {submitted ? (
            <div className="estimate-box"><strong>Request received.</strong><p>We will follow up within 24 hours. For the fastest response, call (818) 302-5614.</p></div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>Name<input name="name" required /></label>
              <label>Phone<input name="phone" type="tel" required /></label>
              <label>Email<input name="email" type="email" /></label>
              <label>Project Type<select name="project"><option>EV Charger</option><option>Panel Upgrade</option><option>Electrical Repair</option><option>Lighting</option><option>Commercial Electrical</option><option>Other</option></select></label>
              <label>Project Details<textarea name="details" rows="6" required /></label>
              <button className="button primary" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Request Estimate'}
              </button>
              {error && <p style={{color:'red',marginTop:'8px'}}>{error}</p>}
            </form>
          )}
        </div>
      </main>
    </>
  )
}
