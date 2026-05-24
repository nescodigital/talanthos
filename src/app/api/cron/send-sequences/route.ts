import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import {
  SequenceName,
  getTemplate,
  getSubject,
  getSequenceStepCount,
  EmailContext,
} from "@/lib/email-sequences";
import { Resend } from "resend";

const CRON_SECRET = process.env.CRON_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * POST /api/cron/send-sequences
 *
 * Triggered by Vercel Cron Jobs (or external cron service).
 * Finds leads due for their next sequence email and sends them.
 *
 * Auth: CRON_SECRET header must match env variable.
 */
export async function POST(req: NextRequest) {
  // ── Auth ──
  const secret = req.headers.get("x-cron-secret") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!CRON_SECRET || !secret || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const results = { sent: 0, skipped: 0, errors: 0, details: [] as string[] };

  try {
    // ── Fetch all active leads with sequences ──
    const { data: leads, error: leadsError } = await supabase
      .from("leads")
      .select("id, email, first_name, primary_type, session_id, email_sequence, email_step, last_email_at, email_sequence_status, marketing_consent")
      .not("email_sequence", "is", null)
      .eq("email_sequence_status", "active")
      .eq("marketing_consent", true);

    if (leadsError) {
      console.error("[CRON] Failed to fetch leads:", leadsError);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ sent: 0, message: "No active leads with sequences" });
    }

    const now = new Date();

    for (const lead of leads) {
      const sequence = lead.email_sequence as SequenceName;
      const step = lead.email_step ?? 0;

      // Validate sequence exists
      const template = getTemplate(sequence, step);
      if (!template) {
        // No more steps — mark completed
        await supabase
          .from("leads")
          .update({ email_sequence_status: "completed" })
          .eq("id", lead.id);
        results.skipped++;
        results.details.push(`${lead.email}: no template for ${sequence} step ${step}, marked completed`);
        continue;
      }

      // Check if due: first email (last_email_at is null, delay=0) or enough time passed
      if (lead.last_email_at) {
        const delayMs = template.delayHours * 60 * 60 * 1000;
        const nextSendTime = new Date(lead.last_email_at).getTime() + delayMs;
        if (now.getTime() < nextSendTime) {
          results.skipped++;
          continue; // Not due yet
        }
      } else if (template.delayHours > 0) {
        // last_email_at is null but delay > 0 — this shouldn't happen for non-first emails,
        // but if it does, skip until manually triggered or delay passes from creation
        results.skipped++;
        continue;
      }

      // ── Build email context ──
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

      // ── Send email ──
      if (!resend) {
        results.errors++;
        results.details.push(`${lead.email}: Resend not configured`);
        continue;
      }

      try {
        const { data, error: sendError } = await resend.emails.send({
          from: "Talanthos <info@talanthos.com>",
          to: [lead.email],
          subject,
          text,
          html,
          headers: {
            "List-Unsubscribe": `<mailto:unsubscribe@talanthos.com?subject=Unsubscribe>, <https://talanthos.com/unsubscribe?email=${encodeURIComponent(lead.email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });

        if (sendError) {
          console.error(`[CRON] Failed to send to ${lead.email}:`, sendError);
          results.errors++;
          results.details.push(`${lead.email}: send failed — ${sendError.message}`);
          continue;
        }

        // ── Update lead ──
        const nextStep = step + 1;
        const totalSteps = getSequenceStepCount(sequence);
        const updates: any = {
          email_step: nextStep,
          last_email_at: now.toISOString(),
        };
        if (nextStep >= totalSteps) {
          updates.email_sequence_status = "completed";
        }

        await supabase.from("leads").update(updates).eq("id", lead.id);

        // ── Log ──
        await supabase.from("email_logs").insert({
          lead_id: lead.id,
          email_to: lead.email,
          email_type: `${sequence}_step_${step}`,
          resend_id: data?.id,
          status: "sent",
        });

        results.sent++;
        results.details.push(`${lead.email}: sent ${sequence} step ${step}`);
      } catch (err: any) {
        console.error(`[CRON] Exception sending to ${lead.email}:`, err);
        results.errors++;
        results.details.push(`${lead.email}: exception — ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (err: any) {
    console.error("[CRON] Fatal error:", err);
    return NextResponse.json({ error: err.message || "Cron failed" }, { status: 500 });
  }
}
