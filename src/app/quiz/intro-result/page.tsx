"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroResultPage() {
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCta(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <blockquote className="font-display text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
          &ldquo;Each one should use whatever gift he has received to serve others, faithfully
          administering God&apos;s grace in its various forms.&rdquo;
        </blockquote>
        <p className="mt-4 text-foreground-muted">— 1 Peter 4:10</p>

        <p className="mt-10 text-foreground-muted">
          Before we reveal your Biblical Money Type, remember: there is no &ldquo;better&rdquo; type.
          Each one reflects how God has uniquely wired you to handle wealth.
        </p>

        {showCta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <Link
              href="/quiz/result"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover"
            >
              Show My Result
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
