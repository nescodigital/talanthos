"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Mail, KeyRound, ArrowLeft } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Motivation1Page() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
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

    localStorage.setItem("talanthos_email", email);
    localStorage.setItem("talanthos_email_consent", String(marketingConsent));

    try {
      const res = await fetch("/api/quiz/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setStep("code");
      startCountdown();
    } catch {
      setError("Network error. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const sessionId = localStorage.getItem("talanthos_session_id");
    if (!sessionId) {
      router.push("/quiz");
      return;
    }

    try {
      const res = await fetch("/api/quiz/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Save lead after verification
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

      router.push("/quiz/6");
    } catch {
      setError("Network error. Please try again.");
    }

    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setIsSubmitting(true);

    const sessionId = localStorage.getItem("talanthos_session_id");
    if (!sessionId) {
      router.push("/quiz");
      return;
    }

    try {
      const res = await fetch("/api/quiz/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
      } else {
        startCountdown();
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="tx-page">
      <TxNav />
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
                  {step === "email"
                    ? "Save your progress before the deep questions."
                    : "Check your inbox for the code."}
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
                  {step === "email"
                    ? "The next questions reveal your Biblical Money Type. Enter your email so we can save where you left off — and send you the report when you are done."
                    : `We sent a 6-digit code to ${email}. Enter it below to continue.`}
                </p>

                <AnimatePresence mode="wait">
                  {step === "email" ? (
                    <motion.form
                      key="email"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSendCode}
                      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}
                    >
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
                        {isSubmitting ? "Sending code..." : "Continue to my type"}
                      </TxButton>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="code"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleVerifyCode}
                      style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}
                    >
                      <div style={{ position: "relative" }}>
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          placeholder="000000"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                          required
                          autoFocus
                          className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm tracking-[0.3em] text-center"
                          style={{ fontFamily: "var(--mono)", fontSize: 18 }}
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 text-left">{error}</p>
                      )}

                      <TxButton type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Verifying..." : "Verify & continue"}
                      </TxButton>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep("email")}
                          className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors flex items-center gap-1"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Change email
                        </button>

                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={countdown > 0 || isSubmitting}
                          className="text-sm text-[var(--accent)] hover:underline disabled:text-[var(--muted)] disabled:no-underline transition-colors"
                        >
                          {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

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
