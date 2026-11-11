import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  // Find parent item for mobile single-link back button
  const parentItem = items.length > 1 ? items[items.length - 2] : null;
  const currentItem = items[items.length - 1];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      {/* Mobile view (< 768px): Shows "← Parent" */}
      {parentItem && parentItem.href && (
        <div className="md:hidden">
          <Link
            href={parentItem.href}
            className="inline-flex items-center text-sm font-medium text-brand hover:text-brand-hover transition-colors py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 shrink-0" />
            <span>{parentItem.label}</span>
          </Link>
        </div>
      )}

      {/* Tablet & Desktop view (≥ 768px): Full trail */}
      <ol className="hidden md:flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-border shrink-0" />
              )}
              {isLast || !item.href ? (
                <span
                  className="font-medium text-ink truncate max-w-[280px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-brand transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

