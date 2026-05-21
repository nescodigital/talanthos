"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";

const TYPE_NAMES: Record<string, string> = {
  builder: "The Builder",
  guardian: "The Guardian",
  giver: "The Giver",
  visionary: "The Visionary",
};

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(100, "Email is too long"),
  marketing_consent: z.boolean(),
});

type EmailForm = z.infer<typeof emailSchema>;

function EmailCaptureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const session = searchParams.get("session");

  useEffect(() => {
    if (!type || !session || !TYPE_NAMES[type]) {
      router.push("/");
    }
  }, [type, session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { marketing_consent: true },
  });

  const onSubmit = async (data: EmailForm) => {
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          primary_type: type,
          session_id: session,
          marketing_consent: data.marketing_consent,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError("email", { message: result.error || "Something went wrong. Please try again." });
        return;
      }

      router.push(
        `/quiz/paywall?type=${encodeURIComponent(type || "")}&session=${encodeURIComponent(session || "")}&email=${encodeURIComponent(data.email)}`
      );
    } catch {
      setError("email", { message: "Network error. Please try again." });
    }
  };

  const typeName = TYPE_NAMES[type || ""] || "Your Type";

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[600px]"
        >
          <h1
            className="text-center text-[var(--ink)] m-0"
            style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
            }}
          >
            Where should we send your full report?
          </h1>
          <p className="mt-5 text-center text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)", fontSize: 18 }}>
            Your personalized {typeName} report is ready. Enter your email below and we&apos;ll send it
            to you within 60 seconds of checkout.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-full border border-[var(--rule-strong)] bg-[var(--bg)] py-3.5 px-5 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm font-[inherit]"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <p className="text-sm text-[var(--muted)]">
              We&apos;ll also send you a free 3-part Biblical Finance email series. Unsubscribe
              anytime.
            </p>

            <label className="flex items-start gap-3 text-sm text-[var(--muted)]">
              <input
                {...register("marketing_consent")}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[var(--rule)] bg-[var(--bg)] text-[var(--accent)]"
              />
              <span>
                I agree to receive emails from Talanthos about my report and occasional biblical
                finance insights.
              </span>
            </label>

            <TxButton type="submit" size="lg" disabled={isSubmitting} icon={null}>
              {isSubmitting ? "Saving..." : "Send My Report \u2192"}
            </TxButton>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Your email is safe with us
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" />
              No spam, ever
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Unsubscribe with one click
            </span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/quiz"
              className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              Want to retake the quiz?
            </Link>
          </div>
        </motion.div>
      </main>
      <TxFooter />
    </div>
  );
}

export default function EmailCapturePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--rule)] border-t-[var(--accent)]" />
        </div>
      }
    >
      <EmailCaptureContent />
    </Suspense>
  );
}
