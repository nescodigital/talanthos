"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, ArrowRight, AlertCircle } from "lucide-react";

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function EmailGateModal({ isOpen, onClose, onSubmit }: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    onSubmit(trimmed);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(28, 26, 20, 0.5)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[420px] rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 shadow-[0_24px_60px_-20px_rgba(28,26,20,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                <Mail className="h-5 w-5 text-[var(--accent)]" />
              </div>

              <div>
                <h3
                  className="text-[var(--ink)] m-0"
                  style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.15 }}
                >
                  Continue your conversation
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
                  Enter your email to unlock 10 questions per day, free. We'll also send you a free 3-part Biblical Finance reflection — unsubscribe anytime.
                </p>
              </div>

              <div className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3 px-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)] text-sm text-center"
                  style={{ fontFamily: "var(--sans)" }}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center justify-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(40,30,10,0.6)] disabled:opacity-60"
                style={{ fontFamily: "var(--sans)" }}
              >
                {loading ? "..." : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>
                No spam. No subscription. Your email is safe.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
