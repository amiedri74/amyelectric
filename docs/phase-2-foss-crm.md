# AMY Electric Phase 2 — FOSS CRM and Durable Lead Capture

## Selected stack
- CRM: EspoCRM, self-hosted. EspoCRM core is AGPLv3; preserve license notices and comply with applicable source-disclosure obligations for modified network-operated versions.
- EspoCRM database: MariaDB. Do not point EspoCRM at the application's PostgreSQL database.
- Application lead store: PostgreSQL 16. Website submissions are durably written here before downstream delivery.
- Integration: Next.js server-side REST client using EspoCRM X-Api-Key authentication.
- Delivery: PostgreSQL outbox records independently track CRM and email delivery. Failed deliveries remain stored for retry.
- Worker: protected POST endpoint at /api/internal/process-lead-outbox. Schedule it every minute from a trusted host scheduler.

## Local deployment
1. Provision a Linux VPS with Docker Engine and Docker Compose plugin.
2. Point a dedicated CRM hostname (for example crm.amyelectric.com) to the VPS.
3. Copy .env.example to .env; replace every CHANGE_ME value with unique strong secrets. Do not commit .env.
4. Set ESPOCRM_SITE_URL to the HTTPS CRM hostname. Configure a TLS reverse proxy in front of the EspoCRM container. Compose binds the CRM port to loopback only.
5. Run docker compose -f docker-compose.crm.yml up -d.
6. Complete EspoCRM first-run initialization, then create a dedicated API user/key with only the permissions required to create Leads.
7. Set the Next.js hosting environment variables DATABASE_URL, ESPOCRM_URL, ESPOCRM_API_KEY and LEAD_WORKER_TOKEN, plus SMTP variables for email notification.
8. Apply db/schema.sql to PostgreSQL using psql "$DATABASE_URL" -f db/schema.sql.
9. Deploy the website branch after CI and staging acceptance tests pass.
10. Configure a trusted scheduler to POST to https://www.amyelectric.com/api/internal/process-lead-outbox every minute with Authorization: Bearer $LEAD_WORKER_TOKEN. Never expose this token in browser code.

## Required environment
- DATABASE_URL — PostgreSQL connection string for Amy website leads.
- DATABASE_SSL=true when the hosted PostgreSQL provider requires TLS.
- ESPOCRM_URL — Base URL, e.g. https://crm.amyelectric.com.
- ESPOCRM_API_KEY — API key for a dedicated EspoCRM integration user.
- LEAD_WORKER_TOKEN — long random token used only by the scheduler.
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO.
- ESPOCRM_DB_ROOT_PASSWORD, ESPOCRM_DB_PASSWORD, ESPOCRM_ADMIN_USERNAME, ESPOCRM_ADMIN_PASSWORD, ESPOCRM_SITE_URL, LEADS_DB_PASSWORD for Compose deployment.

## Data flow
1. Validate form fields and contact consent.
2. Insert the lead and CRM/email outbox records in one PostgreSQL transaction.
3. Attempt CRM and email delivery immediately after the durable insert.
4. Return success once the lead is safely persisted, even if CRM or email is temporarily unavailable. Return the lead reference for support.
5. The scheduled worker retries failed channels with exponential backoff. Idempotency keys prevent duplicate inserts when the same key is reused.

## API and security notes
- Never expose EspoCRM API keys or database credentials to browser code.
- Use HTTPS for the CRM hostname; keep CRM and PostgreSQL ports private.
- Back up both database volumes and test restores.
- Restrict the CRM integration user and admin account; enable MFA where available.
- Apply rate limiting at the reverse proxy/application edge before production.
- Do not accept confidential bid files through the current form; implement a separate authenticated upload flow.
- Verify and pin an exact EspoCRM release and image digest before production. The Compose file supports ESPOCRM_VERSION; do not leave latest as the long-term production pin.

## Staging acceptance
- Submit residential, commercial and EV estimate requests; each must create one PostgreSQL record.
- Verify the record appears in EspoCRM as a Lead.
- Disable EspoCRM temporarily; website submission must still be retained and worker must retry.
- Disable SMTP temporarily; website submission must still be retained and worker must retry email.
- Re-send a request with the same Idempotency-Key; confirm the same lead ID is returned and no duplicate CRM/email outbox records are created.
- Verify invalid phone, invalid email and missing consent are rejected before persistence.
- Confirm logs never contain API keys, SMTP passwords or full sensitive payloads.
- Test database backup and restore before go-live.
