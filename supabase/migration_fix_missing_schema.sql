-- =====================================================
-- Fix missing tables and columns (May 2026)
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. Add missing columns to quiz_sessions (email verification)
ALTER TABLE quiz_sessions 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_code TEXT,
  ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- 2. Create quiz_answers table (if missing)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_id TEXT NOT NULL,
  answer_letter TEXT,
  answer_value TEXT NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INT
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);

-- 3. Enable RLS on quiz_answers
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- 4. Verify leads table has email_verified column
ALTER TABLE leads 
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- 5. Verify orders table exists with all columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    CREATE TABLE orders (
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
    CREATE INDEX idx_orders_email ON orders(email);
    CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 6. Verify pixel_events table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pixel_events') THEN
    CREATE TABLE pixel_events (
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
    CREATE INDEX idx_pixel_events_session ON pixel_events(session_id);
    CREATE INDEX idx_pixel_events_name ON pixel_events(event_name);
    ALTER TABLE pixel_events ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 7. Verify email_logs table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_logs') THEN
    CREATE TABLE email_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lead_id UUID REFERENCES leads(id),
      order_id UUID REFERENCES orders(id),
      email_to TEXT NOT NULL,
      email_type TEXT NOT NULL,
      resend_id TEXT,
      status TEXT DEFAULT 'sent',
      sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 8. Create promo_codes table (if used by checkout)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'promo_codes') THEN
    CREATE TABLE promo_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      discount_percent INT NOT NULL,
      max_uses INT,
      used_count INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- 9. Create storage bucket for PDF reports (if not exists)
-- Note: Buckets must be created via Supabase UI or Storage API, not SQL
-- Go to Supabase Dashboard → Storage → New Bucket → name: "reports"

SELECT 'Schema fix complete!' as status;
