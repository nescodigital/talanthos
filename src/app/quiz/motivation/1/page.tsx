"use client";

import { useRouter } from "next/navigation";
import { Lock, Check } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Motivation1Page() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz/6");
  };

  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen tx-quiz">
          <div className="tx-quiz-frame">
            <BlurFade>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 24,
                  padding: "clamp(32px, 6vw, 64px) 0",
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--accent)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Halfway there
                </p>

                <h2
                  className="tx-display"
                  style={{ fontSize: "clamp(26px, 3.6vw, 38px)", lineHeight: 1.15 }}
                >
                  Save your progress before the deep questions.
                </h2>

                <TxRule width={50} />

                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(16px, 1.6vw, 18px)",
                    lineHeight: 1.55,
                    color: "var(--ink-soft)",
                  }}
                >
                  The next questions reveal your Biblical Money Type. Your answers so far are saved — just keep going.
                </p>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                  <TxButton onClick={handleContinue} size="lg">
                    Continue to my type
                  </TxButton>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    Your answers are saved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3" />
                    No spam
                  </span>
                </div>
              </div>
            </BlurFade>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
