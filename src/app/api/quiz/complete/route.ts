import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { calculateScores } from "@/lib/quiz/scoring";
import { AnswerLetter } from "@/lib/quiz/questions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const answers: { question: number; letter: AnswerLetter }[] = body.answers || [];
    const result = calculateScores(answers);

    const { error } = await supabase
      .from("quiz_sessions")
      .update({
        primary_type: result.primaryType,
        secondary_type: result.secondaryType,
        builder_score: result.scores.builder,
        steward_score: result.scores.steward,
        sower_score: result.scores.sower,
        visionary_score: result.scores.visionary,
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
