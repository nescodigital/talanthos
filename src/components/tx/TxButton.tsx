"use client";

import TxIcon from "./TxIcon";

interface TxButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary";
  size?: "sm" | "md" | "lg";
  icon?: string | null;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export default function TxButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon = "arrow",
  disabled = false,
  type = "button",
  className = "",
}: TxButtonProps) {
  const sizeClasses = {
    sm: "px-[18px] py-[10px] text-[13px]",
    md: "px-7 py-3.5 text-[15px]",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2.5 appearance-none border-0 cursor-pointer
        font-[var(--sans)] font-medium rounded-full transition-all
        hover:-translate-y-px active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variant === "primary" ? "bg-[var(--accent)] text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_12px_24px_-16px_rgba(40,30,10,0.6)] hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_18px_30px_-16px_rgba(40,30,10,0.7)]" : ""}
        ${className}
      `}
    >
      <span>{children}</span>
      {icon && <TxIcon name={icon} size={16} strokeWidth={1.6} />}
    </button>
  );
}
