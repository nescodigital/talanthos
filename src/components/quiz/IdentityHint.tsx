"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import TxRule from "@/components/tx/TxRule";
import type { HintResult } from "@/lib/quiz/hints";

interface IdentityHintProps {
  hint: HintResult;
  onContinue: () => void;
}

export default function IdentityHint({ hint, onContinue }: IdentityHintProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onContinue, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-5"
          style={{ maxWidth: 480, margin: "0 auto", padding: "clamp(32px, 6vw, 64px) 0" }}
        >
          <Sparkles className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--accent)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Pattern detected
          </p>

          <h3
            className="tx-display"
            style={{ fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1.2 }}
          >
            {hint.headline}
          </h3>

          <TxRule width={40} />

          <p
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(16px, 1.6vw, 18px)",
              lineHeight: 1.55,
              color: "var(--ink-soft)",
            }}
          >
            {hint.body}
          </p>

          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onContinue, 250);
            }}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors mt-2"
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)" }}
          >
            Continue →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
