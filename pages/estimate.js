import Head from 'next/head'
import { useMemo, useState } from 'react'

export default function Estimate() {
  const [charger, setCharger] = useState('Level 2')
  const [distance, setDistance] = useState(50)
  const [panel, setPanel] = useState('200A')
  const [location, setLocation] = useState('Garage')

  const estimate = useMemo(() => {
    let low = charger === 'Level 2' ? 900 : 700
    let high = charger === 'Level 2' ? 1800 : 1400
    if (distance > 50) { low += (distance - 50) * 8; high += (distance - 50) * 15 }
    if (panel === '100A') { low += 500; high += 1800 }
    if (location === 'Exterior') { low += 150; high += 400 }
    return { low: Math.round(low), high: Math.round(high) }
  }, [charger, distance, panel, location])

  async function captureLead() {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: '', phone: '', project: `EV Charger — ${charger}`, details: `Preliminary estimate: $${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}` }),
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {}
  }

  return (
    <>
      <Head>
        <title>EV Charger Installation Estimate | Amy Electric Los Angeles</title>
        <meta name="description" content="Use Amy Electric's EV charger installation estimator to understand project cost factors in Los Angeles. Final pricing requires a site evaluation." />
        <link rel="canonical" href="https://www.amyelectric.com/estimate" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">Amy Electric • EVITP #4051604</p>
          <h1>EV Charger Installation Estimate</h1>
          <p className="lead">Get a preliminary installation range. This is not a final quote; actual requirements depend on the property and electrical system.</p>
          <div className="form-grid">
            <label>Charger Type<select value={charger} onChange={(e) => setCharger(e.target.value)}><option>Level 2</option><option>Standard EV Charger</option></select></label>
            <label>Existing Panel<select value={panel} onChange={(e) => setPanel(e.target.value)}><option>200A</option><option>100A</option><option>Unknown</option></select></label>
            <label>Wire Distance: {distance} ft<input type="range" min="10" max="200" step="5" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /></label>
            <label>Installation Location<select value={location} onChange={(e) => setLocation(e.target.value)}><option>Garage</option><option>Exterior</option></select></label>
          </div>
          <div className="estimate-box">
            <p>Preliminary installation range</p>
            <strong>${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}</strong>
          </div>
          <p className="disclaimer">Actual pricing can change based on panel capacity, load calculation, circuit size, wire/conduit routing, equipment, permits and site conditions.</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <a className="button primary" href="tel:18183025614">Call (818) 302-5614 for an Evaluation</a>
            <button className="button secondary" onClick={captureLead}>Save My Estimate</button>
          </div>
        </div>
      </main>
    </>
  )
}
