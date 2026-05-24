"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, KeyRound, AlertCircle, Check } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";

function QuizIntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [googleReady, setGoogleReady] = useState(false);

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
        setError(data.error || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("talanthos_session_id", data.session_id);
      localStorage.setItem("talanthos_name", firstName.trim());
      localStorage.removeItem("talanthos_answers");
      localStorage.removeItem("talanthos_email");
      setSessionId(data.session_id);
    } catch {
      setError("Network error. Please try again.");
    }
    setIsSubmitting(false);
  };

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (!sessionId) {
      setError("Please enter your name first.");
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
        setError(data.error || "Failed to send code.");
        setIsSubmitting(false);
        return;
      }
      setCodeSent(true);
      startCountdown();
    } catch {
      setError("Network error.");
    }
    setIsSubmitting(false);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
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
        setError(data.error || "Invalid code.");
        setIsSubmitting(false);
        return;
      }

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
      setError("Network error.");
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    if (countdown > 0 || !sessionId) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quiz/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, email }),
      });
      if (res.ok) startCountdown();
      else setError("Failed to resend.");
    } catch {
      setError("Network error.");
    }
    setIsSubmitting(false);
  };

  // ── Google Identity Services ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    function initGoogleButton() {
      const g = (window as any).google;
      if (!g?.accounts?.id) {
        // Retry in 100ms if Google API not ready yet
        setTimeout(initGoogleButton, 100);
        return;
      }
      g.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      const btn = document.getElementById("google-signin-button");
      if (btn) {
        btn.innerHTML = "";
        g.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
          shape: "pill",
        });
      }
    }

    if ((window as any).google) {
      initGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Decode JWT to get name for session creation
      let googleName = "";
      try {
        const parts = response.credential.split(".");
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const pad = 4 - (base64.length % 4);
        const padded = pad !== 4 ? base64 + "=".repeat(pad) : base64;
        const payload = JSON.parse(atob(padded));
        googleName = payload.name || payload.given_name || "";
      } catch { /* ignore decode errors */ }

      // Ensure we have a session
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const utmParams: Record<string, string> = {};
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "referrer"].forEach(
          (key) => {
            const value = searchParams.get(key);
            if (value) utmParams[key] = value;
          }
        );

        const res = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name: googleName || "Friend", ...utmParams }),
        });
        const data = await res.json();
        if (!res.ok || !data.session_id) {
          setError(data.error || "Something went wrong.");
          setIsSubmitting(false);
          return;
        }
        currentSessionId = data.session_id;
        localStorage.setItem("talanthos_session_id", data.session_id);
        localStorage.setItem("talanthos_name", googleName || "Friend");
        localStorage.removeItem("talanthos_answers");
        localStorage.removeItem("talanthos_email");
        setSessionId(data.session_id);
      }

      const res = await fetch("/api/quiz/verify-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: response.credential,
          session_id: currentSessionId,
          marketing_consent: marketingConsent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Google sign-in failed.");
        setIsSubmitting(false);
        return;
      }
      localStorage.setItem("talanthos_email", data.email);
      localStorage.setItem("talanthos_email_consent", String(marketingConsent));
      if (data.name) localStorage.setItem("talanthos_name", data.name);
      router.push("/quiz/1");
    } catch {
      setError("Network error.");
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

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                {/* Google Sign In — first and full width */}
                {!codeSent && (
                  <>
                    <div id="google-signin-button" style={{ width: "100%", minHeight: 44 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--muted)", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.06em" }}>
                      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                      <span>OR USE EMAIL</span>
                      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                    </div>
                  </>
                )}

                {/* Name */}
                {!codeSent && (
                  <div style={{ position: "relative" }}>
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                    <input
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                      onBlur={handleStart}
                      onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
                      className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                      style={{ fontFamily: "var(--sans)" }}
                    />
                  </div>
                )}

                {/* Email */}
                {!codeSent && (
                  <div style={{ position: "relative" }}>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm"
                      style={{ fontFamily: "var(--sans)" }}
                    />
                  </div>
                )}

                {/* Consent */}
                {!codeSent && (
                  <label className="flex items-start gap-3 text-sm text-[var(--muted)] text-left">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[var(--rule)] bg-[var(--bg)] text-[var(--accent)]"
                    />
                    <span>I agree to receive my report and occasional biblical finance insights from Talanthos.</span>
                  </label>
                )}

                {/* Send code button */}
                {!codeSent && (
                  <TxButton onClick={handleSendCode} size="lg" disabled={isSubmitting || !firstName.trim() || !email.includes("@")}>
                    {isSubmitting ? "Sending..." : "Send verification code"}
                  </TxButton>
                )}

                {/* Code input */}
                {codeSent && (
                  <>
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
                        autoFocus
                        className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 pl-11 pr-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm tracking-[0.3em] text-center"
                        style={{ fontFamily: "var(--mono)", fontSize: 18 }}
                      />
                    </div>

                    <TxButton onClick={handleVerify} size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Verifying..." : "Verify & begin quiz"}
                    </TxButton>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={countdown > 0 || isSubmitting}
                        className="text-sm text-[var(--accent)] hover:underline disabled:text-[var(--muted)] disabled:no-underline transition-colors"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                      </button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-[#b85a3d] text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div
                className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[var(--muted)]"
                style={{ fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                <span className="flex items-center gap-1.5"><Check className="h-3 w-3" />Verified delivery</span>
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
