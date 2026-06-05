"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, X } from "lucide-react";
import TxButton from "@/components/tx/TxButton";

interface EmailConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string, marketingConsent: boolean) => void;
  defaultEmail?: string;
}

export default function EmailConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  defaultEmail = "",
}: EmailConfirmModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [marketingConsent, setMarketingConsent] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("talanthos_marketing_consent") === "true";
  });
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    localStorage.setItem("talanthos_email", trimmed);
    onConfirm(trimmed, marketingConsent);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(28, 26, 20, 0.45)", backdropFilter: "blur(4px)" }}
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
                  style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.15 }}
                >
                  Confirm your email
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
                  So we can send your personalized report to the right inbox.
                </p>
              </div>

              <div className="w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3 px-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)] text-sm text-center"
                  style={{ fontFamily: "var(--sans)" }}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <label className="flex items-start gap-2.5 w-full cursor-pointer px-1">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--rule-strong)] text-[var(--accent)] accent-[var(--accent)] cursor-pointer"
                />
                <span className="text-left text-[11px] leading-relaxed text-[var(--muted)]" style={{ fontFamily: "var(--sans)" }}>
                  Send me occasional insights on faith, finances, and stewardship. No spam. Unsubscribe anytime.
                </span>
              </label>

              <TxButton
                size="lg"
                icon="arrow"
                onClick={handleConfirm}
                className="w-full"
              >
                Confirm and continue
              </TxButton>

              <p className="text-[11px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)", letterSpacing: "0.04em" }}>
                You can update this anytime before checkout.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
