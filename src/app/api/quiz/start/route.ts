import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const startSchema = z.object({
  first_name: z.string().max(50).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  utm_source: z.string().max(100).optional().nullable(),
  utm_medium: z.string().max(100).optional().nullable(),
  utm_campaign: z.string().max(100).optional().nullable(),
  utm_content: z.string().max(100).optional().nullable(),
  utm_term: z.string().max(100).optional().nullable(),
  fbclid: z.string().max(200).optional().nullable(),
  gclid: z.string().max(200).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 20, windowMs: 60_000, keyPrefix: "quiz-start" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = startSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const userAgent = req.headers.get("user-agent") || null;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    const referrer = req.headers.get("referer") || parsed.data.referrer || null;

    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        first_name: parsed.data.first_name || null,
        ip_address: ip,
        user_agent: userAgent,
        referrer,
        utm_source: parsed.data.utm_source || null,
        utm_medium: parsed.data.utm_medium || null,
        utm_campaign: parsed.data.utm_campaign || null,
        utm_content: parsed.data.utm_content || null,
        utm_term: parsed.data.utm_term || null,
        fbclid: parsed.data.fbclid || null,
        gclid: parsed.data.gclid || null,
        status: "started",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[QUIZ START ERROR]", error);
      return NextResponse.json({ error: "Failed to create session", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ session_id: data.id });
  } catch (err) {
    console.error("[QUIZ START ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
