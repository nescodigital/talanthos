"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";
import { getIdentityHint } from "@/lib/quiz/hints";
import { countTypes } from "@/lib/quiz/scoring";
import type { BiblicalType } from "@/lib/quiz/scoring";

interface StoredAnswer {
  step: number;
  questionId: string;
  value: string;
  type?: BiblicalType;
  letter?: string;
}

const TEASER_TEMPLATES: Record<BiblicalType, string> = {
  visionary:
    "At this point, a clear forward instinct is emerging. You evaluate money by what it can seed, not just what it can buy. The next questions will reveal whether that vision has the guardrails it needs — or whether it's running ahead of its counsel.",
  guardian:
    "Your answers so far show a consistent orientation toward protection and preparation. You don't treat resources as casual. The remaining questions will clarify whether that caution is wisdom — or whether it's keeping you from opening a storehouse God asked you to open.",
  giver:
    "An outward pattern is already visible. You think of deployment before accumulation. What follows will test whether that generosity is anchored in structure — or whether it's outpacing the household God entrusted you to protect.",
  builder:
    "Structure, purpose, and completion keep appearing in your choices. You don't follow money; you architect it. The final questions will show whether your systems serve people — or whether people have become servants of the system.",
};

function getTeaserText(answers: StoredAnswer[]): string {
  const scoring = answers.filter((a) => a.type).map((a) => ({ type: a.type! }));
  if (scoring.length === 0) {
    return "What comes next reveals your Biblical Money Type. The pattern God wired into you before you ever touched a dollar.";
  }

  const counts = countTypes(scoring);
  const sorted = (Object.entries(counts) as [BiblicalType, number][]).sort((a, b) => b[1] - a[1]);
  const [primary, primaryCount] = sorted[0];
  const [, secondaryCount] = sorted[1];

  // If there's a clear leader, use its template
  if (primaryCount > secondaryCount) {
    return TEASER_TEMPLATES[primary];
  }

  // Balanced — use generic but still validating
  const hint = getIdentityHint(scoring);
  if (hint) {
    return `${hint.body} The remaining questions will sharpen this into a clear picture.`;
  }

  return "Your pattern is more complex than most. No single force dominates yet. The next questions will reveal which instinct deepens — and which one quietly competes with it.";
}

export default function Motivation2Page() {
  const router = useRouter();
  const [teaser, setTeaser] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("talanthos_answers");
    const answers: StoredAnswer[] = raw ? JSON.parse(raw) : [];
    setTeaser(getTeaserText(answers));
  }, []);

  return (
    <div className="tx-page">
      <TxNav minimal />
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
                  gap: 28,
                  padding: "clamp(40px, 8vw, 80px) 0",
                  maxWidth: 560,
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
                  Not many make it this far
                </p>

                <h2
                  className="tx-display"
                  style={{ fontSize: "clamp(26px, 3.6vw, 38px)", lineHeight: 1.15 }}
                >
                  A pattern is emerging.
                </h2>

                <TxRule width={50} />

                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(17px, 1.8vw, 20px)",
                    lineHeight: 1.55,
                    color: "var(--ink-soft)",
                    fontStyle: "italic",
                  }}
                >
                  {teaser || "Loading your pattern..."}
                </p>

                <div style={{ marginTop: 8 }}>
                  <TxButton size="lg" onClick={() => router.push("/quiz/9")}>
                    Sharpen the picture →
                  </TxButton>
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
