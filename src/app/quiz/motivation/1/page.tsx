"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Check, Mail } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Motivation1Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const sessionId = localStorage.getItem("talanthos_session_id");
    if (!sessionId) {
      router.push("/quiz");
      return;
    }

    // Save to localStorage for later use
    localStorage.setItem("talanthos_email", email);
    localStorage.setItem("talanthos_email_consent", String(marketingConsent));

    try {
      await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          session_id: sessionId,
          marketing_consent: marketingConsent,
          primary_type: "unknown",
        }),
      });
    } catch {
      // Continue even if API fails — we have it in localStorage
    }

    router.push("/quiz/6");
  };

  const handleSkip = () => {
    router.push("/quiz/6");
  };

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
                  gap: 24,
                  padding: "clamp(32px, 6vw, 64px) 0",
                  maxWidth: 480,
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
                  Halfway there
                </p>

                <h2
                  className="tx-display"
                  style={{ fontSize: "clamp(26px, 3.6vw, 38px)", lineHeight: 1.15 }}
                >
                  Save your progress before the deep questions.
                </h2>

                <TxRule width={50} />

                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(16px, 1.6vw, 18px)",
                    lineHeight: 1.55,
                    color: "var(--ink-soft)",
                  }}
                >
                  The next questions reveal your Biblical Money Type. Enter your email so we can save where you left off — and send you the report when you are done.
                </p>

                <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                  <div style={{ position: "relative" }}>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                      style={{ fontFamily: "var(--sans)" }}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-left">{error}</p>
                  )}

                  <label className="flex items-start gap-3 text-sm text-[var(--muted)] text-left">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[var(--rule)] bg-[var(--bg)] text-[var(--accent)]"
                    />
                    <span>
                      I agree to receive my report and occasional biblical finance insights from Talanthos. Unsubscribe anytime.
                    </span>
                  </label>

                  <TxButton type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Continue to my type"}
                  </TxButton>
                </form>

                <button
                  onClick={handleSkip}
                  className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)" }}
                >
                  Continue without email
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3" />
                    Your email is safe
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3 w-3" />
                    No spam
                  </span>
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
