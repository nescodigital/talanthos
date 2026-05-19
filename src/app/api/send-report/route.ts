import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BIBLICAL_TYPES } from "@/lib/quiz/types";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, primary_type, scores } = body;

    if (!email || !primary_type) {
      return NextResponse.json(
        { error: "Email and type are required." },
        { status: 400 }
      );
    }

    const t = BIBLICAL_TYPES[primary_type];
    if (!t) {
      return NextResponse.json(
        { error: "Invalid type." },
        { status: 400 }
      );
    }

    const scoreLines = scores
      ? Object.entries(scores)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : "";

    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 503 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Talanthos <info@talanthos.com>",
      to: [email],
      subject: `Your Biblical Money Type: ${t.label}`,
      text: `
Hi there,

You are ${t.label}. ${t.tagline}

${t.blurb}

Your scores:
${scoreLines}

Key verse:
"${t.verse.text}" ${t.verse.ref}

Your next step:
${t.nextStep}

In His service,
Talanthos
      `.trim(),
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1c1a14; background: #f3ece0; padding: 40px;">
          <h1 style="font-weight: 400; font-size: 32px; margin: 0 0 8px;">You are ${t.label}</h1>
          <p style="color: #b88a4a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 24px;">${t.figure} · ${t.tagline}</p>
          <p style="font-size: 17px; line-height: 1.6; margin: 0 0 24px;">${t.blurb}</p>
          ${scoreLines ? `<pre style="background: #efe6d4; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.6;">${scoreLines}</pre>` : ""}
          <blockquote style="border-left: 2px solid #b88a4a; padding-left: 16px; margin: 24px 0; font-style: italic; color: #46412f;">
            "${t.verse.text}"
            <br><span style="font-style: normal; font-size: 12px; color: #7a7359;">${t.verse.ref}</span>
          </blockquote>
          <p style="font-size: 15px; line-height: 1.6; margin: 0;"><strong>Your next step:</strong><br>${t.nextStep}</p>
          <hr style="border: 0; border-top: 1px solid rgba(28,26,20,0.12); margin: 32px 0;">
          <p style="font-size: 12px; color: #7a7359; margin: 0;">Talanthos · Faith. Finances. Purpose.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[SEND REPORT ERROR]", error);
      return NextResponse.json(
        { error: "Failed to send report. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[SEND REPORT ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
