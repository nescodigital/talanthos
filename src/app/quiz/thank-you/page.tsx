"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { CheckCircle2, Mail, Clock, FileText } from "lucide-react";
import Link from "next/link";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const typeName = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "Your Biblical Money Type";

  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-16 text-center">
          <div className="max-w-[560px] w-full">
            <div className="flex justify-center mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            <h1
              className="tx-display"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: 0 }}
            >
              Thank you for your purchase
            </h1>

            <p className="mt-4 text-lg text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
              Your <strong>{typeName}</strong> report is being prepared.
            </p>

            <div className="mt-10 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 text-left space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <FileText className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-[var(--ink)]">Your report is generating</p>
                  <p className="text-sm text-[var(--ink-2)]">
                    A 20-page personalized PDF tailored to your answers and type.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <Mail className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-[var(--ink)]">Delivered to your inbox</p>
                  <p className="text-sm text-[var(--ink-2)]">
                    You will receive an email with your PDF attached within a few minutes.
                    Check your spam folder if you do not see it.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <Clock className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium text-[var(--ink)]">Estimated time</p>
                  <p className="text-sm text-[var(--ink-2)]">
                    Most reports are ready in under 2 minutes. Complex profiles may take up to 5 minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--muted)]">
                Did not receive it?{" "}
                <Link href="/contact" className="text-[var(--accent)] hover:underline">
                  Contact us
                </Link>
                {" "}and we will resend it immediately.
              </p>

              <TxButton size="lg" icon="arrow" onClick={() => window.location.href = "/"}>
                Back to home
              </TxButton>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
