"use client";

import TxMark from "./TxMark";
import TxText from "./TxText";

interface TxLockupProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

const sizes = {
  sm: { mark: 32, text: 26, gap: 10 },
  md: { mark: 42, text: 34, gap: 12 },
  lg: { mark: 56, text: 45, gap: 14 },
};

export default function TxLockup({ size = "md", dark = false }: TxLockupProps) {
  const s = sizes[size];
  return (
    <span className="tx-lockup inline-flex items-center" style={{ gap: s.gap }}>
      <TxMark size={s.mark} dark={dark} />
      <span style={{ transform: "translateY(6px)", display: "inline-block" }}>
        <TxText height={s.text} dark={dark} />
      </span>
    </span>
  );
}
