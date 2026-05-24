import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const leadSchema = z.object({
  email: z.string().email().max(100),
  primary_type: z.enum(["builder", "guardian", "giver", "visionary", "unknown"]).optional().default("unknown"),
  session_id: z.string().uuid(),
  marketing_consent: z.boolean(),
  first_name: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const limit = rateLimit(req, { max: 10, windowMs: 60_000, keyPrefix: "leads" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", parsed.data.email)
      .single();

    let leadId: string;

    if (existing?.id) {
      const { error } = await supabase
        .from("leads")
        .update({
          primary_type: parsed.data.primary_type === "unknown" ? undefined : parsed.data.primary_type,
          session_id: parsed.data.session_id,
          marketing_consent: parsed.data.marketing_consent,
          first_name: parsed.data.first_name || null,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("[LEAD UPDATE ERROR]", error);
        return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
      }

      leadId = existing.id;
      console.log(`[LEAD UPDATED] ${parsed.data.email} → ${parsed.data.primary_type}`);
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email: parsed.data.email,
          primary_type: parsed.data.primary_type,
          session_id: parsed.data.session_id,
          marketing_consent: parsed.data.marketing_consent,
          first_name: parsed.data.first_name || null,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("[LEAD CREATE ERROR]", error);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
      }

      leadId = data.id;
      console.log(`[LEAD CREATED] ${parsed.data.email} → ${parsed.data.primary_type}`);
    }

    // ── Auto-assign email sequence based on quiz status ──
    if (parsed.data.marketing_consent) {
      try {
        const { data: session } = await supabase
          .from("quiz_sessions")
          .select("status")
          .eq("id", parsed.data.session_id)
          .single();

        const sequence = session?.status === "completed" ? "non_buyer" : "abandoned_quiz";

        await supabase
          .from("leads")
          .update({
            email_sequence: sequence,
            email_step: 0,
            email_sequence_status: "active",
            last_email_at: null,
          })
          .eq("id", leadId);

        console.log(`[LEAD SEQUENCE] ${parsed.data.email} → ${sequence}`);
      } catch (seqErr) {
        console.error("[LEAD SEQUENCE ERROR]", seqErr);
      }
    }

    if (resend) {
      try {
        await resend.emails.send({
        from: "Talanthos <info@talanthos.com>",
        to: [parsed.data.email],
        subject: "Your Biblical Money Type report is on its way",
        text: `Hi there,\n\nThank you for taking the Talanthos Biblical Money Type assessment.\n\nWe have received your request and your personalized report will be sent to this address shortly.\n\nIn His service,\nTalanthos`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
            <div style="text-align: center; margin-bottom: 24px;"><img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" width="40" height="40" style="display: inline-block; margin-bottom: 8px;" /><div style="font-family: Georgia, serif; font-size: 18px; letter-spacing: 0.2em; color: #1c1a14; text-transform: uppercase;">Talanthos</div><div style="font-family: monospace; font-size: 9px; letter-spacing: 0.14em; color: #b88a4a; text-transform: uppercase; margin-top: 2px;">Faith &middot; Finances &middot; Purpose</div></div>
            <h1 style="font-weight: 400; font-size: 24px; margin: 0 0 16px;">Thank you</h1>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
              Thank you for taking the Talanthos Biblical Money Type assessment.
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
              We have received your request and your personalized report will be sent to this address shortly.
            </p>
            <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 24px 0;">
            <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos · Faith. Finances. Purpose.</p>
          </div>
        `,
      });
      } catch (emailErr) {
        console.error("[LEAD EMAIL ERROR]", emailErr);
      }
    }

    return NextResponse.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error("[LEAD CREATE ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
