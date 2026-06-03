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
  ArrowRight,
  ChevronDown,
  Star,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TextEffect } from "@/components/ui/text-effect";
import { BlurFade } from "@/components/ui/blur-fade";
import { trackEvent } from "@/lib/meta-pixel";

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

const TYPE_TAGLINES: Record<string, string> = {
  builder: "You build. But are you building on rock or sand?",
  guardian: "You protect. But what are you guarding against growth?",
  giver: "You give. But who fills your cup when it runs dry?",
  visionary: "You see far. But who holds the rope while you climb?",
};

const VALUE_STACK = [
  { icon: Compass, title: "Your 4-Dimensional Score", desc: "Detailed breakdown of how you score on Vision, Guard, Give, and Build scales", value: 29 },
  { icon: BookOpen, title: "30 Curated Scripture Passages", desc: "Carefully selected verses for your specific type, with reflections", value: 39 },
  { icon: TrendingUp, title: "Personalized Growth Roadmap", desc: "Your specific blind spots and how to address them step by step", value: 49 },
  { icon: Target, title: "30-Day Action Plan", desc: "Daily micro-actions designed for your archetype", value: 34 },
  { icon: Banknote, title: "Debt Strategy for Your Type", desc: "The right debt approach for your type. Others may not work.", value: 27 },
  { icon: LineChart, title: "Investment Philosophy", desc: "How your type should think about growing wealth biblically", value: 34 },
  { icon: HandHeart, title: "Giving Strategy", desc: "Tithing and generosity calibrated to your strengths and blind spots", value: 27 },
  { icon: Sparkles, title: "Your Hidden Gift", desc: "The unique way God has wired you to handle money, and how to use it", value: 19 },
];

const TOTAL_VALUE = VALUE_STACK.reduce((sum, item) => sum + item.value, 0);

const TIERS = [
  { amount: 999, label: "$9.99", desc: "Access the full report" },
  { amount: 1399, label: "$13.99", desc: "Support the work" },
  { amount: 1799, label: "$17.99", desc: "Most people choose this", popular: true },
  { amount: 2999, label: "$29.99", desc: "Go above and beyond" },
];

const FAQS = [
  {
    q: "What exactly do I receive?",
    a: "A personalized PDF document, delivered to your inbox within 30 minutes. It includes your full type profile, 4-dimensional score breakdown, 30-day action plan, Scripture foundations, debt and giving strategy, and your personalized growth roadmap. Everything is tailored to your specific answers.",
  },
  {
    q: "Is this really personalized, or is it a generic template?",
    a: "Every report is generated based on your 15 quiz answers. Your scores on the four archetype dimensions, your demographic context, and your text reflections all feed into a unique profile. No two reports are identical.",
  },
  {
    q: "What if I am not satisfied?",
    a: "Email us within 30 days and we will refund you in full, no questions asked. We are building this in faith, and we trust that if it does not serve you, you should not pay for it.",
  },
  {
    q: "How long until I receive it?",
    a: "Most reports are delivered within 10 to 30 minutes. In rare cases, up to an hour. Check your spam folder if you do not see it.",
  },
  {
    q: "Can I share this with my spouse or pastor?",
    a: "Yes. The PDF is yours to keep, print, and share with anyone in your household or church leadership. We only ask that you do not resell or redistribute it publicly.",
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--rule)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-[var(--ink)] pr-4">{question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-sm text-[var(--ink-2)] leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
}

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
  const tagline = TYPE_TAGLINES[type || ""] || "You have taken the first step. The next one matters more.";

  useEffect(() => {
    if (type) {
      trackEvent("InitiateCheckout", {
        email: email || undefined,
        contentName: typeName,
        customData: { session_id: session, primary_type: type },
      });
    }
  }, [type, session, email, typeName]);

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      {/* Full-page aurora background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <AuroraBackground showRadialGradient className="h-full w-full" />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <TxNav />
        <main className="flex-1 flex flex-col">
          {/* Section 1: Problem + Hook */}
          <section className="px-5 sm:px-6 lg:px-14 pt-12 sm:pt-16 pb-8 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-line)] bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Quiz Complete. Your Report Is Ready
              </span>
              <h1 className="mt-6 text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.05 }}>
                <TextEffect per="word" preset="blur" as="span">
                  {`Most believers never discover why they keep making the same money mistakes.`}
                </TextEffect>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)" }}>
                <TextEffect per="word" preset="slide" delay={0.3} as="span">
                  {tagline}
                </TextEffect>
              </p>
            </motion.div>
          </section>

          {/* Section 2: The Gap */}
          <section className="px-5 sm:px-6 lg:px-14 py-10">
            <BlurFade delay={0.1}>
              <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/70 backdrop-blur-sm p-6 sm:p-8 shadow-[var(--shadow)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                    <Star className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[var(--ink)]" style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400 }}>
                      You know your type. But knowing is not enough.
                    </h3>
                    <p className="mt-2 text-sm text-[var(--ink-2)] leading-relaxed">
                      The quiz gave you a label. A direction. But labels without a map leave you wandering. 
                      What does it actually mean for your budget? Your debt? Your marriage? Your giving? 
                      Your investment decisions? Without a personalized blueprint, you will default to whatever 
                      culture, fear, or habit tells you to do. Same patterns. Same frustrations. Same prayers.
                    </p>
                  </div>
                </div>
              </div>
            </BlurFade>
          </section>

          {/* Section 3: What's Inside — VALUE STACK */}
          <section className="px-5 sm:px-6 lg:px-14 py-12">
            <div className="mx-auto max-w-4xl">
              <BlurFade delay={0.1}>
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Your personalized blueprint</p>
                  <h2 className="mt-3 text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 3vw, 38px)" }}>
                    Here is everything you unlock
                  </h2>
                  <p className="mt-3 text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55 }}>
                    Not templates. Not generic advice. Every page is written for <em>you</em>.
                  </p>
                </div>
              </BlurFade>

              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {VALUE_STACK.map((item, i) => (
                  <BlurFade key={item.title} delay={0.12 + i * 0.06}>
                    <div className="flex items-start gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface)]/60 backdrop-blur-sm p-5 shadow-[var(--shadow)]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <item.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-[var(--ink)] text-sm">{item.title}</h3>
                          <span className="shrink-0 text-xs text-[var(--muted)] line-through" style={{ fontFamily: "var(--mono)" }}>${item.value}</span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--ink-2)] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>

              {/* Total value bar */}
              <BlurFade delay={0.6}>
                <div className="mt-8 flex items-center justify-center gap-4 rounded-xl border border-[var(--accent-line)] bg-[var(--accent-soft)]/30 p-5">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Total value if sold separately</p>
                    <p className="mt-1 text-[var(--ink)] line-through" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 32px)" }}>
                      ${TOTAL_VALUE}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-[var(--accent-line)]" />
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">You pay what it is worth to you</p>
                    <p className="mt-1 text-[var(--accent)]" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400 }}>
                      Starting at $9.99
                    </p>
                  </div>
                </div>
              </BlurFade>
            </div>
          </section>

          {/* Section 4: Social Proof Strip */}
          <section className="px-5 sm:px-6 lg:px-14 py-6">
            <BlurFade delay={0.1}>
              <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-center gap-6 sm:gap-10">
                <div className="flex items-center gap-2 text-[var(--ink-2)]">
                  <Users className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="text-xs font-medium">Personalized to your answers</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--ink-2)]">
                  <Star className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="text-xs font-medium">Rooted in Scripture</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--ink-2)]">
                  <Clock className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="text-xs font-medium">Delivered in ~30 min</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--ink-2)]">
                  <FileText className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="text-xs font-medium">20 pages personalized</span>
                </div>
              </div>
            </BlurFade>
          </section>

          {/* Section 5: Pricing + CTA */}
          <section id="pricing" className="px-5 sm:px-6 lg:px-14 py-14">
            <BlurFade delay={0.1}>
              <div className="mx-auto max-w-[640px] text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Choose what it is worth to you</p>
                <h2 className="mt-3 text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 32px)" }}>
                  Pay what feels right
                </h2>
                <p className="mt-4 text-[var(--ink-soft)]" style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.5, fontStyle: "italic", paddingLeft: 16, borderLeft: "2px solid var(--accent-soft)", textAlign: "left" }}>
                  We rely on the generosity of people like you to keep building resources that help believers steward money faithfully. We reinvest what we earn into the mission.
                </p>

                {/* Tiers */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                  {TIERS.map((tier) => (
                    <Link
                      key={tier.amount}
                      href={`/checkout?amount=${tier.amount}&type=${encodeURIComponent(type || "")}&session=${encodeURIComponent(session || "")}`}
                      className={`relative flex flex-col items-center rounded-xl border p-4 sm:p-5 text-center transition-all hover:-translate-y-px hover:shadow-[0_12px_30px_-16px_rgba(40,30,10,0.25)] ${
                        tier.popular
                          ? "border-[var(--accent)] bg-[var(--accent-soft)]/40 shadow-[0_8px_24px_-12px_rgba(40,30,10,0.3)]"
                          : "border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow)] hover:border-[var(--accent-line)]"
                      }`}
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

                {/* Custom amount */}
                <div className="mt-5 rounded-xl border border-[var(--rule)] bg-[var(--surface)]/70 backdrop-blur-sm p-5 shadow-[var(--shadow)]">
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
                      href={`/checkout?amount=${Math.max(1000, parseInt(customAmount || "15", 10) * 100)}&type=${encodeURIComponent(type || "")}&session=${encodeURIComponent(session || "")}`}
                      className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(40,30,10,0.6)] inline-flex items-center gap-1.5"
                    >
                      Continue
                    </Link>
                  </div>
                  <p className="mt-2 text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)" }}>Minimum $10</p>
                </div>

                {/* Promo code */}
                <div className="mt-4 rounded-xl border border-dashed border-[var(--rule-strong)] bg-[var(--surface)]/50 p-4">
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

                {/* Trust signals */}
                <div className="mt-6 space-y-2 text-xs text-[var(--muted)]">
                  <p className="flex items-center justify-center gap-1.5"><Shield className="h-3.5 w-3.5" />Instant email delivery</p>
                  <p className="flex items-center justify-center gap-1.5"><Lock className="h-3.5 w-3.5" />Secure checkout via Stripe</p>
                  <p className="flex items-center justify-center gap-1.5"><Zap className="h-3.5 w-3.5" />Delivered within 30 minutes</p>
                </div>
              </div>
            </BlurFade>
          </section>

          {/* Section 6: Risk Reversal */}
          <section className="px-5 sm:px-6 lg:px-14 py-10">
            <BlurFade delay={0.1}>
              <div className="mx-auto max-w-2xl text-center rounded-2xl border border-[var(--rule)] bg-[var(--surface)]/60 backdrop-blur-sm p-6 sm:p-8 shadow-[var(--shadow)]">
                <div className="flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="mt-4 text-[var(--ink)]" style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px, 2.5vw, 26px)" }}>
                  30-Day Full Refund Promise
                </h3>
                <p className="mt-3 text-sm text-[var(--ink-2)] leading-relaxed max-w-lg mx-auto">
                  If you read your report and it does not give you at least one clear insight, one actionable step, or one moment of conviction about your stewardship, email us and we will refund you in full. No forms. No waiting. No guilt. We are building this on trust, not transactions.
                </p>
              </div>
            </BlurFade>
          </section>

          {/* Section 7: FAQ */}
          <section className="px-5 sm:px-6 lg:px-14 py-12">
            <div className="mx-auto max-w-2xl">
              <BlurFade delay={0.1}>
                <h2 className="text-center text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 32px)" }}>
                  Questions you might have
                </h2>
              </BlurFade>
              <div className="mt-8">
                {FAQS.map((faq, i) => (
                  <BlurFade key={i} delay={0.1 + i * 0.06}>
                    <AccordionItem question={faq.q} answer={faq.a} />
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>

          {/* Section 8: Final CTA */}
          <section className="px-5 sm:px-6 lg:px-14 py-14 text-center">
            <BlurFade delay={0.1}>
              <div className="mx-auto max-w-xl">
                <h2 className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.15 }}>
                  God already wired you for this.<br />Get the map.
                </h2>
                <p className="mt-4 text-[var(--ink-2)]" style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.55 }}>
                  You took the quiz because something in you knew your financial life could be more aligned, more intentional, more faithful. This report is the bridge between knowing your type and living it.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-px hover:shadow-[0_16px_32px_-16px_rgba(40,30,10,0.5)]"
                  >
                    Get My Full Report
                  </button>
                  <p className="mt-3 text-xs text-[var(--muted)]">Choose what it is worth to you. 30-day refund guarantee.</p>
                </div>
                <div className="mt-6">
                  <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors">Maybe later. Send me a reminder.</Link>
                </div>
              </div>
            </BlurFade>
          </section>
        </main>
        <TxFooter />
      </div>
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
