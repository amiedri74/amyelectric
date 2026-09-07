import Head from 'next/head'
import Link from 'next/link'

const serviceData = {
  'ev-charger-installation': {
    title: 'EV Charger Installation in Los Angeles',
    description: 'Professional Level 2 EV charger installation for homes and businesses in Los Angeles.',
    body: 'Amy Electric evaluates the existing electrical service, panel capacity, circuit requirements, equipment location, conductor routing and installation conditions for EV charging projects. The correct installation depends on the vehicle, charger, available electrical capacity and site conditions.'
  },
  'tesla-wall-connector': {
    title: 'Tesla Wall Connector Installation in Los Angeles',
    description: 'Professional Tesla Wall Connector installation for residential and commercial properties.',
    body: 'Amy Electric installs Tesla Wall Connectors with attention to circuit sizing, conductor routing, equipment placement and applicable electrical requirements. Existing service capacity should be evaluated before installation.'
  },
  'panel-upgrades': {
    title: 'Electrical Panel Upgrades in Los Angeles',
    description: 'Electrical panel upgrades for increased capacity, safety and modern electrical loads.',
    body: 'Panel upgrade projects can support EV charging, HVAC, kitchen appliances, additions and other increased electrical demand. Amy Electric evaluates the existing service and project load before recommending an upgrade.'
  },
  'electrical-repair': {
    title: 'Electrical Repair in Los Angeles',
    description: 'Professional electrical repair for residential and commercial electrical problems.',
    body: 'Electrical repairs should begin with proper troubleshooting. Amy Electric diagnoses common issues involving breakers, outlets, switches, wiring and other electrical equipment and recommends the appropriate repair.'
  },
  'recessed-lighting': {
    title: 'Recessed Lighting Installation in Los Angeles',
    description: 'LED recessed lighting installation for kitchens, living spaces, offices and remodels.',
    body: 'Amy Electric provides recessed lighting installation for remodels and new projects, including fixture layout, wiring, switching and installation according to the project requirements.'
  },
  'commercial-electrical': {
    title: 'Commercial Electrician in Los Angeles',
    description: 'Electrical installation, maintenance, repairs and upgrades for commercial properties.',
    body: 'Commercial electrical projects can include lighting, circuits, equipment connections, repairs, tenant improvements and electrical upgrades. Project scope and requirements are evaluated before work begins.'
  },
  'new-construction-wiring': {
    title: 'New Construction Electrical Wiring in Los Angeles',
    description: 'Electrical wiring for new construction, additions and major remodels.',
    body: 'Amy Electric provides electrical installation for new construction and remodeling projects, coordinating circuits, equipment, lighting, outlets and electrical service requirements with the project scope.'
  },
  'whole-home-rewiring': {
    title: 'Whole-Home Rewiring in Los Angeles',
    description: 'Electrical rewiring services for older homes and major renovations.',
    body: 'Older electrical systems may require evaluation and selective or complete rewiring depending on condition, capacity and renovation requirements. Amy Electric can assess the existing system and define the appropriate scope.'
  },
  'dedicated-circuits': {
    title: 'Dedicated Circuit Installation in Los Angeles',
    description: 'Dedicated circuits for EV chargers, appliances, HVAC and other electrical equipment.',
    body: 'Dedicated circuits provide a properly designed electrical supply for equipment that requires its own circuit. Amy Electric evaluates equipment requirements, circuit routing, panel capacity and installation conditions.'
  }
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(serviceData).map((slug) => ({ params: { slug } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  return { props: { service: serviceData[params.slug] } }
}

export default function ServicePage({ service }) {
  return (
    <>
      <Head>
        <title>{service.title} | Amy Electric</title>
        <meta name="description" content={service.description} />
        <link href={`https://www.amyelectric.com/services/${encodeURIComponent(service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}`} rel="canonical" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • Los Angeles</p>
          <h1>{service.title}</h1>
          <p className="lead">{service.description}</p>
          <p>{service.body}</p>
          <div className="actions">
            <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
            <Link className="button secondary" href="/services">All Services</Link>
          </div>
        </div>
      </main>
    </>
  )
}
