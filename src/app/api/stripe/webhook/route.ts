import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import Stripe from "stripe";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { buildQuizUserData } from "@/lib/pdf/data-builder";
import { generateReportContent } from "@/lib/pdf/content/generate-content";
import { buildReportHtml } from "@/lib/pdf/template/report.html";
import { renderPdf } from "@/lib/pdf/render";
import { Resend } from "resend";
import { TYPE_DATA } from "@/lib/pdf/type-data";
import { sendServerSideCapiEvent } from "@/lib/meta-capi-server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://talanthos.com";
}

const FROM = "Talanthos <info@talanthos.com>";

function emailWrapper(content: string) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" width="40" height="40" style="display: inline-block; margin-bottom: 8px;" />
        <div style="font-family: Georgia, serif; font-size: 18px; letter-spacing: 0.2em; color: #1c1a14; text-transform: uppercase;">Talanthos</div>
        <div style="font-family: monospace; font-size: 9px; letter-spacing: 0.14em; color: #b88a4a; text-transform: uppercase; margin-top: 2px;">Faith &middot; Finances &middot; Purpose</div>
      </div>
      ${content}
      <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 24px 0;">
      <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos &middot; Faith. Finances. Purpose.</p>
    </div>
  `;
}

async function createPortalUrl(stripeCustomerId: string): Promise<string> {
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getAppUrl()}/ask`,
    });
    return session.url;
  } catch (e) {
    console.error("[STRIPE WEBHOOK] Failed to create portal session:", e);
    return `${getAppUrl()}/ask`;
  }
}

async function sendOrderConfirmationEmail(
  to: string,
  firstName: string,
  pdfBuffer: Buffer,
  typeName: string,
  portalUrl: string
) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Your Talanthos Reading is ready, ${firstName}`,
    text: `Hi ${firstName},\n\nYour personalized Biblical Money Type reading is ready.\n\nYou also have 7 days free of Talanthos Companion — your AI guide for biblical money questions. Visit talanthos.com/ask to start.\n\nAfter 7 days, Companion continues at $9/month. Cancel anytime: ${portalUrl}\n\nIn His service,\nTalanthos`,
    html: emailWrapper(`
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Hi ${firstName},<br><br>Your personalized Biblical Money Type reading is ready.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://talanthos.com/ask" style="display: inline-block; background: #b88a4a; color: #fff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; font-weight: 500;">Download your reading</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">You also have <strong>7 days free</strong> of Talanthos Companion — your AI guide for biblical money questions. Visit <a href="https://talanthos.com/ask" style="color: #b88a4a;">talanthos.com/ask</a> to start.</p>
      <p style="font-size: 13px; color: #7a7359; line-height: 1.5; margin: 0;">After 7 days, Companion continues at $9/month. Cancel anytime: <a href="${portalUrl}" style="color: #b88a4a;">${portalUrl}</a>. Your subscription is fully transparent — see all charges in your portal.</p>
    `),
    attachments: [
      {
        filename: `Talanthos-${typeName.replace(/\s+/g, "")}-Report.pdf`,
        content: pdfBuffer.toString("base64"),
      },
    ],
  });
}

async function sendTrialEndingEmail(to: string, trialEndDate: string, portalUrl: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Your Companion trial ends in 3 days",
    text: `Your 7-day Companion trial is ending. After ${trialEndDate}, $9/month will be charged unless you cancel.\n\nContinue or cancel anytime: ${portalUrl}\n\nHave you used Companion yet? Try asking it about debt, generosity, or any Scripture question.`,
    html: emailWrapper(`
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Your 7-day Companion trial is ending. After <strong>${trialEndDate}</strong>, $9/month will be charged unless you cancel.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background: #b88a4a; color: #fff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; font-weight: 500;">Manage subscription</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6; margin: 0;">Have you used Companion yet? Try asking it about debt, generosity, or any Scripture question.</p>
    `),
  });
}

async function sendSubscriptionWelcomeEmail(to: string, portalUrl: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Welcome to Talanthos Companion",
    text: `Your Companion subscription is active. $9/month, 50 questions/month, cancel anytime.\n\nManage subscription: ${portalUrl}`,
    html: emailWrapper(`
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Your Companion subscription is active.</p>
      <ul style="font-size: 15px; line-height: 1.6; margin: 0 0 20px; padding-left: 20px;">
        <li>$9/month</li>
        <li>50 questions/month</li>
        <li>Cancel anytime</li>
      </ul>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background: #b88a4a; color: #fff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; font-weight: 500;">Manage subscription</a>
      </div>
    `),
  });
}

async function sendPaymentFailedEmail(to: string, portalUrl: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Update your payment for Talanthos Companion",
    text: `We weren't able to charge your card. Please update payment to keep your Companion access:\n${portalUrl}`,
    html: emailWrapper(`
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px;">We weren't able to charge your card. Please update payment to keep your Companion access.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background: #b88a4a; color: #fff; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-size: 15px; font-weight: 500;">Update payment</a>
      </div>
    `),
  });
}

async function processPdf(orderId: string, sessionId: string, email: string) {
  console.log("[PDF AFTER] Starting async PDF generation for order:", orderId, "session:", sessionId);
  const supabase = getServiceRoleClient();

  try {
    const { data: orderCheck } = await supabase
      .from("orders")
      .select("pdf_generated")
      .eq("id", orderId)
      .single();

    if (orderCheck?.pdf_generated) {
      console.log("[PDF AFTER] Already processed, skipping");
      return;
    }

    const quizUser = await buildQuizUserData(sessionId);
    if (!quizUser) {
      throw new Error("Quiz user data not found for session: " + sessionId);
    }
    console.log("[PDF AFTER] Quiz user data built:", quizUser.firstName, quizUser.primaryType);

    console.log("[PDF AFTER] Calling Claude API...");
    const content = await generateReportContent(quizUser);
    console.log("[PDF AFTER] Claude content generated, sections:", Object.keys(content).join(", "));

    console.log("[PDF AFTER] Building HTML...");
    const html = buildReportHtml(quizUser, content);
    console.log("[PDF AFTER] HTML built, length:", html.length);

    console.log("[PDF AFTER] Rendering PDF with Puppeteer...");
    const pdfBuffer = await renderPdf({ html });
    console.log("[PDF AFTER] PDF rendered, size:", pdfBuffer.length);

    const fileName = `${sessionId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("[PDF AFTER UPLOAD ERROR]", uploadError);
    }

    const { data: urlData } = supabase.storage.from("reports").getPublicUrl(fileName);
    const pdfUrl = urlData?.publicUrl || "";

    await supabase
      .from("orders")
      .update({
        pdf_generated: true,
        pdf_url: pdfUrl,
      })
      .eq("id", orderId);

    // Send order confirmation email with PDF + Companion info
    const td = TYPE_DATA[quizUser.primaryType];
    const portalUrl = await createPortalUrl(
      (await supabase.from("orders").select("stripe_customer_id").eq("id", orderId).single()).data?.stripe_customer_id || ""
    );

    await sendOrderConfirmationEmail(
      email,
      quizUser.firstName || "there",
      pdfBuffer,
      td.name,
      portalUrl
    );

    await supabase
      .from("orders")
      .update({ pdf_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    console.log("[PDF AFTER] PDF generated and email sent for:", email);
  } catch (err: any) {
    console.error("[PDF AFTER] Failed:", err?.message || String(err));
    console.error("[PDF AFTER] Stack:", err?.stack || "No stack");
  }
}

// ── Event handlers ──

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const supabase = getServiceRoleClient();
  const stripe = getStripe();
  const sessionId = session.metadata?.sessionId;
  const email = session.customer_email || session.customer_details?.email;
  const primaryType = session.metadata?.primaryType || "unknown";

  if (!email) {
    console.error("[STRIPE WEBHOOK] Missing email in session");
    return;
  }

  // Find or create lead
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email)
    .single();

  let leadId = lead?.id;
  if (!leadId) {
    const { data: newLead } = await supabase
      .from("leads")
      .insert({ email, primary_type: primaryType, session_id: sessionId || null })
      .select()
      .single();
    leadId = newLead?.id;
  }

  // Update lead purchased status
  if (leadId) {
    await supabase
      .from("leads")
      .update({ purchased: true, purchased_at: new Date().toISOString() })
      .eq("id", leadId);
  }

  // Find or create order
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", session.id)
    .single();

  let orderId: string;
  if (existingOrder) {
    orderId = existingOrder.id;
    // Skip if already fully processed
    if (existingOrder.purchased && existingOrder.pdf_generated) {
      console.log("[STRIPE WEBHOOK] Order already processed:", orderId);
      return;
    }
  } else {
    const { data: newOrder } = await supabase
      .from("orders")
      .insert({
        lead_id: leadId || null,
        session_id: sessionId || null,
        stripe_session_id: session.id,
        stripe_customer_id: (session.customer as string) || null,
        email,
        amount_total_cents: session.amount_total || 1900,
        currency: session.currency || "usd",
        primary_type: primaryType,
        purchased: true,
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single();
    orderId = newOrder?.id;
    if (!orderId) {
      console.error("[STRIPE WEBHOOK] Failed to create order");
      return;
    }
  }

  // Update order as purchased
  await supabase
    .from("orders")
    .update({
      purchased: true,
      purchased_at: new Date().toISOString(),
      stripe_payment_intent_id: (session.payment_intent as string) || null,
      stripe_customer_id: (session.customer as string) || null,
    })
    .eq("id", orderId);

  // Handle subscription (if bundled)
  const subscriptionId = session.subscription as string | undefined;
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .single();

    if (!existingSub) {
      await supabase.from("subscriptions").insert({
        lead_id: leadId || null,
        email,
        stripe_customer_id: (session.customer as string) || "",
        stripe_subscription_id: subscriptionId,
        stripe_price_id: subscription.items.data[0]?.price.id || "",
        status: subscription.status,
        trial_start: subscription.trial_start ? new Date((subscription as any).trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
        current_period_start: (subscription as any).current_period_start ? new Date((subscription as any).current_period_start * 1000).toISOString() : null,
        current_period_end: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
      });
    }

    // Update order with subscription id
    await supabase
      .from("orders")
      .update({
        stripe_subscription_id: subscriptionId,
        subscription_active: ["trialing", "active"].includes(subscription.status),
      })
      .eq("id", orderId);
  }

  // Send Meta CAPI Purchase event
  try {
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    await sendServerSideCapiEvent({
      eventName: "Purchase",
      eventId: `purchase_${session.id}_${Date.now()}`,
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: "https://talanthos.com/quiz/thank-you",
      userData: {
        email: email || undefined,
        externalId: sessionId || undefined,
      },
      customData: {
        value: amount,
        currency: session.currency?.toUpperCase() || "USD",
        content_ids: [primaryType],
        content_name: "Talanthos Report + Companion",
        content_type: "product",
        order_id: orderId,
        stripe_session_id: session.id,
      },
    });
  } catch (capiErr) {
    console.error("[STRIPE WEBHOOK] CAPI Purchase error:", capiErr);
  }

  // Switch lead to advocate sequence
  try {
    if (leadId) {
      await supabase
        .from("leads")
        .update({
          email_sequence: "advocate",
          email_step: 0,
          email_sequence_status: "active",
          last_email_at: null,
        })
        .eq("id", leadId);
    }
  } catch (leadErr) {
    console.error("[STRIPE WEBHOOK] Failed to update lead sequence:", leadErr);
  }

  // Process PDF asynchronously
  if (sessionId && orderId) {
    after(async () => {
      await processPdf(orderId, sessionId, email);
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getServiceRoleClient();
  const stripeCustomerId = subscription.customer as string;
  const subAny = subscription as any;

  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("id, email, status")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!subRow) {
    console.error("[STRIPE WEBHOOK] Subscription not found:", subscription.id);
    return;
  }

  const previousStatus = subRow.status;

  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: subAny.current_period_start ? new Date(subAny.current_period_start * 1000).toISOString() : null,
      current_period_end: subAny.current_period_end ? new Date(subAny.current_period_end * 1000).toISOString() : null,
      trial_end: subAny.trial_end ? new Date(subAny.trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", subRow.id);

  // Update orders subscription_active
  await supabase
    .from("orders")
    .update({ subscription_active: ["trialing", "active"].includes(subscription.status) })
    .eq("stripe_subscription_id", subscription.id);

  // Trial converted to paid
  if (previousStatus === "trialing" && subscription.status === "active") {
    const portalUrl = await createPortalUrl(stripeCustomerId);
    await sendSubscriptionWelcomeEmail(subRow.email, portalUrl);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getServiceRoleClient();
  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  await supabase
    .from("orders")
    .update({ subscription_active: false })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const supabase = getServiceRoleClient();
  const subAny = subscription as any;
  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("email, stripe_customer_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!subRow) return;

  const trialEnd = subAny.trial_end
    ? new Date(subAny.trial_end * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "soon";

  const portalUrl = await createPortalUrl(subRow.stripe_customer_id);
  await sendTrialEndingEmail(subRow.email, trialEnd, portalUrl);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = getServiceRoleClient();
  const stripeCustomerId = invoice.customer as string;

  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("email")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (!subRow) return;

  const portalUrl = await createPortalUrl(stripeCustomerId);
  await sendPaymentFailedEmail(subRow.email, portalUrl);
}

// ── Main handler ──

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

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log("[STRIPE WEBHOOK] Unhandled event:", event.type);
    }
  } catch (handlerErr: any) {
    console.error("[STRIPE WEBHOOK] Handler error:", handlerErr?.message || String(handlerErr));
    // Always return 200 to Stripe so it doesn't retry indefinitely
  }

  return NextResponse.json({ received: true });
}
