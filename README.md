# AMY Electric — Next.js Website

Website and lead-capture application for AMY Electric, deployed on Cloudflare Workers.

## Getting Started

```bash
npm install
npm run dev
```

## FOSS lead-management architecture

- EspoCRM is the selected self-hosted FOSS CRM (AGPLv3).
- MariaDB stores EspoCRM's CRM data.
- PostgreSQL stores website leads and the durable delivery outbox on the office/home Linux computer.
- The website runs on Cloudflare Workers using the OpenNext adapter.
- The Worker validates website leads and securely forwards them through Cloudflare Tunnel + Access to the local lead API.
- The local lead API persists leads and handles EspoCRM synchronization, email delivery, and retries.
- Neither PostgreSQL nor MariaDB is publicly exposed.

See [Cloudflare Workers + office-hosted CRM deployment](docs/cloudflare-workers-office-crm.md) for setup, secrets, tunnel routes, deployment, and acceptance tests.

## Cloudflare Workers commands

- `npm run worker:build` — build the Next.js application for Workers.
- `npm run worker:preview` — preview in the Workers runtime.
- `npm run worker:deploy` — deploy using Wrangler.
- `npm run cf-typegen` — generate Worker binding types.

Before deploying, set the Worker name in `wrangler.jsonc` to the exact existing script name from the Cloudflare dashboard. Use a staging Worker first.

## Pages

- `/` — Homepage
- `/estimate` — EV charger preliminary estimator
- `/contact` — Residential lead capture
- `/commercial-bid` — Commercial bid request
- `/portfolio` — Project portfolio
- `/cities` and `/cities/[slug]` — City landing pages
- `/services` and `/services/[slug]` — Service pages
- `/ev-charger-cost-los-angeles` — EV charger pricing and FAQs
- `/api/contact` — Validates and forwards website leads to the private office lead API
- `/api/internal/process-lead-outbox` — Token-protected retry worker proxy

## Database setup

Apply `db/schema.sql` to the local PostgreSQL lead database before enabling live forms. EspoCRM uses its separate MariaDB service from `docker-compose.crm.yml`.

## Deployment safety

Do not deploy with sample secrets. Keep `.env` out of Git. Require Cloudflare Access on both the CRM and lead API hostnames, keep database ports private, use backups, and run staging acceptance tests before production.
