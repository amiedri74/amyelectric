import Head from 'next/head'
import Link from 'next/link'

const projects = [
  { title: 'Residential EV Charger Installation', location: 'Los Angeles, CA', desc: 'Level 2 charging station installed with 200A panel upgrade and dedicated circuit.', type: 'EV Charger' },
  { title: 'Whole-Home Rewiring', location: 'Beverly Hills, CA', desc: 'Complete rewire of 1980s-era electrical system including panels, outlets, and lighting.', type: 'Rewiring' },
  { title: 'Panel Upgrade to 400A', location: 'Sherman Oaks, CA', desc: 'Upgraded from 200A to 400A service panel to support AC, EV charger, and kitchen remodel.', type: 'Panel Upgrade' },
  { title: 'Commercial Electrical Build-Out', location: 'Glendale, CA', desc: 'Full electrical build-out for new commercial space including lighting, outlets, and panels.', type: 'Commercial' },
  { title: 'Smart Home Electrical Integration', location: 'Pasadena, CA', desc: 'Structured wiring and smart panel integration for home automation system.', type: 'Smart Home' },
]

export default function Portfolio() {
  return (
    <>
      <Head>
        <title>Project Portfolio | AMY Electric Los Angeles</title>
        <meta name="description" content="View AMY Electric\'s recent electrical projects across Greater Los Angeles — EV charger installations, panel upgrades, rewiring, and commercial work." />
        <link rel="canonical" href="https://www.amyelectric.com/portfolio" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Electrician",
          "name": "AMY Electric",
          "telephone": "+18183025614",
          "url": "https://www.amyelectric.com/portfolio",
          "address": { "@type": "PostalAddress", "streetAddress": "20628 Londelius St", "addressLocality": "Winnetka", "addressRegion": "CA", "postalCode": "91306" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "itemListElement": projects.map(p => ({ "@type": "Offer", "itemOffered": { "@type": "Service", "name": p.title } }))
          }
        }) }} />
      </Head>
      <main className="page">
        <div className="container">
          <p className="eyebrow">AMY Electric • C-10 #981578</p>
          <h1>Project Portfolio</h1>
          <p className="lead">A selection of recent residential and commercial electrical projects across Greater Los Angeles.</p>
          <div className="project-grid">
            {projects.map((project, i) => (
              <div key={i} className="project-card">
                <span className="project-type">{project.type}</span>
                <h3>{project.title}</h3>
                <p className="project-location">📍 {project.location}</p>
                <p>{project.desc}</p>
              </div>
            ))}
          </div>
          <p style={{marginTop:'2rem',color:'#666'}}>For a full list of our work, call (818) 302-5614 or visit our <Link href="/gallery">Gallery</Link>.</p>
        </div>
      </main>
    </>
  )
}
