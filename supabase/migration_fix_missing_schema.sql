-- =====================================================
-- Fix missing tables and columns (May 2026)
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. quiz_sessions (base table — no dependencies)
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  first_name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  fbclid TEXT,
  gclid TEXT,
  device_type TEXT,
  country TEXT,
  primary_type TEXT,
  secondary_type TEXT,
  builder_score INT,
  guardian_score INT,
  giver_score INT,
  visionary_score INT,
  demographic_data JSONB,
  status TEXT DEFAULT 'started',
  email TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_code_expires_at TIMESTAMP WITH TIME ZONE,
  marketing_consent BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created ON quiz_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_utm ON quiz_sessions(utm_source, utm_campaign);

-- 2. quiz_answers (depends on quiz_sessions)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_id TEXT NOT NULL,
  answer_letter TEXT,
  answer_value TEXT NOT NULL,
  type TEXT,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INT
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);

-- 3. leads (depends on quiz_sessions)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  primary_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  paywall_viewed BOOLEAN DEFAULT FALSE,
  paywall_viewed_at TIMESTAMP WITH TIME ZONE,
  checkout_started BOOLEAN DEFAULT FALSE,
  checkout_started_at TIMESTAMP WITH TIME ZONE,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(primary_type);

-- 4. orders (depends on leads and quiz_sessions)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  session_id UUID REFERENCES quiz_sessions(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  email TEXT NOT NULL,
  amount_total_cents INT NOT NULL,
  currency TEXT DEFAULT 'usd',
  product_main BOOLEAN DEFAULT TRUE,
  upsell_1_purchased BOOLEAN DEFAULT FALSE,
  upsell_2_purchased BOOLEAN DEFAULT FALSE,
  upsell_3_purchased BOOLEAN DEFAULT FALSE,
  primary_type TEXT NOT NULL,
  pdf_generated BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  pdf_sent_at TIMESTAMP WITH TIME ZONE,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMP WITH TIME ZONE,
  refunded BOOLEAN DEFAULT FALSE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);

-- 5. pixel_events (depends on quiz_sessions)
CREATE TABLE IF NOT EXISTS pixel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id),
  event_name TEXT NOT NULL,
  event_value_cents INT,
  fbp TEXT,
  fbc TEXT,
  external_id TEXT,
  sent_to_pixel BOOLEAN DEFAULT FALSE,
  sent_to_capi BOOLEAN DEFAULT FALSE,
  capi_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pixel_events_session ON pixel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_pixel_events_name ON pixel_events(event_name);

-- 6. email_logs (depends on leads and orders)
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  order_id UUID REFERENCES orders(id),
  email_to TEXT NOT NULL,
  email_type TEXT NOT NULL,
  resend_id TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. promo_codes (no dependencies)
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent INT NOT NULL,
  max_uses INT,
  used_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on all tables
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- 9. Add any missing columns to existing tables (safe if already exist)
ALTER TABLE quiz_sessions 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_code TEXT,
  ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS demographic_data JSONB,
  ADD COLUMN IF NOT EXISTS verification_attempts INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_locked_until TIMESTAMP WITH TIME ZONE;

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS email_sequence TEXT,
  ADD COLUMN IF NOT EXISTS email_step INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_email_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS email_sequence_status TEXT DEFAULT 'active';

ALTER TABLE quiz_answers
  ADD COLUMN IF NOT EXISTS type TEXT;

ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

SELECT 'Schema fix complete!' as status;
