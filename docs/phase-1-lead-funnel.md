# AMY Electric — Phase 1 Lead Funnel

## Scope delivered on this branch

- Reworked the residential contact form with customer, project, location, contact preference and consent fields.
- Added a dedicated `/commercial-bid` page for general contractors, property managers and commercial customers.
- Changed the EV estimate calculator so it only submits a lead after the visitor enters contact details and gives contact consent. The former empty-name/empty-phone submission was removed.
- Added a shared GA4 event helper and lead/phone/quote events.
- Hardened `/api/contact` with server-side field limits, phone/email validation, consent validation, a honeypot field, HTML escaping and safe text email output.
- Kept SMTP delivery as the current lead-delivery mechanism.
- Corrected the Nodemailer dependency to a valid 6.x release line.

## Required production environment

Configure these values in the hosting provider's secret/environment settings:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `EMAIL_TO`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional until GA4 is configured)

Do not commit real credentials to Git.

The API returns HTTP 503 if SMTP delivery is not configured. This is intentional: it must not report a lead as successfully delivered when the mail transport is unavailable.

## Manual staging acceptance tests

1. Submit the residential form with valid name, phone, ZIP, project type, details and consent. Confirm the configured inbox receives one message.
2. Submit with a missing phone, invalid email, missing project details or missing consent. Confirm the API rejects the request with HTTP 400.
3. Submit the commercial bid form with company, contact, phone, email, project address, project type, scope and bid date. Confirm the inbox receives a clearly labelled commercial lead.
4. Submit an EV estimate without contact details. Confirm no lead is created. Open the evaluation form, enter valid contact information and consent, then submit. Confirm the email includes the calculator inputs and preliminary range.
5. Enter text such as `<script>alert(1)</script>` in a project details field. Confirm the received email displays it as text and does not execute markup.
6. Fill the hidden honeypot field in a test request. Confirm the API returns a generic success response without sending an email.
7. Disable SMTP credentials in staging. Confirm the API returns HTTP 503 and the UI displays the call-in fallback.
8. With GA4 configured, verify `generate_lead`, `quote_start` and `phone_click` events in GA4 DebugView.
9. Test all forms on mobile and desktop.

## Not yet implemented

These are separate follow-on phases and must not be represented as live functionality yet:

- PostgreSQL lead persistence and durable submissions.
- HubSpot contact/deal synchronization and retry queue.
- Secure file upload for commercial plans.
- Authentication and internal CRM dashboard.
- Material/labor estimating engine and NEC calculation modules.
- EV load feasibility calculation.
- Google Ads conversion import and offline booked-job revenue attribution.
- Redis-backed rate limiting and durable background workers.

## Deployment gate

Do not merge or deploy until:
- Staging environment variables are configured.
- All manual acceptance tests pass.
- The build and lint commands pass in CI.
- The owner confirms the production lead inbox and GA4 measurement ID.
