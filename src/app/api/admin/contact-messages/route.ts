import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { verifyAdminPassword, adminUnauthorized } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminPassword(req)) return adminUnauthorized();

  try {
    const supabase = getServiceRoleClient();

    // Contact messages are not stored in DB currently — they're only sent via email.
    // If you add a contact_messages table later, this will work.
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error && error.code !== "42P01") {
      // 42P01 = undefined_table
      console.error("[ADMIN CONTACT]", error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({ messages: data || [] });
  } catch (err) {
    console.error("[ADMIN CONTACT]", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
