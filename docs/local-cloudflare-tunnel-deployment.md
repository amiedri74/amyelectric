# Cloudflare Tunnel deployment guide (superseded)

The initial CRM-only tunnel guide has been replaced by the complete Cloudflare Workers + office-hosted CRM deployment guide.

Use [docs/cloudflare-workers-office-crm.md](cloudflare-workers-office-crm.md). It documents the current design with:
- Cloudflare Workers / OpenNext for the public Next.js website
- Cloudflare Access Service Auth for Worker-to-office requests
- Cloudflare Tunnel routes to the local lead API and EspoCRM
- PostgreSQL and MariaDB kept private on the Linux computer
- local lead persistence, EspoCRM synchronization, SMTP delivery, and retry queue

Do not follow the old instructions in earlier revisions of this file; they assumed the remote website could connect directly to the office PostgreSQL database.
