import Head from 'next/head'
import Link from 'next/link'

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
        <meta name="description" content="Amy Electric is a Los Angeles electrical contractor specializing in EV charger installation, Tesla Wall Connectors, panel upgrades, electrical repairs, lighting and commercial electrical work." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.amyelectric.com/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Electrician',
          name: 'Amy Electric',
          url: 'https://www.amyelectric.com/',
          telephone: '+1-818-302-5614',
          areaServed: 'Los Angeles, California',
          serviceType: services.map(([name]) => name)
        }) }} />
      </Head>

      <main>
        <header className="hero">
          <div className="container">
            <p className="eyebrow">Licensed C10 Electrical Contractor • EVITP Certified</p>
            <h1>Los Angeles Electrician & EV Charger Installation</h1>
            <p className="lead">Residential and commercial electrical services throughout Los Angeles and surrounding communities.</p>
            <p className="credentials">C10 License #9871578 • EVITP #4051604</p>
            <div className="actions">
              <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
              <Link className="button secondary" href="/services">View Electrical Services</Link>
            </div>
          </div>
        </header>

        <section className="section" id="services">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Electrical Services</p>
              <h2>Complete Electrical Services in Los Angeles</h2>
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

        <section className="cta">
          <div className="container">
            <h2>Need an Electrician in Los Angeles?</h2>
            <p>Call Amy Electric for an estimate and professional electrical service.</p>
            <a className="button primary" href="tel:18183025614">(818) 302-5614</a>
          </div>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  return { props: {} }
}
