"use client";

interface TxTextProps {
  height?: number;
  dark?: boolean;
}

export default function TxText({ height = 32, dark = false }: TxTextProps) {
  const src = dark ? "/assets/talanthos-text-dark.png" : "/assets/talanthos-text.png";
  return (
    <img
      className="tx-text-img block"
      src={src}
      alt="Talanthos — Faith. Finances. Purpose."
      height={height}
      style={{ width: "auto" }}
    />
  );
}
