# AMY Electric — Next.js Website

Static marketing site for AMY Electric (C-10 #981578, EVITP #4051604).

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Email sending
- `EMAIL_FROM`, `EMAIL_TO` — Email addresses
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics 4

## Pages

- `/` — Homepage
- `/estimate` — EV Charger Installation Calculator
- `/contact` — Lead capture form (submits to `/api/contact`)
- `/portfolio` — Project portfolio
- `/cities` and `/cities/[slug]` — City landing pages
- `/services` and `/services/[slug]` — Service pages
- `/ev-charger-cost-los-angeles` — EV charger pricing and FAQs
- `/sitemap.xml` — Auto-generated sitemap
- `/api/contact` — Form submission handler

## Lead Pipeline

The contact and estimate forms submit to `/api/contact`, which sends an email via SMTP. Configure SMTP credentials in `.env.local` to enable email notifications.
