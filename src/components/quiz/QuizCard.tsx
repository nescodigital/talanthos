"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, AnswerLetter } from "@/lib/quiz/questions";
import TxProgress from "@/components/tx/TxProgress";
import TxOption from "@/components/tx/TxOption";
import TxRule from "@/components/tx/TxRule";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

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
  const [pending, setPending] = useState<string | null>(null);

  const handleAnswer = useCallback(
    async (letter: AnswerLetter) => {
      if (pending) return;
      setPending(letter);

      const sessionId = localStorage.getItem("talanthos_session_id");
      if (!sessionId) {
        router.push("/quiz");
        return;
      }

      const existing: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
      const updated = existing.filter((a) => a.question !== step);
      updated.push({ question: step, letter });
      localStorage.setItem("talanthos_answers", JSON.stringify(updated));

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
        // continue
      }

      setTimeout(() => {
        if (step >= 7) {
          router.push("/quiz/calculating");
        } else {
          router.push(`/quiz/${step + 1}`);
        }
      }, 380);
    },
    [pending, router, step]
  );

  const handleBack = () => {
    if (step <= 1) return;
    const existing: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
    const updated = existing.filter((a) => a.question !== step - 1);
    localStorage.setItem("talanthos_answers", JSON.stringify(updated));
    router.push(`/quiz/${step - 1}`);
  };

  if (!question) return null;

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center px-5 sm:px-6 lg:px-14 py-8 sm:py-12">
        <div className="w-full max-w-[720px]">
          <TxProgress step={step} total={7} />
          <div
            className="flex flex-col items-stretch gap-6"
            style={{ animation: "txFade .45s ease both" }}
          >
            <div
              className="text-[var(--accent)]"
              style={{
                fontFamily: "var(--serif)",
                fontSize: 28,
                letterSpacing: "-0.01em",
              }}
            >
              {String(step).padStart(2, "0")}
              <span className="text-[var(--muted)] text-base ml-0.5">
                /{String(7).padStart(2, "0")}
              </span>
            </div>
            <h2
              className="m-0 text-[var(--ink)]"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(28px, 3.4vw, 38px)",
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              {question.question}
            </h2>
            <TxRule width={50} />
            <div className="flex flex-col gap-2.5 mt-2">
              {question.options.map((opt) => (
                <TxOption
                  key={opt.letter}
                  letter={opt.letter}
                  text={opt.text}
                  selected={pending === opt.letter}
                  onClick={() => handleAnswer(opt.letter)}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-3">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="appearance-none border-0 bg-transparent text-[var(--ink-2)] cursor-pointer text-[13px] tracking-[0.04em] py-1.5 border-b border-transparent transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-35 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              <span className="font-[var(--mono)] text-[11px] text-[var(--muted)] uppercase tracking-[0.16em]">
                Select an answer to continue
              </span>
            </div>
          </div>
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
