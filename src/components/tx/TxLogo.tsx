"use client";

interface TxLogoProps {
  height?: number;
  dark?: boolean;
}

export default function TxLogo({ height = 72, dark = false }: TxLogoProps) {
  const src = dark ? "/assets/talanthos-logo-dark.png" : "/assets/talanthos-logo.png";
  return (
    <img
      className="tx-logo-img block"
      src={src}
      alt="Talanthos — Faith. Finances. Purpose."
      height={height}
      style={{ width: "auto" }}
    />
  );
}
