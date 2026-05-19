import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { buildReportData } from "@/lib/pdf/data-builder";
import { renderReportHtml } from "@/lib/pdf/templates/report-template";
import { generatePdf } from "@/lib/pdf/generator";
import { Resend } from "resend";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
      return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });
    }
    event = getStripe().webhooks.constructEvent(payload, sig, stripeWebhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("[STRIPE WEBHOOK] Signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.metadata?.session_id;
    const email = session.customer_email || session.customer_details?.email;

    if (!sessionId || !email) {
      console.error("[STRIPE WEBHOOK] Missing session_id or email in metadata");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Find order
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session.id)
      .single();

    if (!order) {
      console.error("[STRIPE WEBHOOK] Order not found for session:", session.id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order as purchased
    await supabase
      .from("orders")
      .update({
        purchased: true,
        purchased_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
      })
      .eq("id", order.id);

    // Generate PDF
    try {
      const reportData = await buildReportData(sessionId);
      if (!reportData) {
        throw new Error("Report data not found");
      }

      const html = renderReportHtml(reportData);
      const pdfBuffer = await generatePdf({ html, sessionId });

      // Upload to Supabase Storage
      const fileName = `${sessionId}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(fileName, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("[PDF UPLOAD ERROR]", uploadError);
      }

      const { data: urlData } = supabase.storage.from("reports").getPublicUrl(fileName);
      const pdfUrl = urlData?.publicUrl || "";

      await supabase
        .from("orders")
        .update({
          pdf_generated: true,
          pdf_url: pdfUrl,
        })
        .eq("id", order.id);

      // Send email with PDF
      const resend = getResend();
      if (resend) {
        const t = reportData.primaryTypeData;
        await resend.emails.send({
          from: "Talanthos <info@talanthos.com>",
          to: [email],
          subject: `Your ${t.label} Report is Ready`,
          text: `Hi ${reportData.firstName || "there"},\n\nThank you for your purchase. Your personalized ${t.label} report is attached.\n\n${t.blurb}\n\nYour scores:\nVision: ${reportData.scores.visionary}/7\nGuard: ${reportData.scores.guardian}/7\nGive: ${reportData.scores.giver}/7\nBuild: ${reportData.scores.builder}/7\n\nKey verse: "${t.verse.text}" — ${t.verse.ref}\n\nIn His service,\nTalanthos`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
              <h1 style="font-weight: 400; font-size: 28px; margin: 0 0 8px;">Your ${t.label} Report</h1>
              <p style="color: #b88a4a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 20px;">${t.figure} &middot; ${t.tagline}</p>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">${t.blurb}</p>
              <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 13px; margin: 0 0 8px; font-weight: 600;">Your 4-Dimensional Score:</p>
                <p style="font-size: 13px; margin: 0; line-height: 1.6;">
                  Vision: ${reportData.scores.visionary}/7 &middot; 
                  Guard: ${reportData.scores.guardian}/7 &middot; 
                  Give: ${reportData.scores.giver}/7 &middot; 
                  Build: ${reportData.scores.builder}/7
                </p>
              </div>
              <blockquote style="border-left: 2px solid #b88a4a; padding-left: 16px; margin: 20px 0; font-style: italic; color: #46412f;">
                "${t.verse.text}"
                <br><span style="font-style: normal; font-size: 12px; color: #7a7359;">${t.verse.ref}</span>
              </blockquote>
              <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Your full report is attached as a PDF. Download it, print it, and return to it often.</p>
              <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 24px 0;">
              <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos &middot; Faith. Finances. Purpose.</p>
            </div>
          `,
          attachments: [
            {
              filename: `Talanthos-${t.label.replace(/\s+/g, "")}-Report.pdf`,
              content: pdfBuffer.toString("base64"),
            },
          ],
        });

        await supabase
          .from("orders")
          .update({ pdf_sent_at: new Date().toISOString() })
          .eq("id", order.id);
      }
    } catch (err) {
      console.error("[STRIPE WEBHOOK] PDF generation failed:", err);
      // Don't fail the webhook — Stripe will retry
      return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
