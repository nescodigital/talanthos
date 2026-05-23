import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const search = searchParams.get("search") || "";

    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[ADMIN LEADS]", error);
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }

    return NextResponse.json({ leads: data || [] });
  } catch (err) {
    console.error("[ADMIN LEADS]", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
