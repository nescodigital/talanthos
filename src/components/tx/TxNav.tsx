"use client";

import { useState } from "react";
import Link from "next/link";
import TxLockup from "./TxLockup";

interface TxNavProps {
  minimal?: boolean;
}

export default function TxNav({ minimal = false }: TxNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "The Four Types", href: "/the-four-types" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`relative flex items-center gap-4 px-4 sm:px-6 lg:px-14 py-[18px] border-b border-[var(--rule)] ${minimal ? "justify-center" : "justify-between"}`}>
      <Link href="/" className="appearance-none border-0 bg-transparent text-[var(--ink)] inline-flex items-center cursor-pointer p-0 leading-[0] shrink-0">
        <TxLockup size="sm" />
      </Link>

      {!minimal && (
        <div className="hidden md:flex gap-6 items-center">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-[var(--font-cormorant)] font-medium text-[var(--ink)] no-underline text-[13px] tracking-[0.12em] uppercase py-1.5 relative transition-colors duration-250 hover:text-[var(--accent)]"
            >
              <span className="after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-px after:bg-[var(--accent)] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
                {l.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {!minimal && (
        <button
          className={`md:hidden appearance-none border-0 bg-transparent w-10 h-10 flex-col justify-center items-center gap-[5px] cursor-pointer p-0 shrink-0 ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="block h-[1.5px] w-[22px] bg-[var(--ink)] transition-all duration-250" />
          <span className="block h-[1.5px] w-[22px] bg-[var(--ink)] transition-all duration-200" />
          <span className="block h-[1.5px] w-[22px] bg-[var(--ink)] transition-all duration-250" />
        </button>
      )}

      {!minimal && menuOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-[var(--bg)] border-b border-[var(--rule)] px-4 sm:px-6 lg:px-14 pt-2 pb-5 flex flex-col z-10"
          style={{ animation: "txFade .22s ease both" }}
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-[var(--ink)] no-underline font-[var(--font-cormorant)] font-medium text-[15px] tracking-[0.12em] uppercase border-b border-[var(--rule)] last:border-b-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
