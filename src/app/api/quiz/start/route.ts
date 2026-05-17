import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const userAgent = req.headers.get("user-agent") || null;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    const referrer = req.headers.get("referer") || body.referrer || null;

    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert({
        ip_address: ip,
        user_agent: userAgent,
        referrer,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        utm_content: body.utm_content || null,
        utm_term: body.utm_term || null,
        fbclid: body.fbclid || null,
        gclid: body.gclid || null,
        status: "started",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[QUIZ START ERROR]", error);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({ session_id: data.id });
  } catch (err) {
    console.error("[QUIZ START ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
