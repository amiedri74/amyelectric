# Cloudflare Workers + office-hosted Amy Electric CRM

This design keeps the public Next.js website on Cloudflare Workers and runs EspoCRM, PostgreSQL, MariaDB, SMTP delivery, and the lead outbox on the always-on Linux computer at the office/home.

## Architecture

1. Visitor submits a form to the website's same-origin `/api/contact` endpoint on Cloudflare Workers.
2. The Worker validates the form and sends the lead to `https://leads-api.amyelectric.com/api/leads`.
3. The request passes through Cloudflare Access Service Auth and a Cloudflare Tunnel.
4. The local `lead-api` container stores the lead in PostgreSQL, then attempts EspoCRM and email delivery.
5. PostgreSQL's outbox records delivery state and retries failures through the protected `/api/internal/process-lead-outbox` endpoint.

PostgreSQL and MariaDB are not exposed to the internet. The lead API is reachable only through the Cloudflare Tunnel and Cloudflare Access.

## Important framework compatibility

The repository previously used Next.js 14. The current OpenNext for Cloudflare release supports Next.js 16 and the latest minor release of Next.js 15; Next.js 14 is no longer supported. This branch upgrades the project to Next.js 15.5.29 and configures OpenNext for Workers. Validate the upgrade against the website's pages and forms before production cutover.

## 1. Cloudflare Workers project setup

The repository now includes:

- `next.config.mjs` — initializes Cloudflare bindings for local development.
- `open-next.config.ts` — OpenNext adapter configuration.
- `wrangler.jsonc` — Worker entry point, assets, runtime compatibility, and the local lead API URL.
- `npm run worker:build` — builds the Next.js application for Workers.
- `npm run worker:preview` — previews the app in the Workers runtime.
- `npm run worker:deploy` — deploys the Worker.

Before deployment, edit `wrangler.jsonc` and set `name` and the service binding `service` to the exact existing Worker script name shown in Cloudflare. Do not change the production custom domain or route until the staging Worker passes acceptance tests.

For a GitHub-connected Workers Build, use:
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`

The CI workflow runs both the Next.js build and OpenNext Worker build.

## 2. Prepare the Linux computer

Install Docker Engine and the Docker Compose plugin. In the repository checkout:

```bash
cp .env.example .env
chmod 600 .env
```

Replace every `CHANGE_ME` value with a unique strong secret. Set:
- `LEADS_DB_PASSWORD`
- `LEAD_INGEST_TOKEN` — at least 32 random bytes; this same value will be stored as a Cloudflare Worker secret
- `ESPOCRM_API_KEY` — API key for a restricted EspoCRM integration user
- MariaDB root, database, and EspoCRM admin passwords
- SMTP host, port, username, password, and destination address
- `CLOUDFLARE_TUNNEL_TOKEN`

Use a tested, exact EspoCRM image version for production instead of `latest`.

Apply the PostgreSQL schema, then start the stack:

```bash
docker compose -f docker-compose.crm.yml up -d --build
docker compose -f docker-compose.crm.yml ps
docker compose -f docker-compose.crm.yml logs -f lead-api cloudflared
```

Apply the lead schema:

```bash
docker compose -f docker-compose.crm.yml exec -T lead-db psql -U amy_leads -d amy_leads < db/schema.sql
```

The `lead-api` container listens on port 3000 inside the Compose network. It is not published on the host. PostgreSQL is bound only to host loopback on port 5433 for local administration. MariaDB is not published.

## 3. Configure the Cloudflare Tunnel

Create or reuse a remotely managed tunnel. Put its connector token only in the Linux server's `.env` as `CLOUDFLARE_TUNNEL_TOKEN`.

In the tunnel's Public Hostnames / published application routes, add:

| Hostname | Service |
|---|---|
| `leads-api.amyelectric.com` | `http://lead-api:3000` |
| `crm.amyelectric.com` | `http://espocrm:80` |

Both services are addressed by Docker service name because cloudflared shares the Compose network. Do not point the cloudflared container at `localhost`.

For `leads-api.amyelectric.com`, create a Cloudflare Access self-hosted application and a **Service Auth** policy that allows only the dedicated service token. Do not add an Allow Everyone policy. The public website visitor never calls this hostname directly; only the Worker calls it.

For `crm.amyelectric.com`, create a separate Access self-hosted application with an Allow policy for the owner's verified email identity and MFA. Do not expose the CRM login page without Access.

Restart the connector after configuration changes if required:

```bash
docker compose -f docker-compose.crm.yml restart cloudflared
```

## 4. Set Worker secrets

Create a separate Cloudflare Access Service Token for the website Worker backend. Do not reuse the CRM user's interactive login.

From the repository root, authenticate Wrangler to the correct Cloudflare account and set the following Worker secrets:

```bash
npx wrangler login
npx wrangler secret put LEAD_INGEST_TOKEN
npx wrangler secret put CF_ACCESS_CLIENT_ID
npx wrangler secret put CF_ACCESS_CLIENT_SECRET
npx wrangler secret put LEAD_WORKER_TOKEN
```

When prompted:
- `LEAD_INGEST_TOKEN`: enter the exact same value as `LEAD_INGEST_TOKEN` in the Linux server's `.env`.
- `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`: enter the Cloudflare Access Service Token credentials for the `leads-api.amyelectric.com` Service Auth policy.
- `LEAD_WORKER_TOKEN`: create a different random secret. It protects the public retry endpoint from unauthorized callers.

`LEAD_INGEST_URL` is a non-secret Worker variable already set in `wrangler.jsonc`. Change it there if the hostname changes.

For Workers Builds, configure the same runtime secrets in the Cloudflare dashboard's Worker settings. Never add any of these values to `NEXT_PUBLIC_*`, GitHub source, or browser code.

## 5. Deploy to staging first

Run locally:

```bash
npm install
npm run build
npm run worker:build
npm run worker:preview
```

After the build succeeds, deploy a staging Worker (or use a separate staging environment) and configure its secrets. Do not move the production website route until the staging tests pass.

## 6. Acceptance tests

- A valid residential form submission returns success and creates exactly one PostgreSQL lead.
- A valid commercial bid request returns success and creates exactly one PostgreSQL lead.
- Repeating the same idempotency key does not create a duplicate lead.
- The new lead appears in EspoCRM with name, phone, email, project type, address, details, source page, and UTM data.
- The office receives the lead notification email.
- If EspoCRM or SMTP is temporarily unavailable, the lead remains saved and the outbox retries later.
- A request to `leads-api.amyelectric.com` without Cloudflare Access service authentication is denied.
- A request reaching the local lead API without the bearer secret is denied.
- PostgreSQL and MariaDB are not reachable from the public internet.
- `crm.amyelectric.com` requires the owner's Access identity and MFA.
- Restore both PostgreSQL and MariaDB from tested backups.

## 7. Operating requirements

- The Linux computer must remain powered on, online, and patched.
- Use a UPS and reliable internet connection where practical.
- Back up PostgreSQL and MariaDB daily to encrypted off-machine storage.
- Monitor disk space, container health, tunnel status, and failed outbox rows.
- Keep `.env` readable only by the deployment administrator (`chmod 600 .env`).
- Do not expose Docker's API socket or database ports to the public internet.

If the office internet, power, or computer is down, the website remains online, but lead delivery to the office-hosted CRM is temporarily unavailable. The Worker returns a temporary service error so the visitor is not falsely told the lead was recorded.
