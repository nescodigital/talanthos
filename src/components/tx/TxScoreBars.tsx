"use client";

interface ScoreMap {
  visionary?: number;
  guardian?: number;
  giver?: number;
  builder?: number;
}

interface TxScoreBarsProps {
  scores: ScoreMap;
  highlight: string;
}

const order: (keyof ScoreMap)[] = ["visionary", "guardian", "giver", "builder"];
const labels: Record<string, string> = {
  visionary: "Vision",
  guardian: "Guard",
  giver: "Give",
  builder: "Build",
};

export default function TxScoreBars({ scores, highlight }: TxScoreBarsProps) {
  const max = Math.max(1, ...order.map((k) => scores[k] || 0));
  return (
    <div className="w-full max-w-[480px] mt-3 grid grid-cols-2 gap-x-7 gap-y-3.5">
      {order.map((k) => {
        const v = scores[k] || 0;
        const pct = (v / max) * 100;
        const isHi = k === highlight;
        return (
          <div key={k} className={isHi ? "is-hi" : ""}>
            <div className={`flex justify-between font-[var(--mono)] text-[11px] uppercase tracking-[0.16em] mb-1.5 ${isHi ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
              <span>{labels[k]}</span>
              <span>{v}</span>
            </div>
            <div className="h-0.5 bg-[var(--rule)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${isHi ? "bg-[var(--accent)]" : "bg-[var(--ink-2)]"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
