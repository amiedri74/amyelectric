import Head from 'next/head'
import Link from 'next/link'

const faqs = [
  ['How much does EV charger installation cost?', 'The cost depends on the charger, electrical service capacity, circuit requirements, wire distance, routing, equipment and site conditions. A site evaluation is the best way to determine the actual installation scope.'],
  ['Can my electrical panel handle an EV charger?', 'It depends on the existing service capacity, current loads and the proposed charger. An electrical load evaluation should be completed before installation.'],
  ['Do I need a panel upgrade for an EV charger?', 'Not necessarily. Some properties have adequate capacity for the proposed charger, while others may require a circuit or service upgrade.'],
  ['Can you install a Tesla Wall Connector?', 'Yes. Amy Electric provides Tesla Wall Connector installation and evaluates the electrical requirements and installation location.']
]

export default function EVChargerCost() {
  return (
    <>
      <Head>
        <title>EV Charger Installation Cost in Los Angeles | Amy Electric</title>
        <meta name="description" content="Learn what affects EV charger installation cost in Los Angeles, including panel capacity, circuit size, wire distance, charger type and installation conditions." />
        <link rel="canonical" href="https://www.amyelectric.com/ev-charger-cost-los-angeles" />
      </Head>
      <main className="page">
        <div className="container narrow">
          <p className="eyebrow">EVITP #4051604 • Amy Electric</p>
          <h1>EV Charger Installation Cost in Los Angeles</h1>
          <p className="lead">Installation cost varies by electrical capacity, charger type, circuit requirements, distance and site conditions.</p>
          <h2>What affects installation cost?</h2>
          <ul>
            <li>Existing electrical service and panel capacity</li>
            <li>Required circuit and charger specifications</li>
            <li>Distance between the panel and charger</li>
            <li>Conduit, wire and routing conditions</li>
            <li>Indoor or outdoor installation location</li>
            <li>Whether an electrical upgrade is required</li>
          </ul>
          <h2>Get an EV charger evaluation</h2>
          <p>Amy Electric can evaluate the existing electrical system and determine the appropriate installation scope for your property.</p>
          <div className="actions">
            <a className="button primary" href="tel:18183025614">Call (818) 302-5614</a>
            <Link className="button secondary" href="/services/ev-charger-installation">EV Charger Service</Link>
          </div>
          <section className="faq">
            <h2>EV Charger FAQs</h2>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </main>
    </>
  )
}
