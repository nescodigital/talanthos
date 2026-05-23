import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const status = searchParams.get("status") || "all";

    let query = supabase
      .from("quiz_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status !== "all") query = query.eq("status", status);

    const { data, error } = await query;

    if (error) {
      console.error("[ADMIN SESSIONS]", error);
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ sessions: data || [] });
  } catch (err) {
    console.error("[ADMIN SESSIONS]", err);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
