# AMY Electric Phase 2 — FOSS CRM and Durable Lead Capture

## Selected stack

- CRM: EspoCRM, self-hosted (AGPLv3).
- EspoCRM database: MariaDB.
- Website lead store and outbox: PostgreSQL 16 on the office/home Linux computer.
- Public website: Next.js on Cloudflare Workers using OpenNext.
- Private integration: Cloudflare Tunnel + Access Service Auth from the Worker to the local lead API.
- Delivery: local Node.js lead API writes PostgreSQL records and processes EspoCRM/email outbox jobs.
- Retry: protected Worker endpoint proxies retry requests to the local service.

## Deployment guide

The authoritative setup instructions are now in [docs/cloudflare-workers-office-crm.md](cloudflare-workers-office-crm.md). Use that guide instead of any earlier VPS or direct-PostgreSQL instructions in this file.

The Linux machine must stay powered on and connected. The public website remains on Cloudflare Workers; if the office internet or computer is unavailable, the website remains online but the form cannot confirm a lead was durably saved to the local CRM stack.

## Data flow

1. Validate form fields and contact consent in the Worker API route.
2. Forward the lead to the local lead API through a Cloudflare Access Service Auth policy and Tunnel.
3. Insert the lead and CRM/email outbox records in one PostgreSQL transaction.
4. Attempt EspoCRM and email delivery after the durable insert.
5. Return success only after PostgreSQL confirms the lead was saved.
6. Retry failed CRM/email channels with exponential backoff. Idempotency keys prevent duplicate inserts when the same key is reused.

## API and security notes

- Never expose EspoCRM API keys, service tokens, ingestion tokens, or database credentials to browser code.
- Cloudflare Access protects `leads-api.amyelectric.com` with a Service Auth policy.
- The local lead API additionally requires a long random bearer token.
- Cloudflare Access protects `crm.amyelectric.com` with the owner's verified identity and MFA.
- PostgreSQL is bound only to host loopback for local administration; MariaDB is not published. Neither database is publicly accessible.
- Back up both database volumes to encrypted off-machine storage and test restores.
- Restrict the EspoCRM integration user to the minimum required Lead permissions.
- Apply Cloudflare rate limiting and monitor failed outbox records.
- Do not accept confidential bid files through the current form; implement a separate authenticated upload flow.
- Verify and pin an exact EspoCRM release and image digest before production. Do not leave `latest` as the long-term production pin.

## Staging acceptance

- Submit residential, commercial, and EV estimate requests; each must create one PostgreSQL record.
- Verify each lead appears in EspoCRM with its contact and project information.
- Disable EspoCRM temporarily; website submission must still be retained and the outbox must retry.
- Disable SMTP temporarily; website submission must still be retained and the outbox must retry email.
- Re-send a request with the same Idempotency-Key; confirm the same lead ID is returned and no duplicate outbox records are created.
- Verify invalid phone, invalid email, and missing consent are rejected before persistence.
- Confirm logs never contain API keys, SMTP passwords, or full sensitive payloads.
- Verify Access denies requests without the service token and the local API denies requests without its bearer token.
- Test PostgreSQL and MariaDB backup and restore before go-live.
