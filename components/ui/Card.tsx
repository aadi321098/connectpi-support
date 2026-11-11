import React from "react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  isExternal?: boolean;
}

export function Card({
  children,
  href,
  isExternal = false,
  className,
  ...props
}: CardProps) {
  const baseStyles =
    "block bg-surface border border-border rounded-r-xl p-5 md:p-6 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

  const hoverStyles = href
    ? "hover:border-brand hover:shadow-sm active:border-brand-hover cursor-pointer group"
    : "";

  const combinedClassName = cn(baseStyles, hoverStyles, className);

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
