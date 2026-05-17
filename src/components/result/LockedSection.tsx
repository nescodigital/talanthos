"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";

interface LockedSectionProps {
  typeName: string;
}

export default function LockedSection({ typeName }: LockedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 rounded-2xl border border-border bg-bg-elevated/50 p-8 text-center md:p-12"
    >
      <Lock className="mx-auto mb-4 h-8 w-8 text-foreground-muted" strokeWidth={1.5} />
      <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
        Your Full 47-Page Personalized Report includes...
      </h3>
      <ul className="mx-auto mt-6 max-w-md space-y-3 text-left text-foreground-muted">
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Your 4-dimensional financial score
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          30-day action plan tailored to your type
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          30 Scripture verses curated for your journey
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Specific debt strategy for {typeName}
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Investment philosophy aligned with {typeName}
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          Giving strategy that fits your wiring
        </li>
      </ul>
      <Link
        href="/coming-soon"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover"
      >
        Get My Full Report
      </Link>
    </motion.div>
  );
}
