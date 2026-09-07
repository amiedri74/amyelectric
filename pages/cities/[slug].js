import Head from 'next/head'
import Link from 'next/link'

const cityData = {
  'los-angeles-electrician': 'Los Angeles',
  'beverly-hills-electrician': 'Beverly Hills',
  'calabasas-electrician': 'Calabasas',
  'encino-electrician': 'Encino',
  'sherman-oaks-electrician': 'Sherman Oaks',
  'studio-city-electrician': 'Studio City',
  'woodland-hills-electrician': 'Woodland Hills',
  'burbank-electrician': 'Burbank',
  'glendale-electrician': 'Glendale',
  'pasadena-electrician': 'Pasadena',
  'north-hollywood-electrician': 'North Hollywood',
  'west-los-angeles-electrician': 'West Los Angeles',
  'santa-monica-electrician': 'Santa Monica'
}

const services = [
  ['EV Charger Installation', 'ev-charger-installation'],
  ['Panel Upgrades', 'panel-upgrades'],
  ['Electrical Repair', 'electrical-repair'],
  ['Commercial Electrical', 'commercial-electrical'],
  ['Recessed Lighting', 'recessed-lighting']
]

export async function getStaticPaths() {
  return {
    paths: Object.keys(cityData).map((slug) => ({ params: { slug } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  return { props: { city: cityData[params.slug], slug: params.slug } }
}

export default function CityPage({ city, slug }) {
  const canonical = `https://www.amyelectric.com/cities/${slug}`

  return (
    <>
      <Head>
        <title>{city} Electrician | Amy Electric</title>
        <meta name="description" content={`Amy Electric provides electrical repair, EV charger installation, panel upgrades, lighting and commercial electrical services in ${city}, California.`} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Electrician',
          name: 'Amy Electric',
          telephone: '+1-818-302-5614',
          areaServed: city,
          url: canonical
        }) }} />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • C10 #9871578</p>
          <h1>{city} Electrician</h1>
          <p className="lead">Professional residential and commercial electrical services in {city}, California.</p>
          <p>Amy Electric provides electrical installation, upgrades, repairs and EV charging services for homeowners, businesses and remodeling projects in {city}. Project requirements vary by property, equipment and existing electrical capacity, so each job should be evaluated before work begins.</p>
          <h2>Electrical Services in {city}</h2>
          <div className="grid">
            {services.map(([name, serviceSlug]) => (
              <Link className="card" key={serviceSlug} href={`/services/${serviceSlug}`}>
                <h3>{name}</h3>
                <span>View service →</span>
              </Link>
            ))}
          </div>
          <div className="actions">
            <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
            <Link className="button secondary" href="/cities">All Service Areas</Link>
          </div>
        </div>
      </main>
    </>
  )
}
