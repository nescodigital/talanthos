"use client";

import { useState } from "react";
import Link from "next/link";
import TxLockup from "./TxLockup";

export default function TxNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "The Four Types", href: "/the-four-types" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="relative flex items-center justify-between px-4 sm:px-6 lg:px-14 py-[18px] border-b border-[var(--rule)]">
      {/* Left spacer — flex-1 so right side can balance */}
      <div className="hidden md:block flex-1" />

      {/* Logo — absolutely centered */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 appearance-none border-0 bg-transparent text-[var(--ink)] inline-flex items-center cursor-pointer p-0 leading-[0]"
      >
        <TxLockup size="sm" />
      </Link>

      {/* Desktop menu — right, flex-1, items pushed to end */}
      <div className="hidden md:flex flex-1 gap-6 lg:gap-8 items-center justify-end">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-[var(--sans)] text-[var(--ink-2)] no-underline text-[14px] py-1.5 relative transition-colors duration-250 hover:text-[var(--accent)] whitespace-nowrap"
          >
            <span className="after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-px after:bg-[var(--accent)] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100">
              {l.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile hamburger — right */}
      <button
        className={`md:hidden appearance-none border-0 bg-transparent w-10 h-10 flex flex-col justify-center items-center gap-[5px] cursor-pointer p-0 shrink-0 ml-auto ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span
          className="block h-[2px] w-[22px] bg-[var(--ink)] transition-all duration-250"
          style={{
            transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
          }}
        />
        <span
          className="block h-[2px] w-[22px] bg-[var(--ink)] transition-all duration-200"
          style={{
            opacity: menuOpen ? 0 : 1,
          }}
        />
        <span
          className="block h-[2px] w-[22px] bg-[var(--ink)] transition-all duration-250"
          style={{
            transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute left-0 right-0 top-full bg-[var(--bg)] border-b border-[var(--rule)] px-4 sm:px-6 lg:px-14 pt-2 pb-5 flex flex-col z-10"
          style={{ animation: "txFade .22s ease both" }}
        >
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-[var(--ink)] no-underline font-[var(--sans)] text-[15px] border-b border-[var(--rule)] last:border-b-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
