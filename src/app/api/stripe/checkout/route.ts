import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  email: z.string().email(),
  primaryType: z.enum(["visionary", "guardian", "giver", "builder"]),
  sessionId: z.string().uuid(),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "stripe-checkout" });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: z.infer<typeof checkoutSchema>;
  try {
    const raw = await req.json();
    const parsed = checkoutSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const stripe = getStripe();
  const supabase = getServiceRoleClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://talanthos.com";
  const pdfPriceId = process.env.STRIPE_PRICE_PDF;
  const companionPriceId = process.env.STRIPE_PRICE_COMPANION;

  if (!pdfPriceId || !companionPriceId) {
    return NextResponse.json(
      { error: "Stripe prices not configured" },
      { status: 500 }
    );
  }

  try {
    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: body.email, limit: 1 });
    let customerId = customers.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: body.email });
      customerId = customer.id;
    }

    // Create lead if not exists (idempotent)
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", body.email)
      .single();

    if (!existingLead) {
      await supabase.from("leads").insert({
        email: body.email,
        primary_type: body.primaryType,
        session_id: body.sessionId,
        stripe_customer_id: customerId,
      });
    } else {
      await supabase
        .from("leads")
        .update({ stripe_customer_id: customerId, purchased: true })
        .eq("id", existingLead.id);
    }

    // Create order record (pre-purchase)
    const { error: orderError } = await supabase.from("orders").insert({
      session_id: body.sessionId,
      email: body.email,
      primary_type: body.primaryType,
      amount_total_cents: 1900,
      currency: "usd",
      purchased: false,
    });

    if (orderError) {
      console.error("[STRIPE CHECKOUT] Order insert error:", orderError);
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        { price: pdfPriceId, quantity: 1 },
        { price: companionPriceId, quantity: 1 },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      metadata: {
        email: body.email,
        primaryType: body.primaryType,
        sessionId: body.sessionId,
      },
      client_reference_id: body.sessionId,
      success_url: `${appUrl}/quiz/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/quiz/paywall`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[STRIPE CHECKOUT ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
