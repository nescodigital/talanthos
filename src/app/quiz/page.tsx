"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isStarting, setIsStarting] = useState(false);

  const handleBegin = async () => {
    if (isStarting) return;
    setIsStarting(true);

    const utmParams: Record<string, string> = {};
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
      "referrer",
    ].forEach((key) => {
      const value = searchParams.get(key);
      if (value) utmParams[key] = value;
    });

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
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg text-center"
        >
          <h1
            className="m-0 text-[var(--ink)]"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.1,
            }}
          >
            Your Biblical Money Type Quiz
          </h1>
          <p className="mt-5 text-lg text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
            7 questions. About 90 seconds. No email needed to start.
          </p>
          <p className="mt-8 text-sm italic text-[var(--muted)]" style={{ fontFamily: "var(--serif)" }}>
            There are no right or wrong answers. Just honest ones.
          </p>
          <div className="mt-10">
            <TxButton onClick={handleBegin} size="lg" disabled={isStarting}>
              {isStarting ? "Starting..." : "Begin"}
            </TxButton>
          </div>
        </motion.div>
      </main>
      <TxFooter />
    </div>
  );
}

export default function QuizIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--rule)] border-t-[var(--accent)]" />
        </div>
      }
    >
      <QuizIntroContent />
    </Suspense>
  );
}
