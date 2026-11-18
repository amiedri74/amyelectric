import Head from 'next/head'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'

const services = [
  ['EV Charger Installation', 'ev-charger-installation', 'Level 2 EV charging installations for Tesla, Rivian, Ford and other EVs.'],
  ['Tesla Wall Connector', 'tesla-wall-connector', 'Professional Tesla Wall Connector installation for homes and garages.'],
  ['Electrical Panel Upgrades', 'panel-upgrades', 'Panel upgrades for EV charging, remodels, appliances and increased electrical capacity.'],
  ['Electrical Repair', 'electrical-repair', 'Troubleshooting and repair for breakers, outlets, wiring and electrical faults.'],
  ['Recessed Lighting', 'recessed-lighting', 'LED recessed lighting installation for kitchens, living rooms and remodels.'],
  ['Commercial Electrical', 'commercial-electrical', 'Electrical installation, repairs and upgrades for commercial properties.'],
  ['New Construction Wiring', 'new-construction-wiring', 'Complete electrical wiring for new construction, additions and remodels.'],
  ['Whole-Home Rewiring', 'whole-home-rewiring', 'Electrical rewiring for older homes and major renovations.'],
  ['Dedicated Circuits', 'dedicated-circuits', 'Dedicated circuits for EV chargers, appliances, HVAC and other high-load equipment.']
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Amy Electric | Los Angeles Electrician & EV Charger Installation</title>
        <meta name="description" content="Amy Electric provides residential and commercial electrical services in Greater Los Angeles, including EV charger installation, panel upgrades, repairs and commercial electrical projects." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.amyelectric.com/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Electrician",
          "name": "AMY Electric",
          "telephone": "+18183025614",
          "email": "info@amyelectric.com",
          "url": "https://www.amyelectric.com/",
          "areaServed": { "@type": "AdministrativeArea", "name": "Greater Los Angeles, California" },
          "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Electrical Services", "itemListElement": services.map(([name]) => ({ "@type": "Offer", "itemOffered": { "@type": "Service", "name } })) },
          "sameAs": ["https://g.page/r/CVdK9ZAvNBrZEAI", "https://www.yelp.com/biz/amy-electric-winnetka"]
        }) }} />
      </Head>
      <main>
        <header className="hero">
          <div className="container">
            <p className="eyebrow">Residential & Commercial Electrical Contractor • EV Charging</p>
            <h1>Professional Electrical Services Across Greater Los Angeles</h1>
            <p className="lead">Electrical installations, service upgrades, repairs and EV charging projects for homes and businesses.</p>
            <p className="credentials">Call (818) 302-5614 for project evaluation.</p>
            <div className="actions">
              <a className="button primary" href="tel:18183025614" onClick={() => trackEvent('phone_click', { placement: 'homepage_hero' })}>Call Now</a>
              <Link className="button secondary" href="/contact">Residential Estimate</Link>
              <Link className="button secondary" href="/commercial-bid">Commercial Bid Request</Link>
            </div>
          </div>
        </header>
        <section className="section" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Electrical Services</p>
              <h2>Residential and Commercial Electrical Services</h2>
              <p>Professional electrical work for homes, businesses, remodels and EV charging projects.</p>
            </div>
            <div className="grid">
              {services.map(([name, slug, description]) => (
                <article className="card" key={slug}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <Link href={`/services/${slug}`}>Learn More →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container grid">
            <article className="card">
              <h2>Residential Projects</h2>
              <p>EV chargers, panel upgrades, dedicated circuits, troubleshooting and home electrical improvements.</p>
              <Link href="/contact">Request a Residential Estimate →</Link>
            </article>
            <article className="card">
              <h2>Commercial Projects</h2>
              <p>Tenant improvements, service upgrades, distribution, lighting, maintenance and EV fleet charging.</p>
              <Link href="/commercial-bid">Submit a Commercial Bid Request →</Link>
            </article>
            <article className="card">
              <h2>EV Charger Estimate</h2>
              <p>Explore the factors that affect EV charger installation cost. Final pricing requires site verification.</p>
              <Link href="/estimate">Open EV Estimate Calculator →</Link>
            </article>
          </div>
        </section>
        <section className="cta">
          <div className="container">
            <h2>Need an Electrician in Greater Los Angeles?</h2>
            <p>Call Amy Electric or submit your project details for review.</p>
            <div className="actions" style={{justifyContent:'center'}}>
              <a className="button primary" href="tel:18183025614" onClick={() => trackEvent('phone_click', { placement: 'homepage_footer' })}>(818) 302-5614</a>
              <Link className="button secondary" href="/contact">Request Estimate</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
