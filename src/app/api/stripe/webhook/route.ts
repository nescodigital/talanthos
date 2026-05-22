import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { buildQuizUserData } from "@/lib/pdf/data-builder";
import { generateReportContent } from "@/lib/pdf/content/generate-content";
import { buildReportHtml } from "@/lib/pdf/template/report.html";
import { renderPdf } from "@/lib/pdf/render";
import { Resend } from "resend";
import { TYPE_DATA } from "@/lib/pdf/type-data";

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
    const type = session.metadata?.type || "unknown";

    if (!email) {
      console.error("[STRIPE WEBHOOK] Missing email in session");
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Find order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session.id)
      .single();

    if (orderError) {
      console.error("[STRIPE WEBHOOK] Order lookup error:", orderError.message, "| session:", session.id, "| metadata session_id:", sessionId);
    }

    if (!order) {
      console.error("[STRIPE WEBHOOK] Order not found for session:", session.id, "| metadata session_id:", sessionId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Skip if already processed
    if (order.purchased && order.pdf_generated) {
      return NextResponse.json({ received: true, already_processed: true });
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

    // Generate and deliver PDF
    if (sessionId && !order.pdf_generated) {
      try {
        console.log("[WEBHOOK] Starting PDF generation for session:", sessionId);

        const quizUser = await buildQuizUserData(sessionId);
        if (!quizUser) {
          throw new Error("Quiz user data not found for session: " + sessionId);
        }
        console.log("[WEBHOOK] Quiz user data built:", quizUser.firstName, quizUser.primaryType);

        // Generate content via Claude API
        console.log("[WEBHOOK] Calling Claude API...");
        const content = await generateReportContent(quizUser);
        console.log("[WEBHOOK] Claude content generated, sections:", Object.keys(content).join(", "));

        // Build HTML
        console.log("[WEBHOOK] Building HTML...");
        const html = buildReportHtml(quizUser, content);
        console.log("[WEBHOOK] HTML built, length:", html.length);

        // Render PDF
        console.log("[WEBHOOK] Rendering PDF with Puppeteer...");
        const pdfBuffer = await renderPdf({ html });
        console.log("[WEBHOOK] PDF rendered, size:", pdfBuffer.length);

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
          const td = TYPE_DATA[quizUser.primaryType];
          await resend.emails.send({
            from: "Talanthos <info@talanthos.com>",
            to: [email],
            subject: `Your ${td.name} Report is Ready`,
            text: `Hi ${quizUser.firstName || "there"},\n\nThank you for your purchase. Your personalized ${td.name} report is attached.\n\nYour scores:\nVision: ${quizUser.scores.vision}/7\nGuard: ${quizUser.scores.guard}/7\nGive: ${quizUser.scores.give}/7\nBuild: ${quizUser.scores.build}/7\n\nKey verse: "${td.coverVerse}" — ${td.coverVerseRef}\n\nIn His service,\nTalanthos`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
                <div style="text-align: center; margin-bottom: 24px;"><img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" width="40" height="40" style="display: inline-block; margin-bottom: 8px;" /><div style="font-family: Georgia, serif; font-size: 18px; letter-spacing: 0.2em; color: #1c1a14; text-transform: uppercase;">Talanthos</div><div style="font-family: monospace; font-size: 9px; letter-spacing: 0.14em; color: #b88a4a; text-transform: uppercase; margin-top: 2px;">Faith u00b7 Finances u00b7 Purpose</div></div>
                <h1 style="font-weight: 400; font-size: 28px; margin: 0 0 8px;">Your ${td.name} Report</h1>
                <p style="color: #b88a4a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 20px;">${td.figure} &middot; ${td.tagline}</p>
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi ${quizUser.firstName || "there"},<br><br>Thank you for your purchase. Your personalized ${td.name} report is attached as a PDF.</p>
                <div style="background: #efe6d4; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="font-size: 13px; margin: 0 0 8px; font-weight: 600;">Your 4-Dimensional Score:</p>
                  <p style="font-size: 13px; margin: 0; line-height: 1.6;">
                    Vision: ${quizUser.scores.vision}/7 &middot;
                    Guard: ${quizUser.scores.guard}/7 &middot;
                    Give: ${quizUser.scores.give}/7 &middot;
                    Build: ${quizUser.scores.build}/7
                  </p>
                </div>
                <blockquote style="border-left: 2px solid #b88a4a; padding-left: 16px; margin: 20px 0; font-style: italic; color: #46412f;">
                  "${td.coverVerse}"
                  <br><span style="font-style: normal; font-size: 12px; color: #7a7359;">${td.coverVerseRef}</span>
                </blockquote>
                <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">Your full report is attached as a PDF. Download it, print it, and return to it often.</p>
                <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 24px 0;">
                <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos &middot; Faith. Finances. Purpose.</p>
              </div>
            `,
            attachments: [
              {
                filename: `Talanthos-${td.name.replace(/\s+/g, "")}-Report.pdf`,
                content: pdfBuffer.toString("base64"),
              },
            ],
          });

          await supabase
            .from("orders")
            .update({ pdf_sent_at: new Date().toISOString() })
            .eq("id", order.id);

          console.log("[WEBHOOK] PDF generated and email sent for:", email);
        }
      } catch (err: any) {
        console.error("[STRIPE WEBHOOK] PDF generation failed:");
        console.error("Message:", err?.message || String(err));
        console.error("Stack:", err?.stack || "No stack");
        // Return 500 so Stripe retries
        return NextResponse.json({ error: "PDF generation failed: " + (err?.message || String(err)) }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
