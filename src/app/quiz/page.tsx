"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Check, Mail, AlertCircle } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TYPO_FIXES: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "hotmal.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "icloud.con": "icloud.com",
  "live.con": "live.com",
  "protonmail.con": "protonmail.com",
  "aol.con": "aol.com",
  "mail.con": "mail.com",
};

function validateEmailInput(email: string): { valid: boolean; message?: string; suggestion?: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { valid: false, message: "Please enter your email address." };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: "Please enter a valid email address." };

  const parts = trimmed.split("@");
  if (parts.length !== 2) return { valid: false, message: "Please enter a valid email address." };

  const domain = parts[1];
  const fixedDomain = TYPO_FIXES[domain];
  if (fixedDomain) {
    return {
      valid: false,
      message: `Did you mean ${parts[0]}@${fixedDomain}?`,
      suggestion: `${parts[0]}@${fixedDomain}`,
    };
  }

  if (domain.endsWith(".cm") || domain.endsWith(".coom") || domain.endsWith(".comm")) {
    return { valid: false, message: "Please double-check your email domain." };
  }

  return { valid: true };
}

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    const emailCheck = validateEmailInput(email);
    if (!emailCheck.valid) {
      setError(emailCheck.message || "Please enter a valid email address.");
      return;
    }
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
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          marketing_consent: marketingConsent,
          ...utmParams,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.session_id) {
        setError(data.error || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("talanthos_session_id", data.session_id);
      localStorage.setItem("talanthos_name", firstName.trim());
      localStorage.setItem("talanthos_email", email.trim().toLowerCase());
      localStorage.setItem("talanthos_marketing_consent", String(marketingConsent));
      localStorage.removeItem("talanthos_answers");
      router.push("/quiz/1");
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
                gap: 20,
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
                  15 questions. About 3–4 minutes. A personalized report grounded in Scripture.
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

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                <div style={{ position: "relative" }}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
                    className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                    style={{ fontFamily: "var(--sans)" }}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
                    className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                    style={{ fontFamily: "var(--sans)" }}
                  />
                </div>

                <p
                  className="text-left text-xs text-[var(--muted)] leading-relaxed"
                  style={{ fontFamily: "var(--sans)", margin: "-4px 4px 0" }}
                >
                  <AlertCircle className="inline h-3 w-3 mr-1 -mt-0.5" />
                  We need your email to send your personalized Biblical Money Type report.
                  We will never sell or share it.
                </p>

                <label className="flex items-start gap-2.5 cursor-pointer px-1">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--rule-strong)] text-[var(--accent)] accent-[var(--accent)] cursor-pointer"
                  />
                  <span
                    className="text-left text-[11px] leading-relaxed text-[var(--muted)]"
                    style={{ fontFamily: "var(--sans)" }}
                  >
                    Send me occasional insights on faith, finances, and stewardship.
                    No spam. Unsubscribe anytime.
                  </span>
                </label>

                <TxButton onClick={handleStart} size="lg" disabled={isSubmitting || !firstName.trim() || !email.trim()}>
                  {isSubmitting ? "Starting..." : "Begin the assessment"}
                </TxButton>

                {error && (
                  <div className="flex items-start gap-2 text-[#b85a3d] text-sm text-left">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div
                className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--muted)]"
                style={{ fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3" />15 questions</span>
                <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" />Report to inbox</span>
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
