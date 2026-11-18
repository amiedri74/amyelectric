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

## 2. Configure Cloudflare Access before publishing the route

In the Cloudflare dashboard:

1. Open **Zero Trust → Access controls → Service Auth → Service Tokens** and create a service token for the Amy Electric website backend. Copy its Client ID and Client Secret into the website host's secret settings as `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`. Never commit these values.
2. Open **Zero Trust → Access controls → Applications** and create a **Self-hosted** application for `crm.amyelectric.com` before adding a public route.
3. Add two narrowly scoped policies: an **Allow** policy for the owner's exact verified email identity, and a **Service Auth** policy for the service token created in step 1. Require MFA for interactive identity login. Do not create a broad public bypass policy.

## 3. Create the Cloudflare Tunnel

1. Open **Networking → Tunnels** and create a remotely-managed Cloudflared tunnel.
2. Choose the Docker connector instructions and copy the tunnel token into the local `.env` file as `CLOUDFLARE_TUNNEL_TOKEN`.
3. Add a published application route:
   - Hostname: `crm.amyelectric.com`
   - Service type: HTTP
   - Service URL: `http://espocrm:80` (the Docker service name on the Compose network)
4. Confirm the Access application and both policies are active before testing the hostname.

The hostname route targets the EspoCRM container on the Docker Compose network. It must not target localhost from inside the cloudflared container.

## 4. Start the local services

Run from the repository root:

```bash
docker compose -f docker-compose.crm.yml up -d
docker compose -f docker-compose.crm.yml ps
docker compose -f docker-compose.crm.yml logs -f espocrm cloudflared
```

Complete EspoCRM first-run setup at the protected hostname. Create a dedicated API integration user with only the permissions required to create Leads.

## 5. Configure the Amy website integration

The website hosting environment must have:
- `DATABASE_URL` pointing to the PostgreSQL lead database reachable from the website host.
- `ESPOCRM_URL=https://crm.amyelectric.com`
- `ESPOCRM_API_KEY` for the restricted EspoCRM integration user.
- `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` for the Cloudflare Access Service Auth policy protecting server-to-server API calls.
- `LEAD_WORKER_TOKEN` and the SMTP settings.

**Important network limitation:** Cloudflare Tunnel exposes the CRM HTTP endpoint, not the PostgreSQL database. The current website code writes leads to PostgreSQL before forwarding them to EspoCRM. If the website is hosted outside this computer, its `DATABASE_URL` cannot use the local Docker-only database address. Use a separately hosted PostgreSQL service reachable privately by the website, or change the application architecture so the website posts to a secured ingestion endpoint on this machine. Never expose PostgreSQL's port publicly. The Cloudflare Access service-token headers added to the EspoCRM client let the website backend call the Access-protected CRM API without exposing the API key to browsers.

## 6. Backups and operating requirements

- Keep the computer powered on, online, and patched.
- Back up MariaDB and PostgreSQL regularly; test restoration.
- Monitor disk space, Docker health, and tunnel connectivity.
- Restrict local OS access and encrypt the computer's storage.
- Keep database ports bound to loopback / private interfaces.
- Apply rate limiting and review Cloudflare Access logs.
- A local power, ISP, or hardware outage makes the CRM unavailable until the computer returns.

## 7. Local operating system commands

Docker Desktop is the simplest option on Windows and macOS. On Linux, install Docker Engine and the Compose plugin from the official Docker instructions. The Compose commands above are the same on all three systems.

## 8. Go-live acceptance

- Access to `crm.amyelectric.com` requires the intended Cloudflare Access identity and MFA.
- No direct public access exists to MariaDB, PostgreSQL, or port 8088.
- EspoCRM creates a Lead using the website integration API key.
- Website form leads persist in the configured PostgreSQL database.
- Outbox retry, email delivery, backups, and restore are tested.
