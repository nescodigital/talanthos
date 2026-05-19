-- Quiz Sessions
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
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

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
