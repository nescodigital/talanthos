import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
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
      .select("verification_code, verification_code_expires_at, email")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
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

    if (session.verification_code !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid code. Please try again." },
        { status: 400 }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({ email_verified: true })
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
