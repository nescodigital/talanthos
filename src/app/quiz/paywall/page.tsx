"use client";

import { useEffect, Suspense, useState } from "react";
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
  Heart,
} from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { TextEffect } from "@/components/ui/text-effect";
import { BlurFade } from "@/components/ui/blur-fade";

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

const TIERS = [
  { amount: 999, label: "$9.99", desc: "Access the full report" },
  { amount: 1399, label: "$13.99", desc: "Support the work" },
  { amount: 1799, label: "$17.99", desc: "Most people choose this", popular: true },
  { amount: 2999, label: "$29.99", desc: "Go above and beyond" },
];

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const session = searchParams.get("session");
  const email = searchParams.get("email");
  const [customAmount, setCustomAmount] = useState("");

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
            <BlurFade delay={0.1}>
              <h2 className="text-center text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 36px)" }}>
                What&apos;s Inside Your Report
              </h2>
            </BlurFade>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {VALUE_ITEMS.map((item, i) => (
                <BlurFade key={item.title} delay={0.15 + i * 0.08}>
                  <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="flex gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                      <item.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--ink)]">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{item.desc}</p>
                    </div>
                  </motion.div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Pricing + CTA */}
        <section className="px-5 sm:px-6 lg:px-14 py-16">
          <BlurFade delay={0.1}>
            <div className="mx-auto max-w-[600px] text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Choose what it is worth to you</p>
              <h2 className="mt-3 text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 32px)" }}>
                Pay what feels right
              </h2>
              <p className="mt-4 text-[var(--ink-soft)]" style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, fontStyle: "italic", paddingLeft: 16, borderLeft: "2px solid var(--accent-soft)" }}>
                We rely on the generosity of people like you to keep building resources that help believers steward money faithfully.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {TIERS.map((tier) => (
                  <Link
                    key={tier.amount}
                    href={`/checkout?amount=${tier.amount}&type=${encodeURIComponent(type || "")}`}
                    className="relative flex flex-col items-center rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-4 sm:p-5 text-center shadow-[var(--shadow)] transition-all hover:-translate-y-px hover:border-[var(--accent-line)] hover:shadow-[0_12px_30px_-16px_rgba(40,30,10,0.25)]"
                  >
                    {tier.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider">
                        <Heart className="h-3 w-3" /> Most chosen
                      </span>
                    )}
                    <span className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 400 }}>
                      {tier.label}
                    </span>
                    <span className="mt-1 text-xs text-[var(--muted)]">{tier.desc}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)] mb-3">Or choose your own amount</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[var(--ink)] text-lg">$</span>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    placeholder="15"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-24 rounded-lg border border-[var(--rule-strong)] bg-[var(--bg)] px-3 py-2 text-center text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]"
                    style={{ fontFamily: "var(--serif)", fontSize: 18 }}
                  />
                  <Link
                    href={`/checkout?amount=${Math.max(1000, parseInt(customAmount || "15", 10) * 100)}&type=${encodeURIComponent(type || "")}`}
                    className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(40,30,10,0.6)]"
                  >
                    Continue
                  </Link>
                </div>
                <p className="mt-2 text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)" }}>Minimum $10</p>
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-[var(--rule-strong)] bg-[var(--surface)] p-4">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)] mb-2">Have a promo code?</p>
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="text"
                    placeholder="META20"
                    className="w-32 rounded-lg border border-[var(--rule-strong)] bg-[var(--bg)] px-3 py-2 text-center text-[var(--ink)] uppercase outline-none transition-colors focus:border-[var(--accent)]"
                    style={{ fontFamily: "var(--mono)", fontSize: 13, letterSpacing: "0.08em" }}
                  />
                  <span className="text-xs text-[var(--muted)]">Applied at checkout</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-[var(--muted)]">
                <p className="flex items-center justify-center gap-1.5"><Shield className="h-3.5 w-3.5" />Instant email delivery</p>
                <p className="flex items-center justify-center gap-1.5"><Lock className="h-3.5 w-3.5" />Secure checkout via Stripe</p>
                <p className="flex items-center justify-center gap-1.5"><Zap className="h-3.5 w-3.5" />Delivered within 30 minutes</p>
              </div>
            </div>
          </BlurFade>
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
