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
          "@context": "https://schema.org",
          "@type": "Electrician",
          "name": "AMY Electric",
          "image": "https://www.amyelectric.com/img/og-home.jpg",
          "logo": "https://www.amyelectric.com/img/og-home.jpg",
          "description": "Licensed C-10 electrical contractor in Los Angeles. EVITP-certified EV charger installation, panel upgrades, rewiring, and electrical repairs.",
          "telephone": "+18183025614",
          "email": "info@amyelectric.com",
          "url": canonical,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "20628 Londelius St",
            "addressLocality": "Winnetka",
            "addressRegion": "CA",
            "postalCode": "91306",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 34.190,
            "longitude": -118.587
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "07:00",
              "closes": "17:00"
            }
          ],
          "areaServed": city,
          "serviceArea": [
            { "@type": "City", "name": "Los Angeles" },
            { "@type": "City", "name": "Burbank" },
            { "@type": "City", "name": "Glendale" },
            { "@type": "City", "name": "Pasadena" },
            { "@type": "City", "name": "Sherman Oaks" },
            { "@type": "City", "name": "Studio City" },
            { "@type": "City", "name": "North Hollywood" },
            { "@type": "City", "name": "Van Nuys" },
            { "@type": "City", "name": "Encino" },
            { "@type": "City", "name": "Woodland Hills" },
            { "@type": "City", "name": "Calabasas" },
            { "@type": "City", "name": "Culver City" },
            { "@type": "City", "name": "Beverly Hills" },
            { "@type": "City", "name": "Santa Monica" },
            { "@type": "City", "name": "West LA" },
            { "@type": "City", "name": "Winnetka" }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "87",
            "bestRating": "5",
            "worstRating": "1"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Electrical Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "EV Charger Installation" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Panel Upgrade" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Repair" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Whole-Home Rewiring" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Surge Protection" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Generator Transfer Switch" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lighting Installation" } }
            ]
          },
          "sameAs": [
            "https://g.page/r/CVdK9ZAvNBrZEAI",
            "https://www.yelp.com/biz/amy-electric-winnetka",
            "https://www.mapquest.com/us/california/amy-electric-365549572",
            "https://www.buildzoom.com/contractor/a-m-y-electric",
            "https://www.facebook.com/808165319279113"
          ],
          "priceRange": "$$",
          "containsInPlace": { "@type": "Place", "name": "Greater Los Angeles" }
        }) }} />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • C-10 #981578</p>
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
