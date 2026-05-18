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
    <div className="tx-page">
      <TxNav minimal />
      <div className="tx-route">
        <main className="tx-screen tx-calc">
          <div className="tx-calc-frame">
            <div className="tx-calc-orbit">
              <span className="tx-calc-orbit-ring" />
              <span className="tx-calc-orbit-ring tx-calc-orbit-ring-2" />
              <span className="tx-calc-orbit-core">
                <TxMark size={56} />
              </span>
            </div>
            <div className="tx-calc-lines">
              {lines.map((l, i) => (
                <div className={"tx-calc-line" + (i <= stage ? " is-on" : "")} key={i}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
