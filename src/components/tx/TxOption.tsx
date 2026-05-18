"use client";

import TxIcon from "./TxIcon";

interface TxOptionProps {
  letter: string;
  text: string;
  selected?: boolean;
  onClick: () => void;
}

export default function TxOption({ letter, text, selected, onClick }: TxOptionProps) {
  return (
    <button
      className={`
        appearance-none border bg-[var(--surface)] text-[var(--ink)] cursor-pointer
        grid items-center gap-4 text-left rounded-[14px] font-[inherit]
        transition-all duration-200
        hover:border-[var(--accent-line)] hover:bg-[var(--surface-2)] hover:translate-x-0.5
        ${selected ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--rule)]"}
      `}
      style={{ gridTemplateColumns: "36px 1fr 24px", padding: "18px 22px" }}
      onClick={onClick}
    >
      <span
        className={`
          w-7 h-7 inline-flex items-center justify-center rounded-full
          font-[var(--mono)] text-[11px] text-[var(--ink-2)] transition-all duration-200
          ${selected ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border border-[var(--rule-strong)]"}
        `}
      >
        {letter}
      </span>
      <span className="text-base leading-[1.45] text-[var(--ink)] font-[var(--serif)]">{text}</span>
      <span className="text-[var(--muted)] transition-all duration-200 justify-self-end">
        <TxIcon name={selected ? "check" : "arrow"} size={16} strokeWidth={1.6} />
      </span>
    </button>
  );
}
