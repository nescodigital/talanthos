"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BIBLICAL_TYPES, BiblicalTypeData } from "@/lib/quiz/types";
import TypeReveal from "@/components/result/TypeReveal";
import LockedSection from "@/components/result/LockedSection";
import { BookOpen, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

interface ResultData {
  primary_type: string;
  secondary_type: string | null;
  scores: { builder: number; steward: number; sower: number; visionary: number };
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function computeResult() {
      const sessionId = localStorage.getItem("talanthos_session_id");
      const answersRaw = localStorage.getItem("talanthos_answers");

      if (!sessionId || !answersRaw) {
        router.push("/quiz");
        return;
      }

      const answers = JSON.parse(answersRaw);

      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, answers }),
        });
        const data = await res.json();
        setResult(data);
      } catch {
        router.push("/quiz");
      } finally {
        setLoading(false);
      }
    }

    computeResult();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!result) return null;

  const typeData: BiblicalTypeData = BIBLICAL_TYPES[result.primary_type];
  if (!typeData) return null;

  const strengthsVisible = typeData.strengths.slice(0, 2);
  const strengthsLocked = typeData.strengths.slice(2);
  const blindSpotsVisible = typeData.blindSpots.slice(0, 1);
  const blindSpotsLocked = typeData.blindSpots.slice(1);

  return (
    <div className="flex min-h-full flex-col items-center px-6 py-16">
      <div className="w-full max-w-3xl">
        <TypeReveal type={typeData} />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-border bg-bg-elevated p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground">Your Strengths</h3>
            </div>
            <ul className="space-y-2">
              {strengthsVisible.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-foreground-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                  {s}
                </li>
              ))}
              {strengthsLocked.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-foreground-muted/40 blur-[2px]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-muted/20" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Blind Spots */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-border bg-bg-elevated p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-danger" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground">Your Blind Spots</h3>
            </div>
            <ul className="space-y-2">
              {blindSpotsVisible.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-foreground-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-danger" />
                  {s}
                </li>
              ))}
              {blindSpotsLocked.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-foreground-muted/40 blur-[2px]"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-muted/20" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Key Verse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-border bg-bg-elevated p-6 md:col-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground">Your Key Verse</h3>
            </div>
            <blockquote className="font-display text-lg italic text-foreground md:text-xl">
              &ldquo;{typeData.keyVerse.text}&rdquo;
            </blockquote>
            <p className="mt-2 text-sm text-foreground-muted">— {typeData.keyVerse.reference}</p>
          </motion.div>

          {/* Next Step */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-xl border border-border bg-bg-elevated p-6 md:col-span-2"
          >
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground">Your Next Step</h3>
            </div>
            <p className="text-foreground-muted leading-relaxed">{typeData.primaryFreeInsight}</p>
          </motion.div>
        </div>

        <LockedSection typeName={typeData.name} />
      </div>
    </div>
  );
}
