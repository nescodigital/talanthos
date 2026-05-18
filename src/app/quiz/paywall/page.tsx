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

const TYPE_NAMES: Record<string, string> = {
  builder: "The Builder",
  steward: "The Steward",
  sower: "The Sower",
  visionary: "The Visionary",
};

const TYPE_GRADIENTS: Record<string, string> = {
  builder: "from-slate-700 to-slate-900",
  steward: "from-amber-700/40 to-amber-900/60",
  sower: "from-emerald-700/40 to-emerald-900/60",
  visionary: "from-violet-700/40 to-violet-900/60",
};

const PREVIEWS = [
  { label: "Your 4-Dimensional Score" },
  { label: "30-Day Action Plan" },
  { label: "Scripture Foundations" },
  { label: "Your Growth Roadmap" },
];

const VALUE_ITEMS = [
  {
    icon: Compass,
    title: "Your 4-Dimensional Score",
    desc: "Detailed breakdown of how you score on Builder, Steward, Sower, and Visionary scales",
  },
  {
    icon: BookOpen,
    title: "30 Curated Scripture Passages",
    desc: "Carefully selected verses for your specific type, with reflections",
  },
  {
    icon: TrendingUp,
    title: "Personalized Growth Roadmap",
    desc: "Your specific blind spots and how to address them step by step",
  },
  {
    icon: Target,
    title: "30-Day Action Plan",
    desc: "Daily micro-actions designed for your archetype",
  },
  {
    icon: Banknote,
    title: "Debt Strategy for Your Type",
    desc: "The right debt approach for your type — others may not work",
  },
  {
    icon: LineChart,
    title: "Investment Philosophy",
    desc: "How your type should think about growing wealth biblically",
  },
  {
    icon: HandHeart,
    title: "Giving Strategy",
    desc: "Tithing and generosity calibrated to your strengths and blind spots",
  },
  {
    icon: Sparkles,
    title: "Your Hidden Gift",
    desc: "The unique way God has wired you to handle money — and how to use it",
  },
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
  const gradient = TYPE_GRADIENTS[type || ""] || TYPE_GRADIENTS.steward;

  return (
    <div className="flex min-h-full flex-col">
      {/* Section 1 — Hero */}
      <section className="px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Quiz Complete — Your Report Is Ready
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Your Full {typeName} Report
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-foreground-muted">
            A 47-page personalized financial blueprint, rooted in Scripture and tailored to how God
            wired you.
          </p>

          {/* Preview Gallery */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
            {PREVIEWS.map((preview, i) => (
              <motion.div
                key={preview.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`flex flex-col items-center justify-center rounded-lg bg-gradient-to-br ${gradient} p-4 transition-transform hover:scale-[1.03]`}
              >
                <div className="aspect-[3/4] w-full rounded bg-white/10 blur-[4px] transition-all hover:blur-[2px]" />
                <p className="mt-3 text-xs font-medium text-foreground/80">{preview.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 2 — What's Inside */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-semibold text-foreground md:text-3xl">
            What&apos;s Inside Your Report
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {VALUE_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-4 rounded-xl border border-border bg-bg-elevated p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-foreground-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Pricing + CTA */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-[540px] rounded-2xl border border-border bg-bg-elevated px-8 py-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-foreground-muted">
            One-Time Purchase
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="font-display text-5xl font-bold text-foreground">$19</span>
            <span className="text-lg text-foreground-muted line-through">$47</span>
          </div>
          <p className="mt-2 text-sm text-foreground-muted">No subscription. Yours forever.</p>

          <Link
            href="/coming-soon-checkout"
            className="mt-8 block w-full rounded-lg bg-accent py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover"
          >
            Get My Report Now
          </Link>

          <div className="mt-6 space-y-2 text-xs text-foreground-muted">
            <p className="flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              30-day money-back guarantee
            </p>
            <p className="flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Secure checkout via Stripe
            </p>
            <p className="flex items-center justify-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Delivered to your inbox in 60 seconds
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-foreground-muted hover:text-foreground transition-colors">
            Maybe later — send me a reminder
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function PaywallPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      }
    >
      <PaywallContent />
    </Suspense>
  );
}
