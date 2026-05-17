"use client";

import { motion } from "framer-motion";
import { BiblicalTypeData } from "@/lib/quiz/types";
import { Shield, Scale, Sprout, Crown } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Shield,
  Scale,
  Sprout,
  Crown,
};

interface TypeRevealProps {
  type: BiblicalTypeData;
}

export default function TypeReveal({ type }: TypeRevealProps) {
  const Icon = iconMap[type.iconName] || Shield;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
        <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        You are
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-foreground md:text-5xl">
        {type.name}
      </h1>
      <p className="mt-3 text-foreground-muted">{type.archetype}</p>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
        {type.shortDescription}
      </p>
    </motion.div>
  );
}
