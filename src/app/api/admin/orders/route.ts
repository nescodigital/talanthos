import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const filter = searchParams.get("filter") || "all";

    let query = supabase
      .from("orders")
      .select("*, quiz_sessions(first_name, email, utm_source, referrer, fbclid, gclid)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filter === "paid") query = query.eq("purchased", true);
    if (filter === "pending") query = query.eq("purchased", false);

    const { data, error } = await query;

    if (error) {
      console.error("[ADMIN ORDERS]", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (err) {
    console.error("[ADMIN ORDERS]", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
