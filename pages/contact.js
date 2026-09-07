import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function submit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Contact Amy Electric | Los Angeles Electrician</title>
        <meta name="description" content="Contact Amy Electric for electrical service, EV charger installation, panel upgrades, repairs and commercial electrical projects in Los Angeles." />
        <link rel="canonical" href="https://www.amyelectric.com/contact" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • C10 #9871578</p>
          <h1>Request an Electrical Estimate</h1>
          <p className="lead">Tell us about your project. For urgent questions, call (818) 302-5614.</p>
          {submitted ? (
            <div className="estimate-box"><strong>Request received.</strong><p>For the fastest response, call (818) 302-5614.</p></div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>Name<input name="name" required /></label>
              <label>Phone<input name="phone" type="tel" required /></label>
              <label>Email<input name="email" type="email" /></label>
              <label>Project Type<select name="project"><option>EV Charger</option><option>Panel Upgrade</option><option>Electrical Repair</option><option>Lighting</option><option>Commercial Electrical</option><option>Other</option></select></label>
              <label>Project Details<textarea name="details" rows="6" required /></label>
              <button className="button primary" type="submit">Request Estimate</button>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
