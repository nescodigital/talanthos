import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "checkout" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe not configured. Add STRIPE_SECRET_KEY to environment." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-04-22.dahlia",
    });

    const body = await req.json();
    const amountCents = Math.max(999, Math.min(99999, body.amount || 1499));
    const type = body.type || "unknown";
    const sessionId = body.session_id || "";
    const promoCode = body.promoCode || "";

    const supabase = getServiceRoleClient();

    // Find lead email from session
    let email = "";
    if (sessionId) {
      const { data: lead } = await supabase
        .from("leads")
        .select("email")
        .eq("session_id", sessionId)
        .single();
      if (lead?.email) email = lead.email;
    }

    // Apply promo code discount if valid
    let finalAmountCents = amountCents;
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("discount_percent, max_uses, used_count")
        .eq("code", promoCode.toUpperCase())
        .single();
      if (promo && (promo.max_uses === null || promo.used_count < promo.max_uses)) {
        finalAmountCents = Math.round(amountCents * (1 - promo.discount_percent / 100));
      }
    }

    const unitAmount = finalAmountCents;
    const productName = `Biblical Money Type Report — ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      ui_mode: "embedded",
      return_url: `${req.headers.get("origin") || "https://talanthos.com"}/quiz/thank-you?type=${encodeURIComponent(type)}&session_id=${encodeURIComponent(sessionId)}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: `20-page personalized report tailored to your ${type} archetype.`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type,
        session_id: sessionId,
        amount_cents: String(unitAmount),
        original_amount_cents: String(amountCents),
      },
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: "Thank you for supporting our mission.",
        },
      },
    };

    if (email) {
      sessionConfig.customer_email = email;
    }

    const stripeSession = await stripe.checkout.sessions.create(sessionConfig);

    // Create order record
    const { error: insertError } = await supabase.from("orders").insert({
      session_id: sessionId || null,
      stripe_session_id: stripeSession.id,
      email: email || "pending",
      amount_total_cents: unitAmount,
      currency: "usd",
      primary_type: type,
    });

    if (insertError) {
      console.error("[CHECKOUT] Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create order: " + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ clientSecret: stripeSession.client_secret, id: stripeSession.id });
  } catch (err: any) {
    console.error("[CHECKOUT ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
