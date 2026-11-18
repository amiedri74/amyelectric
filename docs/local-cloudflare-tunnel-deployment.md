# Local Amy Electric CRM deployment with Cloudflare Tunnel

This deployment keeps EspoCRM and its databases on an always-on computer you control. Cloudflare Tunnel provides an outbound-only connection to Cloudflare; do not expose MariaDB, PostgreSQL, or the EspoCRM container port directly to the internet.

## Prerequisites

- An always-on Windows, macOS, or Linux computer with Docker Desktop / Docker Engine and the Compose plugin.
- A Cloudflare account and the Amy Electric domain managed in that account.
- A dedicated hostname such as `crm.amyelectric.com`.
- A Cloudflare Tunnel token. Treat it as a password: store it only in the local `.env` file or a secret manager; never commit or paste it into chat.

## 1. Prepare the repository and secrets

1. Check out branch `feature/espocrm-foss-crm` after the Phase 1 base branch is available.
2. Copy `.env.example` to `.env`.
3. Generate unique strong values for every `CHANGE_ME` value, including both database passwords and the EspoCRM admin password.
4. Set `ESPOCRM_SITE_URL=https://crm.amyelectric.com`.
5. Set `CLOUDFLARE_TUNNEL_TOKEN` to the token created in the Cloudflare dashboard.
6. Pin `ESPOCRM_VERSION` to a tested exact release before production; do not use `latest` for production.
7. Keep `.env` out of Git.

## 2. Create the Cloudflare Tunnel

In the Cloudflare dashboard:

1. Open **Zero Trust → Networks → Tunnels** and create a remotely-managed Cloudflared tunnel.
2. Choose the Docker connector instructions and copy the tunnel token into the local `.env` file.
3. Add a published application route / public hostname:
   - Hostname: `crm.amyelectric.com`
   - Service type: HTTP
   - Service URL: `http://espocrm:80`
4. Configure a Cloudflare Access self-hosted application for `crm.amyelectric.com` and allow only the owner's verified email identity (or a narrowly scoped approved group).
5. Require MFA and use a short session lifetime. Do not create a broad public bypass policy.

The hostname route targets the EspoCRM container on the Docker Compose network. It must not target localhost from inside the cloudflared container.

## 3. Start the local services

Run from the repository root:

```bash
docker compose -f docker-compose.crm.yml up -d
docker compose -f docker-compose.crm.yml ps
docker compose -f docker-compose.crm.yml logs -f espocrm cloudflared
```

Complete EspoCRM first-run setup at the protected hostname. Create a dedicated API integration user with only the permissions required to create Leads.

## 4. Configure the Amy website integration

The website hosting environment must have:
- `DATABASE_URL` pointing to the PostgreSQL lead database reachable from the website host.
- `ESPOCRM_URL=https://crm.amyelectric.com`
- `ESPOCRM_API_KEY` for the restricted EspoCRM integration user.
- `LEAD_WORKER_TOKEN` and the SMTP settings.

**Important network limitation:** Cloudflare Tunnel exposes the CRM HTTP endpoint, not the PostgreSQL database. If the website is hosted outside this computer, its `DATABASE_URL` cannot use the local Docker-only database address. Use a separately hosted PostgreSQL service or implement a secured application-side ingestion endpoint; never expose PostgreSQL's port publicly.

## 5. Backups and operating requirements

- Keep the computer powered on, online, and patched.
- Back up MariaDB and PostgreSQL regularly; test restoration.
- Monitor disk space, Docker health, and tunnel connectivity.
- Restrict local OS access and encrypt the computer's storage.
- Keep database ports bound to loopback / private interfaces.
- Apply rate limiting and review Cloudflare Access logs.
- A local power, ISP, or hardware outage makes the CRM unavailable until the computer returns.

## 6. Local operating system commands

Docker Desktop is the simplest option on Windows and macOS. On Linux, install Docker Engine and the Compose plugin from the official Docker instructions. The Compose commands above are the same on all three systems.

## Go-live acceptance

- Access to `crm.amyelectric.com` requires the intended Cloudflare Access identity and MFA.
- No direct public access exists to MariaDB, PostgreSQL, or port 8088.
- EspoCRM creates a Lead using the website integration API key.
- Website form leads persist in the configured PostgreSQL database.
- Outbox retry, email delivery, backups, and restore are tested.
