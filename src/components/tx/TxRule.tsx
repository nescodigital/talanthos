"use client";

interface TxRuleProps {
  width?: number;
}

export default function TxRule({ width = 60 }: TxRuleProps) {
  return (
    <svg
      width={width}
      height="10"
      viewBox="0 0 60 10"
      fill="none"
      aria-hidden="true"
      style={{ color: "var(--accent)" }}
    >
      <line x1="0" y1="5" x2="22" y2="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="30" cy="5" r="1.4" fill="currentColor" />
      <line x1="38" y1="5" x2="60" y2="5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
