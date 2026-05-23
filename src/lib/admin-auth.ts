/**
 * Simple admin authentication for Talanthos.
 * In production, use a hashed password (bcrypt) and JWT cookies.
 * For now, a plain env password with header check is sufficient.
 */

import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function verifyAdminPassword(req: NextRequest): boolean {
  const pw = req.headers.get("x-admin-password");
  if (!ADMIN_PASSWORD || !pw) return false;
  return pw === ADMIN_PASSWORD;
}

export function adminUnauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
