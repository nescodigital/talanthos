import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";

const leadSchema = z.object({
  email: z.string().email().max(100),
  primary_type: z.enum(["builder", "steward", "sower", "visionary"]),
  session_id: z.string().uuid(),
  marketing_consent: z.boolean(),
  first_name: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", parsed.data.email)
      .single();

    let leadId: string;

    if (existing?.id) {
      const { error } = await supabase
        .from("leads")
        .update({
          primary_type: parsed.data.primary_type,
          session_id: parsed.data.session_id,
          marketing_consent: parsed.data.marketing_consent,
          first_name: parsed.data.first_name || null,
        })
        .eq("id", existing.id);

      if (error) {
        console.error("[LEAD UPDATE ERROR]", error);
        return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
      }

      leadId = existing.id;
      console.log(`[LEAD UPDATED] ${parsed.data.email} → ${parsed.data.primary_type}`);
    } else {
      const { data, error } = await supabase
        .from("leads")
        .insert({
          email: parsed.data.email,
          primary_type: parsed.data.primary_type,
          session_id: parsed.data.session_id,
          marketing_consent: parsed.data.marketing_consent,
          first_name: parsed.data.first_name || null,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("[LEAD CREATE ERROR]", error);
        return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
      }

      leadId = data.id;
      console.log(`[LEAD CREATED] ${parsed.data.email} → ${parsed.data.primary_type}`);
    }

    return NextResponse.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error("[LEAD CREATE ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
