import Head from 'next/head'
import Link from 'next/link'

const cities = [
  ['Los Angeles', 'los-angeles-electrician'],
  ['Beverly Hills', 'beverly-hills-electrician'],
  ['Calabasas', 'calabasas-electrician'],
  ['Encino', 'encino-electrician'],
  ['Sherman Oaks', 'sherman-oaks-electrician'],
  ['Studio City', 'studio-city-electrician'],
  ['Woodland Hills', 'woodland-hills-electrician'],
  ['Burbank', 'burbank-electrician'],
  ['Glendale', 'glendale-electrician'],
  ['Pasadena', 'pasadena-electrician'],
  ['North Hollywood', 'north-hollywood-electrician'],
  ['West Los Angeles', 'west-los-angeles-electrician'],
  ['Santa Monica', 'santa-monica-electrician']
]

export default function Cities() {
  return (
    <>
      <Head>
        <title>Service Areas | Amy Electric Los Angeles</title>
        <meta name="description" content="Amy Electric provides licensed electrical services and EV charger installation throughout Los Angeles and surrounding communities." />
        <link rel="canonical" href="https://www.amyelectric.com/cities" />
      </Head>
      <main className="page">
        <div className="container">
          <p className="eyebrow">Amy Electric</p>
          <h1>Los Angeles Electrical Service Areas</h1>
          <p className="lead">Licensed C-10 electrical contractor serving Los Angeles and surrounding communities.</p>
          <div className="grid">
            {cities.map(([city, slug]) => (
              <Link className="card" key={slug} href={`/cities/${slug}`}>
                <h2>{city} Electrician</h2>
                <span>View local services →</span>
              </Link>
            ))}
          </div>
          <p className="contact-line"><a href="tel:18183025614">Call (818) 302-5614</a></p>
        </div>
      </main>
    </>
  )
}
