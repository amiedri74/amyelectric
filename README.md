# AMY Electric — Next.js Website

Website and lead-capture application for AMY Electric.

## Getting Started

```bash
npm install
npm run dev
```

## FOSS lead-management architecture

- EspoCRM is the selected self-hosted FOSS CRM (AGPLv3).
- MariaDB stores EspoCRM's own CRM data.
- PostgreSQL stores website leads and a durable delivery outbox.
- The website API persists a valid lead before attempting CRM or email delivery.
- The server-side EspoCRM API client uses an API key that must never be exposed to the browser.
- A protected worker endpoint retries pending CRM/email deliveries.

See docs/phase-2-foss-crm.md for deployment, secrets, scheduler setup and acceptance tests.

## Environment

Copy .env.example to .env.local for local website development and configure the required values. For server deployment, set secrets in the hosting platform's secret manager.

Required website runtime values:
- DATABASE_URL and optional DATABASE_SSL
- ESPOCRM_URL and ESPOCRM_API_KEY
- LEAD_WORKER_TOKEN
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO
- NEXT_PUBLIC_GA_MEASUREMENT_ID for GA4

## Pages

- / — Homepage
- /estimate — EV charger preliminary estimator
- /contact — Residential lead capture
- /commercial-bid — Commercial bid request
- /portfolio — Project portfolio
- /cities and /cities/[slug] — City landing pages
- /services and /services/[slug] — Service pages
- /ev-charger-cost-los-angeles — EV charger pricing and FAQs
- /api/contact — Validates and durably records website leads
- /api/internal/process-lead-outbox — Token-protected delivery retry worker

## Database setup

Apply db/schema.sql to the PostgreSQL application database before enabling live forms. EspoCRM must use its separate MariaDB service from docker-compose.crm.yml.

## Deployment safety

Do not deploy with sample secrets. Keep .env files out of Git. Use HTTPS, private database networking, backups and a pinned EspoCRM image version. Run staging acceptance tests in docs/phase-2-foss-crm.md before production.
