CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS website_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key UUID NOT NULL UNIQUE,
  customer_type VARCHAR(30) NOT NULL CHECK (customer_type IN ('residential', 'commercial')),
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(254),
  project_type VARCHAR(150) NOT NULL,
  project_address VARCHAR(250),
  zip_code VARCHAR(15),
  source_page TEXT,
  payload JSONB NOT NULL,
  espocrm_record_id VARCHAR(100),
  espocrm_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (espocrm_status IN ('pending', 'sent', 'failed', 'disabled')),
  email_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed', 'disabled')),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_leads_created_at_idx ON website_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS website_leads_delivery_idx ON website_leads (espocrm_status, email_status);

CREATE TABLE IF NOT EXISTS lead_outbox (
  id BIGSERIAL PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES website_leads(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('espocrm', 'email')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lead_id, channel)
);
CREATE INDEX IF NOT EXISTS lead_outbox_ready_idx ON lead_outbox (available_at, created_at) WHERE status IN ('pending', 'failed');
