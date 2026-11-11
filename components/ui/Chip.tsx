import React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "tinted" | "outlined" | "active";
  href?: string;
  isExternal?: boolean;
  leftIcon?: React.ReactNode;
}

export function Chip({
  children,
  variant = "tinted",
  href,
  isExternal = false,
  leftIcon,
  className,
  ...props
}: ChipProps) {
  const baseStyles =
    "inline-flex items-center justify-center min-h-[44px] px-4 py-1.5 rounded-r-pill text-sm font-medium transition-colors select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

  const variantStyles = {
    tinted:
      "bg-surface-tint text-brand border border-transparent hover:bg-surface-tint/80 active:bg-surface-tint/60",
    outlined:
      "bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/10 active:bg-white/20",
    active:
      "bg-brand text-white border border-brand shadow-sm",
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {leftIcon && <span className="mr-1.5 shrink-0">{leftIcon}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {content}
    </button>
  );
}
