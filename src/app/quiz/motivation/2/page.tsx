"use client";

import { useRouter } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Motivation2Page() {
  const router = useRouter();

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
                  maxWidth: 520,
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
                  style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.15 }}
                >
                  Most quit before the real work begins.
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
                  What comes next reveals your Biblical Money Type. The pattern God wired into you before you ever touched a dollar.
                </p>

                <div style={{ marginTop: 8 }}>
                  <TxButton size="lg" onClick={() => router.push("/quiz/9")}>
                    Discover my type
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
