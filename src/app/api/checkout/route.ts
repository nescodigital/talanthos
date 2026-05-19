import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
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
    const email = body.email || "";
    const sessionId = body.session_id || "";

    const unitAmount = amountCents;
    const productName = `Biblical Money Type Report — ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      success_url: `${req.headers.get("origin") || "https://talanthos.com"}/quiz/result?payment=success&type=${encodeURIComponent(type)}`,
      cancel_url: `${req.headers.get("origin") || "https://talanthos.com"}/quiz/paywall?type=${encodeURIComponent(type)}&session=${encodeURIComponent(sessionId)}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: `47-page personalized report tailored to your ${type} archetype.`,
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

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error("[CHECKOUT ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
