import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { rateLimit } from "@/lib/rate-limit";

const answerSchema = z.object({
  session_id: z.string().uuid(),
  question_number: z.number().int().min(1).max(50),
  question_id: z.string().max(50).optional(),
  answer_letter: z.string().max(5).optional().nullable(),
  answer_value: z.string().max(500).optional(),
  type: z.enum(["builder", "guardian", "giver", "visionary"]).optional().nullable(),
  time_spent_seconds: z.number().int().min(0).max(3600).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { max: 60, windowMs: 60_000, keyPrefix: "quiz-answer" });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .insert({
        session_id: parsed.data.session_id,
        question_number: parsed.data.question_number,
        question_id: parsed.data.question_id || `q${parsed.data.question_number}`,
        answer_letter: parsed.data.answer_letter || null,
        answer_value: parsed.data.answer_value || parsed.data.answer_letter || "",
        type: parsed.data.type || null,
        time_spent_seconds: parsed.data.time_spent_seconds || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[QUIZ ANSWER ERROR]", error);
      return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[QUIZ ANSWER ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
