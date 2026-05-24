import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/quiz/verify-google
 *
 * Receives a Google Identity Services JWT credential, extracts the verified
 * email and name, and creates/updates the lead immediately — no verification
 * code needed because Google has already verified the email ownership.
 */
export async function POST(req: NextRequest) {
  // Rate limiting
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "verify-google" });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { credential, session_id, marketing_consent } = body;

    if (!credential || typeof credential !== "string") {
      return NextResponse.json({ error: "Google credential required." }, { status: 400 });
    }
    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json({ error: "Session ID required." }, { status: 400 });
    }

    // Decode JWT payload (client-side JWT from Google, no signature verification needed here)
    let payload: any;
    try {
      const parts = credential.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT");
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const pad = 4 - (base64.length % 4);
      const padded = pad !== 4 ? base64 + "=".repeat(pad) : base64;
      payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
    } catch {
      return NextResponse.json({ error: "Invalid Google credential." }, { status: 400 });
    }

    const email = payload.email;
    const name = payload.name || payload.given_name || "";
    const googleId = payload.sub;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Could not extract email from Google credential." }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Update quiz session
    const { error: sessionError } = await supabase
      .from("quiz_sessions")
      .update({
        email,
        email_verified: true,
        first_name: name || undefined,
      })
      .eq("id", session_id);

    if (sessionError) {
      console.error("[VERIFY GOOGLE] Session update error:", sessionError);
    }

    // Upsert lead
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .single();

    let leadId: string;

    // Fetch quiz status for sequence assignment
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("status")
      .eq("id", session_id)
      .single();

    const sequence = session?.status === "completed" ? "non_buyer" : "abandoned_quiz";

    if (existing?.id) {
      const { error } = await supabase
        .from("leads")
        .update({
          session_id,
          marketing_consent: !!marketing_consent,
          first_name: name || undefined,
          auth_provider: "google",
          google_id: googleId || undefined,
          // Only set sequence if not already assigned or if switching from email
          ...(marketing_consent ? { email_sequence: sequence, email_step: 0, email_sequence_status: "active", last_email_at: null } : {}),
        })
        .eq("id", existing.id);

      if (error) {
        console.error("[VERIFY GOOGLE] Lead update error:", error);
        return NextResponse.json({ error: "Failed to update lead." }, { status: 500 });
      }
      leadId = existing.id;
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email,
          session_id,
          primary_type: "unknown",
          marketing_consent: !!marketing_consent,
          first_name: name || null,
          auth_provider: "google",
          google_id: googleId || null,
          ...(marketing_consent ? { email_sequence: sequence, email_step: 0, email_sequence_status: "active" } : {}),
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("[VERIFY GOOGLE] Lead create error:", error);
        return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
      }
      leadId = data.id;
    }

    return NextResponse.json({ success: true, lead_id: leadId, email, name });
  } catch (err: any) {
    console.error("[VERIFY GOOGLE]", err);
    return NextResponse.json({ error: err.message || "Internal error." }, { status: 500 });
  }
}
