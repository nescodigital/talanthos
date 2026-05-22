"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { HintResult } from "@/lib/quiz/hints";

interface IdentityHintProps {
  hint: HintResult;
  onDismiss: () => void;
}

export default function IdentityHint({ hint, onDismiss }: IdentityHintProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-xl border border-[var(--accent)]/20 bg-[#efe6d4] px-5 py-4 mb-5 text-left"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--accent)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "0 0 4px",
                }}
              >
                Pattern emerging
              </p>
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 15,
                  lineHeight: 1.45,
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                <strong>{hint.headline}</strong> — {hint.body}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
