"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--parchment-gradient:repeating-linear-gradient(100deg,var(--bg)_0%,var(--bg)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--bg)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--accent-aurora-1)_10%,var(--accent-aurora-2)_15%,var(--accent-aurora-3)_20%,var(--accent-aurora-4)_25%,var(--accent-aurora-1)_30%)]
            [background-image:var(--parchment-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            [filter:blur(10px)]
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--parchment-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-overlay
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};
