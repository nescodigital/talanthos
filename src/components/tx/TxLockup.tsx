"use client";

import TxMark from "./TxMark";
import TxText from "./TxText";

interface TxLockupProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

const sizes = {
  sm: { mark: 32, text: 16, gap: 12 },
  md: { mark: 42, text: 22, gap: 14 },
  lg: { mark: 56, text: 30, gap: 18 },
};

export default function TxLockup({ size = "md", dark = false }: TxLockupProps) {
  const s = sizes[size];
  return (
    <span className="tx-lockup inline-flex items-center" style={{ gap: s.gap }}>
      <TxMark size={s.mark} dark={dark} />
      <TxText height={s.text} dark={dark} />
    </span>
  );
}
