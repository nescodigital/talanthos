export interface QuizSession {
  id: string;
  created_at: string;
  completed_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  gclid: string | null;
  device_type: string | null;
  country: string | null;
  primary_type: string | null;
  secondary_type: string | null;
  builder_score: number | null;
  guardian_score: number | null;
  giver_score: number | null;
  visionary_score: number | null;
  status: string;
}

export interface QuizAnswer {
  id: string;
  session_id: string;
  question_number: number;
  answer_letter: string;
  answered_at: string;
  time_spent_seconds: number | null;
}

export interface Lead {
  id: string;
  session_id: string | null;
  email: string;
  first_name: string | null;
  primary_type: string;
  created_at: string;
  email_verified: boolean;
  marketing_consent: boolean;
  paywall_viewed: boolean;
  paywall_viewed_at: string | null;
  checkout_started: boolean;
  checkout_started_at: string | null;
  purchased: boolean;
  purchased_at: string | null;
}

export interface Order {
  id: string;
  lead_id: string | null;
  session_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  email: string;
  amount_total_cents: number;
  currency: string;
  product_main: boolean;
  upsell_1_purchased: boolean;
  upsell_2_purchased: boolean;
  upsell_3_purchased: boolean;
  primary_type: string;
  pdf_generated: boolean;
  pdf_url: string | null;
  pdf_sent_at: string | null;
  refunded: boolean;
  refunded_at: string | null;
  created_at: string;
}

export interface PixelEvent {
  id: string;
  session_id: string | null;
  event_name: string;
  event_value_cents: number | null;
  fbp: string | null;
  fbc: string | null;
  external_id: string | null;
  sent_to_pixel: boolean;
  sent_to_capi: boolean;
  capi_response: Record<string, unknown> | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  lead_id: string | null;
  order_id: string | null;
  email_to: string;
  email_type: string;
  resend_id: string | null;
  status: string;
  sent_at: string;
}
