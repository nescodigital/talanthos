-- Quiz Sessions
CREATE TABLE quiz_sessions (
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
  status TEXT DEFAULT 'started'
);

CREATE INDEX idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_created ON quiz_sessions(created_at DESC);
CREATE INDEX idx_quiz_sessions_utm ON quiz_sessions(utm_source, utm_campaign);

CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_id TEXT NOT NULL,
  answer_letter TEXT,
  answer_value TEXT NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_seconds INT
);

CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id);

CREATE TABLE leads (
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

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_type ON leads(primary_type);

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

-- Landing views (funnel tracking)
CREATE TABLE landing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_landing_views_created ON landing_views(created_at DESC);

CREATE TABLE ask_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  email TEXT,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  is_money_related BOOLEAN DEFAULT FALSE,
  contextual_push_shown BOOLEAN DEFAULT FALSE,
  tokens_input INT,
  tokens_output INT,
  cost_cents NUMERIC(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ask_conversations_session ON ask_conversations(session_id);
CREATE INDEX idx_ask_conversations_email ON ask_conversations(email);
CREATE INDEX idx_ask_conversations_created ON ask_conversations(created_at DESC);

CREATE TABLE ask_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  session_id UUID,
  ip_address TEXT,
  questions_today INT DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  questions_this_month INT DEFAULT 0,
  month_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cost_this_month_cents NUMERIC(10,4) DEFAULT 0,
  total_questions_ever INT DEFAULT 0,
  suspended BOOLEAN DEFAULT FALSE,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspended_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ask_rate_limits_email ON ask_rate_limits(email);
CREATE INDEX idx_ask_rate_limits_session ON ask_rate_limits(session_id);
CREATE INDEX idx_ask_rate_limits_ip ON ask_rate_limits(ip_address);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_rate_limits ENABLE ROW LEVEL SECURITY;

-- Email verification columns (added May 2026)
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS verification_code TEXT;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- Security columns (added May 2026)
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS verification_attempts INT DEFAULT 0;
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS verification_locked_until TIMESTAMP WITH TIME ZONE;

-- Email sequence tracking (added May 2026)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_sequence TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_step INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_sequence_status TEXT DEFAULT 'active';

-- Auth provider tracking (added May 2026)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS google_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_auth_provider ON leads(auth_provider);
CREATE INDEX IF NOT EXISTS idx_leads_google_id ON leads(google_id);

-- Contact messages (added May 2026)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  resend_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Subscriptions (added June 2026)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  questions_this_month INT DEFAULT 0,
  month_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cost_this_month_cents NUMERIC(10,4) DEFAULT 0,
  suspended BOOLEAN DEFAULT FALSE,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspended_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lead ON subscriptions(lead_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Orders subscription tracking (added June 2026)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE;

-- Leads Stripe customer tracking (added June 2026)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
