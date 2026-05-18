"use client";

interface TxMarkProps {
  size?: number;
  dark?: boolean;
}

export default function TxMark({ size = 56, dark = false }: TxMarkProps) {
  const src = dark ? "/assets/talanthos-mark-dark.png" : "/assets/talanthos-mark.png";
  return (
    <img
      className="tx-mark-img block"
      src={src}
      alt="Talanthos mark"
      style={{ width: size + "px", height: "auto" }}
    />
  );
}
