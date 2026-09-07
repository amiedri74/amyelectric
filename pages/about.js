import Head from 'next/head'
import Link from 'next/link'

const timeline = [
  { year: '2012', title: 'Company Founded', desc: 'AMY Electric established in Winnetka, CA. Started with residential electrical repairs and panel upgrades across the San Fernando Valley.' },
  { year: '2015', title: 'Commercial Electrical Services', desc: 'Expanded into commercial electrical work — tenant improvements, LED retrofits, and panel upgrades for LA businesses.' },
  { year: '2018', title: 'EV Charger Installation Specialist', desc: 'Became EVITP-certified (#4051604) and began specializing in EV charger installations. Early adopter of Level 2 charging technology.' },
  { year: '2022', title: 'Greater LA Expansion', desc: 'Expanded service area to 16+ communities across Greater Los Angeles. Reached 100+ EV charger installations milestone.' },
  { year: '2026', title: 'Today', desc: '200+ EV chargers installed, 87+ five-star reviews, and growing. Continuing to serve LA with the same commitment to quality and safety.' },
]

const stats = [
  { label: '200+ EV Chargers Installed', icon: '⚡' },
  { label: '14+ Years in Business', icon: '📅' },
  { label: '16 Communities Served', icon: '📍' },
  { label: '4.9★ Average Rating', icon: '⭐' },
]

const credentials = [
  { icon: '🏅', title: 'C-10 License #981578', desc: 'California Electrical Contractor license issued by the Contractors State License Board (CSLB). Active and in good standing.' },
  { icon: '⚡', title: 'EVITP #4051604', desc: 'Electric Vehicle Infrastructure Training Program certification. Required by many California AHJs for EV charger installation.' },
  { icon: '🛡️', title: 'Fully Insured', desc: 'General liability insurance and workers compensation coverage. Your property and our workers are protected on every job.' },
  { icon: '📋', title: 'All Permits Handled', desc: 'We manage the entire permitting process — applications, inspections, and Certificate of Completion. Code compliance guaranteed.' },
]

const faqs = [
  { q: 'Is AMY Electric a licensed electrical contractor?', a: 'Yes — AMY Electric is a licensed California C-10 electrical contractor and EVITP-certified. Our license is active and in good standing with the CSLB. You can verify our license at cslb.ca.gov.' },
  { q: 'How long has AMY Electric been serving Los Angeles?', a: 'AMY Electric has been serving Greater Los Angeles since 2012 — over 14 years of residential and commercial electrical service. We have completed 200+ EV charger installations and thousands of panel upgrades, repairs, and wiring projects across 16+ LA communities.' },
  { q: 'What areas does AMY Electric serve?', a: 'We serve all of Greater Los Angeles from our base in Winnetka, CA. Our electricians know the local permitting requirements and utility coordination for each community, including Los Angeles, Burbank, Glendale, Pasadena, Sherman Oaks, Studio City, North Hollywood, Van Nuys, Encino, Woodland Hills, Calabasas, Culver City, Beverly Hills, Santa Monica, and West LA.' },
  { q: 'Are you licensed to work in my city?', a: 'Yes — AMY Electric holds an active California C-10 Electrical Contractor license, which is verified and in good standing with the Contractors State License Board (CSLB). You can confirm our license status yourself at cslb.ca.gov by entering license number 981578 or calling (800) 321-CSLB.' },
]

export default function About() {
  return (
    <>
      <Head>
        <title>About AMY Electric | Licensed C-10 Electrician Los Angeles</title>
        <meta name="description" content="AMY Electric is a licensed C-10 contractor (#981578) serving Greater Los Angeles since 2012. EVITP-certified. Free estimates. Call (818) 302-5614." />
        <link rel="canonical" href="https://www.amyelectric.com/about" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Electrician",
          "name": "AMY Electric",
          "image": "https://www.amyelectric.com/img/og-home.jpg",
          "logo": "https://www.amyelectric.com/img/og-home.jpg",
          "description": "Licensed C-10 electrical contractor in Los Angeles. EVITP-certified EV charger installation, panel upgrades, rewiring, and electrical repairs. Serving Greater LA since 2012.",
          "telephone": "+18183025614",
          "email": "info@amyelectric.com",
          "url": "https://www.amyelectric.com/about",
          "address": { "@type": "PostalAddress", "streetAddress": "20628 Londelius St", "addressLocality": "Winnetka", "addressRegion": "CA", "postalCode": "91306", "addressCountry": "US" },
          "geo": { "@type": "GeoCoordinates", "latitude": 34.190, "longitude": -118.587 },
          "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "17:00" }],
          "areaServed": "Greater Los Angeles Area, CA",
          "serviceArea": [
            { "@type": "City", "name": "Los Angeles" }, { "@type": "City", "name": "Burbank" }, { "@type": "City", "name": "Glendale" },
            { "@type": "City", "name": "Pasadena" }, { "@type": "City", "name": "Sherman Oaks" }, { "@type": "City", "name": "Studio City" },
            { "@type": "City", "name": "North Hollywood" }, { "@type": "City", "name": "Van Nuys" }, { "@type": "City", "name": "Encino" },
            { "@type": "City", "name": "Woodland Hills" }, { "@type": "City", "name": "Calabasas" }, { "@type": "City", "name": "Culver City" },
            { "@type": "City", "name": "Beverly Hills" }, { "@type": "City", "name": "Santa Monica" }, { "@type": "City", "name": "West LA" }, { "@type": "City", "name": "Winnetka" }
          ],
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "87", "bestRating": "5", "worstRating": "1" },
          "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Electrical Services", "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "EV Charger Installation" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Panel Upgrade" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Repair" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Whole-Home Rewiring" } }
          ]},
          "sameAs": ["https://g.page/r/CVdK9ZAvNBrZEAI", "https://www.yelp.com/biz/amy-electric-winnetka", "https://www.facebook.com/808165319279113"],
          "priceRange": "$$",
          "hasCredential": [
            { "@type": "EducationalOccupationalCredential", "name": "California C-10 Electrical Contractor License #981578", "url": "https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=981578" },
            { "@type": "EducationalOccupationalCredential", "name": "EVITP Certification #4051604" }
          ],
          "containsInPlace": { "@type": "Place", "name": "Greater Los Angeles" }
        }) }} />
      </Head>
      <main className="page">
        <section className="page-hero">
          <div className="container">
            <p className="eyebrow">Licensed C-10 Electrical Contractor • EVITP Certified</p>
            <h1>About AMY Electric</h1>
            <p className="lead">Family-owned electrical contractor serving Greater Los Angeles since 2012. Licensed, insured, EVITP-certified.</p>
            <div className="actions">
              <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
              <Link className="button secondary" href="/">Home</Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Our Story</p>
              <h2>Licensed C-10 Electrician Serving Los Angeles Since 2012</h2>
              <p>AMY Electric was founded in 2012 with a simple mission: provide honest, reliable, high-quality electrical service to Los Angeles homeowners and businesses. What started as a one-person operation has grown into a trusted team of licensed electricians serving 16+ communities across Greater Los Angeles.</p>
              <p>Our founder, Amram, earned his California C-10 Electrical Contractor license (#981578) after years of hands-on experience in residential and commercial electrical work. He holds an EVITP certification for electric vehicle charging infrastructure and has completed 2,000+ projects across Greater LA.</p>
            </div>
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <span className="stat-icon">{s.icon}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Our Timeline</p>
              <h2>AMY Electric Through the Years</h2>
            </div>
            <div className="timeline">
              {timeline.map((t) => (
                <div className="timeline-item" key={t.year}>
                  <span className="timeline-year">{t.year}</span>
                  <div className="timeline-content">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Credentials &amp; Certifications</p>
              <h2>Licensed, Insured, Certified</h2>
              <p>Every AMY Electric project is backed by proper licensing, full insurance coverage, and industry-leading certifications. We don't cut corners — on safety or on paper.</p>
            </div>
            <div className="grid">
              {credentials.map((c) => (
                <article className="card" key={c.title}>
                  <span className="card-icon">{c.icon}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">About AMY Electric</p>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              {faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
