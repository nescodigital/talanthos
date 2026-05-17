"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Your Biblical Money Type Quiz
        </h1>
        <p className="mt-4 text-lg text-foreground-muted">
          7 questions. About 90 seconds. No email needed to start.
        </p>
        <p className="mt-8 text-sm italic text-foreground-muted">
          There are no right or wrong answers. Just honest ones.
        </p>
        <button
          onClick={handleBegin}
          disabled={isStarting}
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover disabled:opacity-50"
        >
          {isStarting ? "Starting..." : "Begin"}
        </button>
      </motion.div>
    </div>
  );
}

export default function QuizIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      }
    >
      <QuizIntroContent />
    </Suspense>
  );
}
