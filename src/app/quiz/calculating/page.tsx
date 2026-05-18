"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TxMark from "@/components/tx/TxMark";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

const lines = [
  "Reading your answers…",
  "Weighing them against four scriptural archetypes…",
  "Naming the one that fits.",
];

export default function CalculatingPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 900);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => router.push("/quiz/intro-result"), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router]);

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 min-h-[80vh]">
        <div className="flex flex-col items-center gap-12 text-center m-auto">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[var(--rule-strong)] border-t-[var(--accent)] animate-[spin_2.2s_linear_infinite]" />
            <span
              className="absolute rounded-full border border-[var(--rule)] border-r-[var(--accent)] animate-[spin_3.2s_linear_infinite]"
              style={{ inset: 22, animationDirection: "reverse" }}
            />
            <span className="relative text-[var(--accent)]">
              <TxMark size={56} />
            </span>
          </div>
          <div className="flex flex-col gap-3" style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-2)", fontStyle: "italic" }}>
            {lines.map((l, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: i <= stage ? 1 : 0,
                  transform: i <= stage ? "none" : "translateY(6px)",
                  color: i <= stage ? "var(--ink)" : "var(--ink-2)",
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
