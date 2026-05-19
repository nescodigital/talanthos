import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { calculateScores } from "@/lib/quiz/scoring";
import { BiblicalType } from "@/lib/quiz/questions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const answers: { type?: BiblicalType }[] = (body.answers || []).map((a: { type?: string }) => ({
      type: a.type ? (a.type as BiblicalType) : undefined,
    }));
    const result = calculateScores(answers);

    const { error } = await supabase
      .from("quiz_sessions")
      .update({
        primary_type: result.primaryType,
        secondary_type: result.secondaryType,
        builder_score: result.scores.builder,
        guardian_score: result.scores.guardian,
        giver_score: result.scores.giver,
        visionary_score: result.scores.visionary,
        demographic_data: body.answers || [],
        completed_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", body.session_id);

    if (error) {
      console.error("[QUIZ COMPLETE ERROR]", error);
      return NextResponse.json({ error: "Failed to complete quiz" }, { status: 500 });
    }

    return NextResponse.json({
      primary_type: result.primaryType,
      secondary_type: result.secondaryType,
      scores: result.scores,
    });
  } catch (err) {
    console.error("[QUIZ COMPLETE ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
