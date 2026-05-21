"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";
import { User } from "lucide-react";

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStarting, setIsStarting] = useState(false);
  const [firstName, setFirstName] = useState("");

  const handleBegin = async () => {
    if (isStarting) return;
    if (!firstName.trim()) return;
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
        body: JSON.stringify({ first_name: firstName.trim(), ...utmParams }),
      });
      const data = await res.json();
      if (data.session_id) {
        localStorage.setItem("talanthos_session_id", data.session_id);
        localStorage.setItem("talanthos_name", firstName.trim());
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

              <div style={{ width: "100%", maxWidth: 320, marginTop: 8 }}>
                <div style={{ position: "relative" }}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleBegin(); }}
                    required
                    className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                    style={{ fontFamily: "var(--sans)" }}
                  />
                </div>
              </div>

              <div className="tx-cta-row">
                <TxButton onClick={handleBegin} size="lg" disabled={isStarting || !firstName.trim()}>
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
