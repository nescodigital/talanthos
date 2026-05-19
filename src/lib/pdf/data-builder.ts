import { getServiceRoleClient } from "@/lib/supabase/client";
import { BIBLICAL_TYPES, BiblicalType, BiblicalTypeData } from "@/lib/quiz/types";

export interface DemographicData {
  gender?: string;
  denomination?: string;
  age?: string;
  marital?: string;
  children?: string;
  financialSituation?: string;
  biggestRegret?: string;
  emotionalRelationship?: string;
}

export interface ReportData {
  firstName: string;
  email: string;
  generatedAt: string;
  primaryType: BiblicalType;
  secondaryType: BiblicalType | null;
  primaryTypeData: BiblicalTypeData;
  secondaryTypeData: BiblicalTypeData | null;
  scores: {
    visionary: number;
    guardian: number;
    giver: number;
    builder: number;
  };
  maxScore: number;
  demographics: DemographicData;
  answers: {
    questionNumber: number;
    questionId: string;
    answerLetter: string | null;
    answerValue: string;
  }[];
}

export async function buildReportData(sessionId: string): Promise<ReportData | null> {
  const supabase = getServiceRoleClient();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    console.error("[PDF] Session not found:", sessionError);
    return null;
  }

  const { data: answersRaw, error: answersError } = await supabase
    .from("quiz_answers")
    .select("question_number, question_id, answer_letter, answer_value")
    .eq("session_id", sessionId)
    .order("question_number", { ascending: true });

  if (answersError) {
    console.error("[PDF] Answers error:", answersError);
    return null;
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("email, first_name")
    .eq("session_id", sessionId)
    .single();

  const demographics: DemographicData = {};
  for (const a of answersRaw || []) {
    switch (a.question_id) {
      case "gender": demographics.gender = a.answer_value; break;
      case "denomination": demographics.denomination = a.answer_value; break;
      case "age": demographics.age = a.answer_value; break;
      case "marital": demographics.marital = a.answer_value; break;
      case "children": demographics.children = a.answer_value; break;
      case "financial-situation": demographics.financialSituation = a.answer_value; break;
      case "biggest-regret": demographics.biggestRegret = a.answer_value; break;
      case "emotional-relationship": demographics.emotionalRelationship = a.answer_value; break;
    }
  }

  const scores = {
    visionary: session.visionary_score || 0,
    guardian: session.guardian_score || 0,
    giver: session.giver_score || 0,
    builder: session.builder_score || 0,
  };

  const primaryType = (session.primary_type as BiblicalType) || "guardian";
  const secondaryType = (session.secondary_type as BiblicalType) || null;

  return {
    firstName: lead?.first_name || "",
    email: lead?.email || "",
    generatedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    primaryType,
    secondaryType,
    primaryTypeData: BIBLICAL_TYPES[primaryType],
    secondaryTypeData: secondaryType ? BIBLICAL_TYPES[secondaryType] : null,
    scores,
    maxScore: Math.max(1, scores.visionary, scores.guardian, scores.giver, scores.builder),
    demographics,
    answers: (answersRaw || []).map((a) => ({
      questionNumber: a.question_number,
      questionId: a.question_id,
      answerLetter: a.answer_letter,
      answerValue: a.answer_value,
    })),
  };
}
