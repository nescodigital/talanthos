import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const days = Math.min(90, Math.max(1, parseInt(searchParams.get("days") || "7")));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalSessions },
      { count: completedSessions },
      { count: totalLeads },
      { count: totalOrders },
      { data: orders },
      { data: sessionsByDay },
      { data: recentSessions },
    ] = await Promise.all([
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }),
      supabase.from("quiz_sessions").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("amount_total_cents, purchased").gte("created_at", since),
      supabase
        .from("quiz_sessions")
        .select("created_at, status")
        .gte("created_at", since)
        .order("created_at", { ascending: true }),
      supabase
        .from("quiz_sessions")
        .select("id, created_at, first_name, email, status, primary_type, completed_at")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const revenue = (orders || [])
      .filter((o: any) => o.purchased)
      .reduce((sum: number, o: any) => sum + (o.amount_total_cents || 0), 0);

    // Aggregate sessions by day
    const dayMap = new Map<string, { date: string; sessions: number; completed: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap.set(key, { date: key, sessions: 0, completed: 0 });
    }
    (sessionsByDay || []).forEach((s: any) => {
      const key = s.created_at?.slice(0, 10);
      if (key && dayMap.has(key)) {
        const entry = dayMap.get(key)!;
        entry.sessions++;
        if (s.status === "completed") entry.completed++;
      }
    });

    return NextResponse.json({
      totalSessions: totalSessions || 0,
      completedSessions: completedSessions || 0,
      totalLeads: totalLeads || 0,
      totalOrders: totalOrders || 0,
      revenueCents: revenue,
      revenueUsd: (revenue / 100).toFixed(2),
      sessionsByDay: Array.from(dayMap.values()),
      recentSessions: recentSessions || [],
    });
  } catch (err) {
    console.error("[ADMIN STATS]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
