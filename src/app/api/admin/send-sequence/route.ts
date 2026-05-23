import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";
import {
  SequenceName,
  getTemplate,
  getSubject,
  EmailContext,
  EMAIL_SEQUENCES,
} from "@/lib/email-sequences";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const body = await req.json();
    const { lead_id, sequence, step }: { lead_id: string; sequence: SequenceName; step: number } = body;

    if (!lead_id || !sequence || step === undefined) {
      return NextResponse.json({ error: "lead_id, sequence, and step are required" }, { status: 400 });
    }

    const template = getTemplate(sequence, step);
    if (!template) {
      return NextResponse.json({ error: "Invalid sequence or step" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("email, first_name, primary_type, session_id")
      .eq("id", lead_id)
      .single();

    if (leadError || !lead?.email) {
      return NextResponse.json({ error: "Lead not found or no email" }, { status: 404 });
    }

    // Get quiz scores if available
    let scores: Record<string, number> | undefined;
    if (lead.session_id) {
      const { data: session } = await supabase
        .from("quiz_sessions")
        .select("builder_score, guardian_score, giver_score, visionary_score")
        .eq("id", lead.session_id)
        .single();
      if (session) {
        scores = {
          builder: session.builder_score ?? 0,
          guardian: session.guardian_score ?? 0,
          give: session.giver_score ?? 0,
          visionary: session.visionary_score ?? 0,
        };
      }
    }

    const ctx: EmailContext = {
      firstName: lead.first_name,
      email: lead.email,
      primaryType: (lead.primary_type as any) || null,
      scores,
      quizUrl: `https://talanthos.com/quiz`,
    };

    const subject = getSubject(template, ctx);
    const text = template.text(ctx);
    const html = template.html(ctx);

    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const { data, error: sendError } = await resend.emails.send({
      from: "Talanthos <info@talanthos.com>",
      to: [lead.email],
      subject,
      text,
      html,
    });

    if (sendError) {
      console.error("[SEND SEQUENCE]", sendError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Update lead tracking
    await supabase
      .from("leads")
      .update({
        email_sequence: sequence,
        email_step: step + 1,
        last_email_at: new Date().toISOString(),
      })
      .eq("id", lead_id);

    // Log email
    await supabase.from("email_logs").insert({
      lead_id,
      email_to: lead.email,
      email_type: `${sequence}_step_${step}`,
      resend_id: data?.id,
      status: "sent",
    });

    return NextResponse.json({ success: true, sentTo: lead.email, subject, resendId: data?.id });
  } catch (err: any) {
    console.error("[SEND SEQUENCE]", err);
    return NextResponse.json({ error: err.message || "Failed to send" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const sequence = searchParams.get("sequence") as SequenceName;

    if (!sequence || !EMAIL_SEQUENCES[sequence]) {
      return NextResponse.json(
        { sequences: Object.keys(EMAIL_SEQUENCES).map((k) => ({ name: k, steps: EMAIL_SEQUENCES[k as SequenceName].length })) }
      );
    }

    const templates = EMAIL_SEQUENCES[sequence].map((t, i) => ({
      step: i,
      delayHours: t.delayHours,
      subjectPreview: typeof t.subject === "string" ? t.subject : "(dynamic)",
    }));

    const delayLabels = EMAIL_SEQUENCES[sequence].map((t) => {
      if (t.delayHours === 0) return "now";
      if (t.delayHours < 24) return `${t.delayHours}h`;
      return `${Math.round(t.delayHours / 24)}d`;
    });

    return NextResponse.json({ sequence, templates, delayLabels });
  } catch (err: any) {
    console.error("[SEQUENCE LIST]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
