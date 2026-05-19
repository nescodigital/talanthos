"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, AnswerLetter, BiblicalType, QuizQuestion, isChoiceQuestion } from "@/lib/quiz/questions";
import TxProgress from "@/components/tx/TxProgress";
import TxOption from "@/components/tx/TxOption";
import TxRule from "@/components/tx/TxRule";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

interface QuizCardProps {
  step: number;
}

export interface StoredAnswer {
  step: number;
  questionId: string;
  value: string;
  type?: BiblicalType;
  letter?: AnswerLetter;
}

export default function QuizCard({ step }: QuizCardProps) {
  const router = useRouter();
  const question = QUIZ_QUESTIONS[step - 1];
  const total = QUIZ_QUESTIONS.length;

  const existingRaw = typeof window !== "undefined" ? localStorage.getItem("talanthos_answers") : null;
  const existing: StoredAnswer[] = existingRaw ? JSON.parse(existingRaw) : [];
  const prevAnswer = existing.find((a) => a.step === step);

  const [value, setValue] = useState<string>(prevAnswer?.value || "");
  const [pending, setPending] = useState<string | null>(null);

  const saveAndAdvance = useCallback(
    (answerValue: string, type?: BiblicalType, letter?: AnswerLetter) => {
      const sessionId = localStorage.getItem("talanthos_session_id");
      if (!sessionId) {
        router.push("/quiz");
        return;
      }

      const all: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
      const updated = all.filter((a) => a.step !== step);
      updated.push({ step, questionId: question.id, value: answerValue, type, letter });
      localStorage.setItem("talanthos_answers", JSON.stringify(updated));

      // Send to server (best effort)
      fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          question_number: step,
          question_id: question.id,
          answer_letter: letter || null,
          answer_value: answerValue,
        }),
      }).catch(() => {});

      setTimeout(() => {
        if (step >= total) {
          router.push("/quiz/calculating");
        } else {
          router.push(`/quiz/${step + 1}`);
        }
      }, 380);
    },
    [router, step, question.id, total]
  );

  const handleChoice = useCallback(
    (letter: AnswerLetter, type: BiblicalType) => {
      if (pending) return;
      setPending(letter);
      saveAndAdvance(letter, type, letter);
    },
    [pending, saveAndAdvance]
  );

  const handleSelect = useCallback(
    (selectedValue: string) => {
      if (pending) return;
      setPending(selectedValue);
      saveAndAdvance(selectedValue);
    },
    [pending, saveAndAdvance]
  );

  const handleTextSubmit = useCallback(() => {
    if (!value.trim() || pending) return;
    setPending("text");
    saveAndAdvance(value.trim());
  }, [value, pending, saveAndAdvance]);

  const handleBack = () => {
    if (step <= 1) return;
    const all: StoredAnswer[] = JSON.parse(localStorage.getItem("talanthos_answers") || "[]");
    const updated = all.filter((a) => a.step !== step - 1);
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
            <TxProgress step={step} total={total} />
            <div className="tx-quiz-q-wrap" key={step}>
              <div className="tx-quiz-numeral">
                {String(step).padStart(2, "0")}
                <span className="tx-quiz-numeral-of">/{String(total).padStart(2, "0")}</span>
              </div>
              <h2 className="tx-quiz-q">{question.q}</h2>
              <TxRule width={50} />

              {question.type === "choice" && isChoiceQuestion(question) && (
                <div className="tx-quiz-options">
                  {question.options.map((opt) => (
                    <TxOption
                      key={opt.letter}
                      letter={opt.letter}
                      text={opt.text}
                      selected={pending === opt.letter || (!pending && value === opt.letter)}
                      onClick={() => handleChoice(opt.letter, opt.type)}
                    />
                  ))}
                </div>
              )}

              {question.type === "select" && (
                <div className="tx-quiz-options">
                  {question.options.map((opt) => (
                    <TxOption
                      key={opt.value}
                      letter={String(question.options.indexOf(opt) + 1)}
                      text={opt.text}
                      selected={pending === opt.value || (!pending && value === opt.value)}
                      onClick={() => handleSelect(opt.value)}
                    />
                  ))}
                </div>
              )}

              {question.type === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={question.placeholder}
                    maxLength={question.maxLength || 500}
                    rows={question.rows || 4}
                    style={{
                      width: "100%",
                      border: "1px solid var(--rule-strong)",
                      background: "var(--bg)",
                      color: "var(--ink)",
                      borderRadius: 14,
                      padding: "16px 18px",
                      fontSize: 16,
                      fontFamily: "var(--serif)",
                      lineHeight: 1.5,
                      outline: "none",
                      resize: "vertical",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        handleTextSubmit();
                      }
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                      {value.length}/{question.maxLength || 500}
                    </span>
                    <button
                      className="tx-btn tx-btn-primary tx-btn-md"
                      onClick={handleTextSubmit}
                      disabled={!value.trim() || !!pending}
                      style={{ opacity: !value.trim() || pending ? 0.4 : 1 }}
                    >
                      {pending ? "Saving..." : "Continue →"}
                    </button>
                  </div>
                </div>
              )}

              <div className="tx-quiz-controls">
                <button className="tx-link" onClick={handleBack} disabled={step === 1}>
                  ← Previous
                </button>
                <span className="tx-quiz-hint">
                  {question.type === "text" ? "Write freely — then continue" : "Select an answer to continue"}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
