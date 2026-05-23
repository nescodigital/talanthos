import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { buildReportData } from "@/lib/pdf/data-builder";
import { renderReportHtml } from "@/lib/pdf/templates/report-template";
import { generatePdf } from "@/lib/pdf/generator";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 5, windowMs: 60_000, keyPrefix: "generate-pdf" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    // Build report data
    const reportData = await buildReportData(session_id);
    if (!reportData) {
      return NextResponse.json({ error: "Session not found or incomplete" }, { status: 404 });
    }

    // Render HTML
    const html = renderReportHtml(reportData);

    // Generate PDF
    const pdfBuffer = await generatePdf({ html, sessionId: session_id });

    // Upload to Supabase Storage
    const supabase = getServiceRoleClient();
    const fileName = `${session_id}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("[PDF UPLOAD ERROR]", uploadError);
      return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("reports").getPublicUrl(fileName);
    const pdfUrl = urlData?.publicUrl || "";

    // Update order
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        pdf_generated: true,
        pdf_url: pdfUrl,
      })
      .eq("session_id", session_id);

    if (orderError) {
      console.error("[PDF ORDER UPDATE ERROR]", orderError);
    }

    return NextResponse.json({
      success: true,
      pdf_url: pdfUrl,
      bytes: pdfBuffer.length,
    });
  } catch (err) {
    console.error("[PDF GENERATE ERROR]", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
