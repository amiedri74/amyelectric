const serviceSlugs = [
  'ev-charger-installation',
  'tesla-wall-connector',
  'panel-upgrades',
  'electrical-repair',
  'recessed-lighting',
  'commercial-electrical',
  'new-construction-wiring',
  'whole-home-rewiring',
  'dedicated-circuits'
]

const citySlugs = [
  'los-angeles-electrician', 'beverly-hills-electrician', 'calabasas-electrician',
  'encino-electrician', 'sherman-oaks-electrician', 'studio-city-electrician',
  'woodland-hills-electrician', 'burbank-electrician', 'glendale-electrician',
  'pasadena-electrician', 'north-hollywood-electrician', 'west-los-angeles-electrician',
  'santa-monica-electrician'
]

export async function getServerSideProps({ res }) {
  const base = 'https://www.amyelectric.com'
  const urls = [
    '/', '/services', '/cities', '/estimate', '/contact',
    '/ev-charger-cost-los-angeles',
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...citySlugs.map((slug) => `/cities/${slug}`)
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${base}${url}</loc></url>`).join('')}</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.write(body)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
