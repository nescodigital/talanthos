"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, KeyRound, ArrowLeft, AlertCircle, Check } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"name" | "email" | "code">("name");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sessionId, setSessionId] = useState("");

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

  const handleStart = async () => {
    if (!firstName.trim()) return;
    setIsSubmitting(true);
    setError("");

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
        body: JSON.stringify({ first_name: firstName.trim(), ...utmParams }),
      });
      const data = await res.json();
      if (!res.ok || !data.session_id) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("talanthos_session_id", data.session_id);
      localStorage.setItem("talanthos_name", firstName.trim());
      localStorage.removeItem("talanthos_answers");
      localStorage.removeItem("talanthos_email");
      setSessionId(data.session_id);
      setStep("email");
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setError("");

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

      router.push("/quiz/1");
    } catch {
      setError("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setIsSubmitting(true);
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 22,
                padding: "clamp(32px, 6vw, 64px) 0 48px",
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
                <TextEffect per="word" preset="blur" as="span">
                  Your Biblical Money Type Quiz
                </TextEffect>
              </h1>
              <p className="tx-lede">
                <TextEffect per="word" preset="slide" delay={0.3} as="span">
                  15 questions. About 3–4 minutes. One email to receive your report.
                </TextEffect>
              </p>
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 18,
                  color: "var(--muted)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                <TextEffect per="word" preset="fade" delay={0.6} as="span">
                  There are no right or wrong answers. Just honest ones.
                </TextEffect>
              </p>

              <AnimatePresence mode="wait">
                {step === "name" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ width: "100%", marginTop: 8 }}
                  >
                    <div style={{ position: "relative" }}>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                      <input
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
                        required
                        className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                        style={{ fontFamily: "var(--sans)" }}
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-[#b85a3d] text-sm mt-3" style={{ maxWidth: 320, margin: "12px auto 0" }}>
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="tx-cta-row mt-5">
                      <TxButton onClick={handleStart} size="lg" disabled={isSubmitting || !firstName.trim()}>
                        {isSubmitting ? "Starting..." : "Begin"}
                      </TxButton>
                    </div>
                  </motion.div>
                )}

                {step === "email" && (
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
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        required
                        className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                        style={{ fontFamily: "var(--sans)" }}
                      />
                    </div>

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

                    {error && (
                      <p className="text-sm text-red-600 text-left">{error}</p>
                    )}

                    <TxButton type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending code..." : "Send verification code"}
                    </TxButton>

                    <button
                      type="button"
                      onClick={() => setStep("name")}
                      className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to name
                    </button>
                  </motion.form>
                )}

                {step === "code" && (
                  <motion.form
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleVerifyCode}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}
                  >
                    <p className="text-sm text-[var(--ink-2)]">
                      We sent a 6-digit code to <strong>{email}</strong>
                    </p>

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
                      {isSubmitting ? "Verifying..." : "Verify & start quiz"}
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

              <div
                className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--muted)]"
                style={{ fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <span className="flex items-center gap-1.5">
                  <Check className="h-3 w-3" />
                  Verified delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  Report to your inbox
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}

export default function QuizIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="tx-page">
          <div className="tx-route" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
          </div>
        </div>
      }
    >
      <QuizIntroContent />
    </Suspense>
  );
}
