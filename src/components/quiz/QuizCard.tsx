"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QUIZ_QUESTIONS, AnswerLetter } from "@/lib/quiz/questions";
import QuizProgress from "./QuizProgress";
import AnswerOption from "./AnswerOption";

interface QuizCardProps {
  step: number;
}

interface StoredAnswer {
  question: number;
  letter: AnswerLetter;
}

export default function QuizCard({ step }: QuizCardProps) {
  const router = useRouter();
  const question = QUIZ_QUESTIONS.find((q) => q.number === step);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = useCallback(
    async (letter: AnswerLetter) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const sessionId = localStorage.getItem("talanthos_session_id");
      if (!sessionId) {
        router.push("/quiz");
        return;
      }

      // Save to localStorage first (for resilience)
      const existing: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
      const updated = existing.filter((a) => a.question !== step);
      updated.push({ question: step, letter });
      localStorage.setItem("talanthos_answers", JSON.stringify(updated));

      // Send to API
      try {
        await fetch("/api/quiz/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            question_number: step,
            answer_letter: letter,
          }),
        });
      } catch {
        // Continue even if API fails (mock mode handles it)
      }

      if (step >= 7) {
        router.push("/quiz/calculating");
      } else {
        router.push(`/quiz/${step + 1}`);
      }
    },
    [isSubmitting, router, step]
  );

  useEffect(() => {
    // Redirect if no session
    if (!localStorage.getItem("talanthos_session_id")) {
      router.push("/quiz");
    }
  }, [router]);

  if (!question) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col items-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl"
      >
        <QuizProgress current={step} total={7} />

        <h2 className="mt-10 font-display text-2xl font-medium leading-snug text-foreground md:text-3xl">
          {question.question}
        </h2>

        <div className="mt-8 flex flex-col gap-3">
          {question.options.map((option, index) => (
            <AnswerOption
              key={option.letter}
              letter={option.letter}
              text={option.text}
              index={index}
              onSelect={handleAnswer}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
