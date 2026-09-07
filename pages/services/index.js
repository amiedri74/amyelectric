import Head from 'next/head'
import Link from 'next/link'

const services = [
  ['EV Charger Installation', 'ev-charger-installation'],
  ['Tesla Wall Connector', 'tesla-wall-connector'],
  ['Electrical Panel Upgrades', 'panel-upgrades'],
  ['Electrical Repair', 'electrical-repair'],
  ['Recessed Lighting', 'recessed-lighting'],
  ['Commercial Electrical', 'commercial-electrical'],
  ['New Construction Wiring', 'new-construction-wiring'],
  ['Whole-Home Rewiring', 'whole-home-rewiring'],
  ['Dedicated Circuits', 'dedicated-circuits']
]

export default function Services() {
  return (
    <>
      <Head>
        <title>Electrical Services | Amy Electric Los Angeles</title>
        <meta name="description" content="Browse Amy Electric's electrical services in Los Angeles, including EV charger installation, Tesla Wall Connector installation, panel upgrades, repairs, lighting, rewiring and commercial electrical work." />
        <link rel="canonical" href="https://www.amyelectric.com/services" />
      </Head>
      <main className="page">
        <div className="container">
          <p className="eyebrow">Amy Electric</p>
          <h1>Electrical Services in Los Angeles</h1>
          <p className="lead">Licensed C10 electrical contracting for residential, commercial and EV charging projects.</p>
          <div className="grid">
            {services.map(([name, slug]) => (
              <Link className="card" key={slug} href={`/services/${slug}`}>
                <h2>{name}</h2>
                <span>View service →</span>
              </Link>
            ))}
          </div>
          <p className="contact-line"><a href="tel:18183025614">Call (818) 302-5614</a></p>
        </div>
      </main>
    </>
  )
}
