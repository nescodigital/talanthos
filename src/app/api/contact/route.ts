import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 503 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Talanthos <info@talanthos.com>",
      to: ["info@talanthos.com"],
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="text-align: left; margin-bottom: 16px;"><img src="https://www.talanthos.com/assets/talanthos-mark.png" alt="" width="36" height="36" style="display: inline-block; margin-bottom: 6px;" /><div style="font-family: Georgia, serif; font-size: 16px; letter-spacing: 0.2em; color: #1c1a14; text-transform: uppercase;">Talanthos</div></div>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${escapeHtml(message)}</p>
      `,
    });

    if (error) {
      console.error("[CONTACT EMAIL ERROR]", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[CONTACT ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
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
