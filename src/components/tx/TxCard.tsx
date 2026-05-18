"use client";

import TxIcon from "./TxIcon";

interface TxCardProps {
  eyebrow?: string;
  title?: string;
  icon?: string;
  children: React.ReactNode;
  tone?: "default" | "warm" | "cool" | "verse";
}

export default function TxCard({ eyebrow, title, icon, children, tone = "default" }: TxCardProps) {
  const toneClass =
    tone === "verse"
      ? "bg-[var(--surface-2)] border-[var(--accent-line)]"
      : tone === "cool"
      ? "bg-[var(--surface-2)]"
      : "bg-[var(--surface)]";

  return (
    <section
      className={`flex flex-col gap-3.5 rounded-2xl border border-[var(--rule)] p-7 shadow-[var(--shadow)] ${toneClass}`}
    >
      {(eyebrow || icon) && (
        <header className="flex items-center gap-2.5">
          {icon && (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <TxIcon name={icon} size={18} />
            </span>
          )}
          {eyebrow && (
            <span className="font-[var(--mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {eyebrow}
            </span>
          )}
        </header>
      )}
      {title && <h3 className="font-[var(--serif)] text-[22px] text-[var(--ink)] m-0">{title}</h3>}
      <div>{children}</div>
    </section>
  );
}
