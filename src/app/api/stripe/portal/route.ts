import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const portalSchema = z.object({
  email: z.string().email(),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "stripe-portal" });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: z.infer<typeof portalSchema>;
  try {
    const raw = await req.json();
    const parsed = portalSchema.safeParse(raw);
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

  const supabase = getServiceRoleClient();
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://talanthos.com";

  try {
    // Find subscription by email
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("email", body.email)
      .in("status", ["trialing", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${appUrl}/ask`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[STRIPE PORTAL ERROR]", err);
    return NextResponse.json(
      { error: err.message || "Portal creation failed" },
      { status: 500 }
    );
  }
}
