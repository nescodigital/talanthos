"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, AnswerLetter, BiblicalType } from "@/lib/quiz/questions";
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
  type: BiblicalType;
}

export default function QuizCard({ step }: QuizCardProps) {
  const router = useRouter();
  const question = QUIZ_QUESTIONS[step - 1];
  const [pending, setPending] = useState<string | null>(null);

  const handleAnswer = useCallback(
    async (letter: AnswerLetter, type: BiblicalType) => {
      if (pending) return;
      setPending(letter);

      const sessionId = localStorage.getItem("talanthos_session_id");
      if (!sessionId) {
        router.push("/quiz");
        return;
      }

      const existing: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
      const updated = existing.filter((a) => a.question !== step);
      updated.push({ question: step, letter, type });
      localStorage.setItem("talanthos_answers", JSON.stringify(updated));

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
    <div className="tx-page">
      <TxNav minimal />
      <div className="tx-route">
        <main className="tx-screen tx-quiz">
          <div className="tx-quiz-frame">
            <TxProgress step={step} total={7} />
            <div className="tx-quiz-q-wrap" key={step}>
              <div className="tx-quiz-numeral">
                {String(step).padStart(2, "0")}
                <span className="tx-quiz-numeral-of">/{String(7).padStart(2, "0")}</span>
              </div>
              <h2 className="tx-quiz-q">{question.q}</h2>
              <TxRule width={50} />
              <div className="tx-quiz-options">
                {question.options.map((opt) => (
                  <TxOption
                    key={opt.letter}
                    letter={opt.letter}
                    text={opt.text}
                    selected={pending === opt.letter}
                    onClick={() => handleAnswer(opt.letter, opt.type)}
                  />
                ))}
              </div>
              <div className="tx-quiz-controls">
                <button className="tx-link" onClick={handleBack} disabled={step === 1}>
                  ← Previous
                </button>
                <span className="tx-quiz-hint">Select an answer to continue</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
