"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  TrendingUp,
  Target,
  Banknote,
  LineChart,
  HandHeart,
  Sparkles,
  Shield,
  Lock,
  Zap,
  CheckCircle2,
} from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";

const TYPE_NAMES: Record<string, string> = {
  builder: "The Builder",
  guardian: "The Guardian",
  giver: "The Giver",
  visionary: "The Visionary",
};

const TYPE_GRADIENTS: Record<string, string> = {
  builder: "from-slate-700 to-slate-900",
  guardian: "from-amber-700/40 to-amber-900/60",
  giver: "from-emerald-700/40 to-emerald-900/60",
  visionary: "from-violet-700/40 to-violet-900/60",
};

const PREVIEWS = [
  { label: "Your 4-Dimensional Score" },
  { label: "30-Day Action Plan" },
  { label: "Scripture Foundations" },
  { label: "Your Growth Roadmap" },
];

const VALUE_ITEMS = [
  { icon: Compass, title: "Your 4-Dimensional Score", desc: "Detailed breakdown of how you score on Vision, Guard, Give, and Build scales" },
  { icon: BookOpen, title: "30 Curated Scripture Passages", desc: "Carefully selected verses for your specific type, with reflections" },
  { icon: TrendingUp, title: "Personalized Growth Roadmap", desc: "Your specific blind spots and how to address them step by step" },
  { icon: Target, title: "30-Day Action Plan", desc: "Daily micro-actions designed for your archetype" },
  { icon: Banknote, title: "Debt Strategy for Your Type", desc: "The right debt approach for your type. Others may not work." },
  { icon: LineChart, title: "Investment Philosophy", desc: "How your type should think about growing wealth biblically" },
  { icon: HandHeart, title: "Giving Strategy", desc: "Tithing and generosity calibrated to your strengths and blind spots" },
  { icon: Sparkles, title: "Your Hidden Gift", desc: "The unique way God has wired you to handle money, and how to use it" },
];

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const session = searchParams.get("session");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!type || !TYPE_NAMES[type]) {
      router.push("/");
    }
  }, [type, router]);

  const typeName = TYPE_NAMES[type || ""] || "Your Type";
  const gradient = TYPE_GRADIENTS[type || ""] || TYPE_GRADIENTS.guardian;

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col">
        {/* Section 1: Hero */}
        <section className="px-5 sm:px-6 lg:px-14 pt-16 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-line)] bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Quiz Complete. Your Report Is Ready
            </span>
            <h1 className="mt-6 text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05 }}>
              <TextEffect per="word" preset="blur" as="span">
                {`Your Full ${typeName} Report`}
              </TextEffect>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
              <TextEffect per="word" preset="slide" delay={0.3} as="span">
                A 47-page personalized financial blueprint, rooted in Scripture and tailored to how God wired you.
              </TextEffect>
            </p>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
              {PREVIEWS.map((preview, i) => (
                <motion.div key={preview.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`flex flex-col items-center justify-center rounded-lg bg-gradient-to-br ${gradient} p-4 transition-transform hover:scale-[1.03]`}>
                  <div className="aspect-[3/4] w-full rounded bg-white/10 blur-[4px] transition-all hover:blur-[2px]" />
                  <p className="mt-3 text-xs font-medium text-white/80">{preview.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 2: What's Inside */}
        <section className="px-5 sm:px-6 lg:px-14 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 36px)" }}>
              What&apos;s Inside Your Report
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {VALUE_ITEMS.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                    <item.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--ink)]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Pricing + CTA */}
        <section className="px-5 sm:px-6 lg:px-14 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mx-auto max-w-[540px] rounded-2xl border border-[var(--rule)] bg-[var(--surface)] px-8 py-12 text-center shadow-[var(--shadow)]" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }} />
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Limited intro pricing</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 400 }}>$9.99</span>
              <span className="text-lg text-[var(--muted)] line-through">$19.99</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">No subscription. One PDF. Yours forever.</p>
            <p className="mt-3 text-sm" style={{ fontFamily: "var(--serif)", color: "var(--ink-soft)", fontStyle: "italic" }}>
              This is not a generic download. It is a 47-page guidebook written for {typeName}, based on your exact answers.
            </p>
            <Link href="/coming-soon-checkout"
              className="mt-8 block w-full rounded-full bg-[var(--accent)] py-4 text-base font-medium text-white transition-all hover:-translate-y-px hover:shadow-[0_18px_30px_-16px_rgba(40,30,10,0.7)] text-center">
              Get My Report Now
            </Link>
            <div className="mt-6 space-y-2 text-xs text-[var(--muted)]">
              <p className="flex items-center justify-center gap-1.5"><Shield className="h-3.5 w-3.5" />60-day money-back guarantee</p>
              <p className="flex items-center justify-center gap-1.5"><Lock className="h-3.5 w-3.5" />Secure checkout via Stripe</p>
              <p className="flex items-center justify-center gap-1.5"><Zap className="h-3.5 w-3.5" />Delivered to your inbox in 60 seconds</p>
            </div>
          </motion.div>
          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors">Maybe later. Send me a reminder.</Link>
          </div>
        </section>
      </main>
      <TxFooter />
    </div>
  );
}

export default function PaywallPage() {
  return (
    <Suspense fallback={<div className="flex min-h-full items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--rule)] border-t-[var(--accent)]" /></div>}>
      <PaywallContent />
    </Suspense>
  );
}
