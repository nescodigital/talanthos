"use client";

interface TxEyebrowProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

export default function TxEyebrow({ children, align = "left" }: TxEyebrowProps) {
  return (
    <div
      className="inline-flex items-center gap-2.5"
      style={{
        textAlign: align,
        color: "var(--accent)",
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase" as const,
        letterSpacing: "0.22em",
      }}
    >
      <span style={{ width: 22, height: 1, background: "var(--accent)", opacity: 0.7 }} />
      <span>{children}</span>
      <span style={{ width: 22, height: 1, background: "var(--accent)", opacity: 0.7 }} />
    </div>
  );
}
