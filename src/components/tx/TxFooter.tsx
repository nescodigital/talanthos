"use client";

import Link from "next/link";
import TxLockup from "./TxLockup";

export default function TxFooter() {
  return (
    <footer className="px-4 sm:px-6 lg:px-14 pt-10 pb-8 border-t border-[var(--rule)] flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="inline-flex items-center leading-[0]">
          <TxLockup size="md" />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="#" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            About
          </Link>
          <Link href="#" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            The Four Types
          </Link>
          <Link href="#" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            Journal
          </Link>
          <Link href="/privacy" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            Privacy
          </Link>
          <Link href="/terms" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            Terms
          </Link>
          <a href="mailto:support@talanthos.com" className="text-[var(--ink-2)] no-underline text-[13px] border-b border-transparent pb-0.5 transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]">
            Contact
          </a>
        </div>
      </div>
      <div className="font-[var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        &copy; {new Date().getFullYear()} Talanthos &nbsp;&middot;&nbsp; All Scripture quoted in the
        spirit of stewardship, not endorsement.
      </div>
    </footer>
  );
}
