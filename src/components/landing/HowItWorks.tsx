"use client";

import { motion } from "framer-motion";
import { ClipboardList, Search, BookOpen } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer 7 questions",
    description: "90 seconds, no email needed to start",
  },
  {
    icon: Search,
    title: "Discover your Biblical Money Type",
    description: "Builder, Steward, Sower, or Visionary",
  },
  {
    icon: BookOpen,
    title: "Get your personalized growth plan",
    description: "Rooted in Scripture and tailored to you",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-16 text-center font-display text-3xl font-semibold text-foreground md:text-4xl">
          How it works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-xl border border-border bg-bg-elevated p-8"
            >
              <step.icon className="mb-5 h-8 w-8 text-accent" strokeWidth={1.5} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-foreground-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
