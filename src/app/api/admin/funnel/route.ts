import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get("days") || "30")));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: quizStarted },
      { count: emailSubscribed },
      { count: quizCompleted },
      { count: paywallReached },
      { count: purchasesCount },
    ] = await Promise.all([
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).not("email", "is", null).gte("created_at", since),
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).eq("status", "completed").gte("created_at", since),
      supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("purchased", true).gte("created_at", since),
    ]);

    const qs = quizStarted || 0;
    const es = emailSubscribed || 0;
    const qc = quizCompleted || 0;
    const pw = paywallReached || 0;
    const pr = purchasesCount || 0;

    const rates = {
      startToEmail: qs > 0 ? (es / qs) * 100 : 0,
      emailToComplete: es > 0 ? (qc / es) * 100 : 0,
      completeToPaywall: qc > 0 ? (pw / qc) * 100 : 0,
      paywallToPurchase: pw > 0 ? (pr / pw) * 100 : 0,
    };

    return NextResponse.json({
      quizStarted: qs,
      emailSubscribed: es,
      quizCompleted: qc,
      paywallReached: pw,
      purchases: pr,
      rates: {
        startToEmail: Number(rates.startToEmail.toFixed(1)),
        emailToComplete: Number(rates.emailToComplete.toFixed(1)),
        completeToPaywall: Number(rates.completeToPaywall.toFixed(1)),
        paywallToPurchase: Number(rates.paywallToPurchase.toFixed(1)),
      },
      targets: {
        startToEmail: { min: 95, max: 100 },
        emailToComplete: { min: 50, max: 70 },
        completeToPaywall: { min: 40, max: 60 },
        paywallToPurchase: { min: 3, max: 8 },
      },
    });
  } catch (err) {
    console.error("[ADMIN FUNNEL]", err);
    return NextResponse.json({ error: "Failed to fetch funnel" }, { status: 500 });
  }
}
