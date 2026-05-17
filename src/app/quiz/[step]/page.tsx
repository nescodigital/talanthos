import QuizCard from "@/components/quiz/QuizCard";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ step: string }>;
}

export default async function QuizStepPage({ params }: PageProps) {
  const { step } = await params;
  const stepNum = parseInt(step, 10);

  if (isNaN(stepNum) || stepNum < 1 || stepNum > 7) {
    notFound();
  }

  return <QuizCard step={stepNum} />;
}
