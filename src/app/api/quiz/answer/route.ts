import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .insert({
        session_id: body.session_id,
        question_number: body.question_number,
        question_id: body.question_id || `q${body.question_number}`,
        answer_letter: body.answer_letter || null,
        answer_value: body.answer_value || body.answer_letter || "",
        time_spent_seconds: body.time_spent_seconds || null,
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
