import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pw = body.password || req.headers.get("x-admin-password") || "";

  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw || pw !== adminPw) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
