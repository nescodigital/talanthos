import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { Resend } from "resend";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, email } = body;

    if (!session_id || !email) {
      return NextResponse.json(
        { error: "Session ID and email are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@") || email.length > 100) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({
        email,
        verification_code: code,
        verification_code_expires_at: expiresAt,
      })
      .eq("id", session_id);

    if (updateError) {
      console.error("[VERIFY] Supabase update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save verification code" },
        { status: 500 }
      );
    }

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "Talanthos <info@talanthos.com>",
      to: [email],
      subject: "Your Talanthos verification code",
      text: `Hi there,\n\nYour verification code is: ${code}\n\nEnter this code on the Talanthos quiz page to continue.\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.\n\nTalanthos — Faith. Finances. Purpose.`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
          <img src="https://www.talanthos.com/assets/talanthos-logo-full.png" alt="Talanthos" width="160" style="display: block; margin: 0 auto 24px;" />
          <h2 style="font-weight: 400; font-size: 22px; margin: 0 0 16px;">Your Verification Code</h2>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Enter this code on the Talanthos quiz page to continue:</p>
          <div style="background: #efe6d4; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <p style="font-family: monospace; font-size: 32px; letter-spacing: 8px; margin: 0; color: #b88a4a; font-weight: 600;">${code}</p>
          </div>
          <p style="font-size: 13px; color: #7a7359; margin: 0;">This code expires in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 24px 0;">
          <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos · Faith. Finances. Purpose.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[VERIFY] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send code" },
      { status: 500 }
    );
  }
}
