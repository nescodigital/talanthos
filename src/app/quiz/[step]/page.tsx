import QuizCard from "@/components/quiz/QuizCard";
import { QUIZ_QUESTIONS } from "@/lib/quiz/questions";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ step: string }>;
}

export default async function QuizStepPage({ params }: PageProps) {
  const { step } = await params;
  const stepNum = parseInt(step, 10);

  // Steps 1-9 are scoring + text questions
  // Steps 10+ are demographics, handled by /quiz/demographics
  if (isNaN(stepNum) || stepNum < 1 || stepNum > 9) {
    notFound();
  }

  return <QuizCard step={stepNum} />;
}
