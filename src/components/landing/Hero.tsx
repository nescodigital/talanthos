"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl"
      >
        Discover Your Biblical Money Type
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted md:text-xl"
      >
        A free 90-second quiz reveals the financial archetype God wired into you
        — and the personalized path forward for your money.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10"
      >
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover"
        >
          Start the Free Quiz
        </Link>
      </motion.div>
    </section>
  );
}
