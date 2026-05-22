#!/usr/bin/env node
const { createClient } = require("@supabase/supabase-js");
const Stripe = require("stripe");
const crypto = require("crypto");
const fs = require("fs");

const env = {};
for (const line of fs.readFileSync(".env.prod", "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

const TEST_EMAIL = "test" + Date.now() + "@talanthos.com";
const TEST_NAME = "Alex";

async function run() {
  console.log("🧪 Creating real test scenario...\n");

  // 1. Create session
  const { data: session } = await supabase.from("quiz_sessions").insert({
    first_name: TEST_NAME,
    email: TEST_EMAIL,
    email_verified: true,
    primary_type: "builder",
    secondary_type: "guardian",
    visionary_score: 5, guardian_score: 6, giver_score: 4, builder_score: 7,
    demographic_data: { gender: "male", ageRange: "25-34", maritalStatus: "married", hasChildren: true, financialSituation: "stable-but-stressed", biggestRegret: "missed-opportunity", moneyEmotion: "anxious" },
  }).select().single();
  console.log("Session:", session.id);

  // 2. Create lead
  const { data: lead } = await supabase.from("leads").insert({
    session_id: session.id, email: TEST_EMAIL, first_name: TEST_NAME,
    primary_type: "builder", email_verified: true,
  }).select().single();
  console.log("Lead:", lead.id);

  // 3. Create order
  const { data: order } = await supabase.from("orders").insert({
    session_id: session.id, stripe_session_id: "cs_test_webhook_live_" + Date.now(),
    email: TEST_EMAIL, amount_total_cents: 999, currency: "usd", primary_type: "builder",
  }).select().single();
  console.log("Order:", order.id);

  // 4. Build signed payload (simulate Stripe)
  const payload = {
    id: "evt_test_live_" + Date.now(), object: "event", api_version: "2024-12-18.acacia",
    created: Math.floor(Date.now() / 1000), type: "checkout.session.completed",
    data: {
      object: {
        id: order.stripe_session_id, object: "checkout.session", amount_total: 999,
        currency: "usd", customer_email: TEST_EMAIL,
        metadata: { session_id: session.id, type: "builder" },
        payment_status: "paid", status: "complete", payment_intent: "pi_test_123",
        customer: null,
      },
    },
  };

  const payloadString = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payloadString}`;
  const signature = crypto.createHmac("sha256", env.STRIPE_WEBHOOK_SECRET).update(signedPayload).digest("hex");
  const stripeSignature = `t=${timestamp},v1=${signature}`;

  // 5. Send webhook
  console.log("\n📤 Sending webhook to production...");
  const start = Date.now();
  const res = await fetch("https://www.talanthos.com/api/stripe/webhook", {
    method: "POST", headers: { "Content-Type": "application/json", "Stripe-Signature": stripeSignature },
    body: payloadString,
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const body = await res.text();
  console.log(`📬 Status: ${res.status} | Time: ${elapsed}s`);
  console.log(`📄 Body: ${body.slice(0, 800)}`);

  // Cleanup
  await supabase.from("orders").delete().eq("id", order.id);
  await supabase.from("leads").delete().eq("id", lead.id);
  await supabase.from("quiz_sessions").delete().eq("id", session.id);
  console.log("\n✅ Cleaned up");
}

run().catch(err => { console.error("💥", err.message); process.exit(1); });
