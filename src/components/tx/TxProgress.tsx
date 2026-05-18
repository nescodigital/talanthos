"use client";

interface TxProgressProps {
  step: number;
  total: number;
}

export default function TxProgress({ step, total }: TxProgressProps) {
  const pct = Math.max(0, Math.min(1, step / total));
  return (
    <div className="flex flex-col gap-2 mb-14">
      <div className="flex justify-between font-[var(--mono)] text-[11px] text-[var(--muted)] uppercase tracking-[0.18em]">
        <span>
          Question {step} of {total}
        </span>
        <span>{Math.round(pct * 100)}%</span>
      </div>
      <div className="h-0.5 bg-[var(--rule)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-500"
          style={{ width: `${pct * 100}%`, transitionTimingFunction: "cubic-bezier(.22,.61,.36,1)" }}
        />
      </div>
    </div>
  );
}
