import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { calculateScores } from "@/lib/quiz/scoring";
import { BiblicalType } from "@/lib/quiz/questions";
import { rateLimit } from "@/lib/rate-limit";

const completeSchema = z.object({
  session_id: z.string().uuid(),
  answers: z.array(
    z.object({
      type: z.enum(["builder", "guardian", "giver", "visionary"]).optional(),
    })
  ).max(50),
});

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 20, windowMs: 60_000, keyPrefix: "quiz-complete" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = completeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const answers: { type?: BiblicalType }[] = parsed.data.answers.map((a: { type?: string }) => ({
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
        demographic_data: parsed.data.answers,
        completed_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", parsed.data.session_id);

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
