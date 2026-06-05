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
      { count: landingViews },
      { count: quizStarts },
      { count: quizCompletes },
      { count: leadsCount },
      { count: purchasesCount },
    ] = await Promise.all([
      supabase.from("landing_views").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).eq("status", "completed").gte("created_at", since),
      supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("purchased", true).gte("created_at", since),
    ]);

    const lv = landingViews || 0;
    const qs = quizStarts || 0;
    const qc = quizCompletes || 0;
    const ld = leadsCount || 0;
    const pr = purchasesCount || 0;

    const rates = {
      clickToStart: lv > 0 ? (qs / lv) * 100 : 0,
      startToComplete: qs > 0 ? (qc / qs) * 100 : 0,
      completeToLead: qc > 0 ? (ld / qc) * 100 : 0,
      leadToPurchase: ld > 0 ? (pr / ld) * 100 : 0,
    };

    return NextResponse.json({
      landingViews: lv,
      quizStarts: qs,
      quizCompletes: qc,
      leads: ld,
      purchases: pr,
      rates: {
        clickToStart: Number(rates.clickToStart.toFixed(1)),
        startToComplete: Number(rates.startToComplete.toFixed(1)),
        completeToLead: Number(rates.completeToLead.toFixed(1)),
        leadToPurchase: Number(rates.leadToPurchase.toFixed(1)),
      },
      targets: {
        clickToStart: { min: 60, max: 80 },
        startToComplete: { min: 50, max: 70 },
        completeToLead: { min: 60, max: 80 },
        leadToPurchase: { min: 3, max: 8 },
      },
    });
  } catch (err) {
    console.error("[ADMIN FUNNEL]", err);
    return NextResponse.json({ error: "Failed to fetch funnel" }, { status: 500 });
  }
}
