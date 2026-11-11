import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "brand", className }: BadgeProps) {
  const variantStyles = {
    brand: "bg-surface-tint text-brand border-brand/20",
    success: "bg-success/10 text-success border-success/20",
    neutral: "bg-border/60 text-ink-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

