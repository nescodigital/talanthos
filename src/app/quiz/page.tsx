"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStarting, setIsStarting] = useState(false);

  const handleBegin = async () => {
    if (isStarting) return;
    setIsStarting(true);

    const utmParams: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "referrer"].forEach(
      (key) => {
        const value = searchParams.get(key);
        if (value) utmParams[key] = value;
      }
    );

    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(utmParams),
      });
      const data = await res.json();
      if (data.session_id) {
        localStorage.setItem("talanthos_session_id", data.session_id);
        localStorage.removeItem("talanthos_answers");
        router.push("/quiz/1");
      }
    } catch {
      setIsStarting(false);
    }
  };

  return (
    <div className="tx-page">
      <TxNav minimal />
      <div className="tx-route">
        <main className="tx-screen tx-quiz">
          <div className="tx-quiz-frame">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22, padding: "clamp(32px, 6vw, 64px) 0 48px" }}>
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
                <TextEffect per="word" preset="blur" as="span">
                  Your Biblical Money Type Quiz
                </TextEffect>
              </h1>
              <p className="tx-lede">
                <TextEffect per="word" preset="slide" delay={0.3} as="span">
                  15 questions. About 3-4 minutes. No email needed to start.
                </TextEffect>
              </p>
              <p style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>
                <TextEffect per="word" preset="fade" delay={0.6} as="span">
                  There are no right or wrong answers. Just honest ones.
                </TextEffect>
              </p>
              <div className="tx-cta-row">
                <TxButton onClick={handleBegin} size="lg" disabled={isStarting}>
                  {isStarting ? "Starting..." : "Begin"}
                </TxButton>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}

export default function QuizIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="tx-page">
          <div className="tx-route" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
          </div>
        </div>
      }
    >
      <QuizIntroContent />
    </Suspense>
  );
}
