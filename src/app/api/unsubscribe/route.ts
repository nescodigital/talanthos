import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";

/**
 * GET /api/unsubscribe?email=alex@example.com
 * Returns a simple HTML confirmation page.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe — Talanthos</title>
  <style>
    body { font-family: Georgia, serif; background: #f3ece0; color: #1c1a14; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; width: 90%; text-align: center; box-shadow: 0 4px 24px rgba(28,26,20,0.06); }
    .mark { width: 48px; height: 48px; margin-bottom: 20px; }
    h1 { font-weight: 400; font-size: 24px; margin: 0 0 12px; }
    p { font-size: 15px; line-height: 1.6; color: #46412f; margin: 0 0 24px; }
    button { background: #1c1a14; color: #f3ece0; border: none; padding: 14px 32px; font-size: 15px; font-weight: 700; border-radius: 10px; cursor: pointer; font-family: inherit; }
    button:hover { opacity: 0.9; }
    .done { color: #5a7d5a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" class="mark" />
    <h1>Unsubscribe</h1>
    <p>We'll stop sending you email sequences from Talanthos. You can still use the site and take the assessment.</p>
    <form method="POST" action="/api/unsubscribe">
      <input type="hidden" name="email" value="${escapeHtml(email)}" />
      <button type="submit">Unsubscribe me</button>
    </form>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}

/**
 * POST /api/unsubscribe
 * Body: { email }
 * Unsubscribes the lead from all email sequences.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(async () => {
      const form = await req.formData();
      return { email: form.get("email") };
    });

    const email = body?.email;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    const { data: lead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .single();

    if (lead?.id) {
      await supabase
        .from("leads")
        .update({
          email_sequence_status: "unsubscribed",
          marketing_consent: false,
        })
        .eq("id", lead.id);
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribed — Talanthos</title>
  <style>
    body { font-family: Georgia, serif; background: #f3ece0; color: #1c1a14; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; width: 90%; text-align: center; box-shadow: 0 4px 24px rgba(28,26,20,0.06); }
    .mark { width: 48px; height: 48px; margin-bottom: 20px; }
    h1 { font-weight: 400; font-size: 24px; margin: 0 0 12px; }
    p { font-size: 15px; line-height: 1.6; color: #46412f; margin: 0; }
    .done { color: #5a7d5a; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" class="mark" />
    <h1 class="done">You're unsubscribed</h1>
    <p>You won't receive any more emails from Talanthos. If you change your mind, you can always resubscribe by taking the assessment again.</p>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (err: any) {
    console.error("[UNSUBSCRIBE]", err);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
