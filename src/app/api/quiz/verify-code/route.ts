import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(req: NextRequest) {
  // Rate limiting: max 10 verify attempts per minute per IP
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "verify-check" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { session_id, code } = body;

    if (!session_id || !code) {
      return NextResponse.json(
        { error: "Session ID and code are required" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: session, error: fetchError } = await supabase
      .from("quiz_sessions")
      .select("verification_code, verification_code_expires_at, email, verification_attempts, verification_locked_until")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Check if account is locked
    if (session.verification_locked_until && new Date(session.verification_locked_until) > new Date()) {
      const remainingMs = new Date(session.verification_locked_until).getTime() - Date.now();
      const remainingMin = Math.ceil(remainingMs / 60000);
      return NextResponse.json(
        { error: `Too many failed attempts. Please try again in ${remainingMin} minutes.` },
        { status: 429 }
      );
    }

    if (!session.verification_code || !session.verification_code_expires_at) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date(session.verification_code_expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Code expired. Please request a new one." },
        { status: 400 }
      );
    }

    const currentAttempts = (session.verification_attempts || 0) + 1;

    if (session.verification_code !== String(code).trim()) {
      // Increment attempts
      const updates: any = { verification_attempts: currentAttempts };

      if (currentAttempts >= MAX_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
        updates.verification_locked_until = lockedUntil;
      }

      await supabase
        .from("quiz_sessions")
        .update(updates)
        .eq("id", session_id);

      const remaining = MAX_ATTEMPTS - currentAttempts;
      if (remaining <= 0) {
        return NextResponse.json(
          { error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempts remaining.` },
        { status: 400 }
      );
    }

    // Success: mark as verified and reset attempts
    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({
        email_verified: true,
        verification_attempts: 0,
        verification_locked_until: null,
      })
      .eq("id", session_id);

    if (updateError) {
      console.error("[VERIFY] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, email: session.email });
  } catch (err: any) {
    console.error("[VERIFY] Error:", err);
    return NextResponse.json(
      { error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
