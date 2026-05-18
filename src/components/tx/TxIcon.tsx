"use client";

interface TxIconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function TxIcon({ name, size = 18, strokeWidth = 1.4, className = "" }: TxIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "crown":
      return (
        <svg {...common}>
          <path d="M3 17h18" />
          <path d="M4 17 5 8l4 4 3-6 3 6 4-4 1 9" />
          <circle cx="5" cy="7" r="0.9" />
          <circle cx="19" cy="7" r="0.9" />
          <circle cx="12" cy="3" r="0.9" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 4.5 3.5 7.5 8 9 4.5-1.5 8-4.5 8-9V6l-8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "open-hand":
      return (
        <svg {...common}>
          <path d="M5 12c0-3 1-5 2-5s2 1 2 4V5.5C9 4.7 9.7 4 10.5 4S12 4.7 12 5.5V9" />
          <path d="M12 5.5C12 4.7 12.7 4 13.5 4S15 4.7 15 5.5V10" />
          <path d="M15 7c0-.8.7-1.5 1.5-1.5S18 6.2 18 7v6c0 4-3 7-7 7s-6-2-7-5l-1-3" />
        </svg>
      );
    case "wall":
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h18" />
          <path d="M3 4v16M21 4v16" />
          <path d="M8 7v5M14 7v5M11 12v5M17 12v5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M4 12.5 9 17l11-11" />
        </svg>
      );
    case "warn":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" />
          <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "quote":
      return (
        <svg {...common}>
          <path d="M7 7h4v4c0 3-1.5 5-4 6" />
          <path d="M15 7h4v4c0 3-1.5 5-4 6" />
        </svg>
      );
    case "olive":
      return (
        <svg {...common}>
          <path d="M3 12c2-6 9-9 18-9-1 9-5 16-12 18-3 1-6-1-6-4 0-2 2-3 4-3" />
          <path d="M9 14c2-3 5-5 9-6" />
        </svg>
      );
    default:
      return null;
  }
}
