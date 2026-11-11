import React from "react";
import Link from "next/link";
import { Callout } from "./Callout";
import { Steps, Step } from "./Steps";
import { Screenshot } from "./Screenshot";
import { Badge } from "./Badge";
import { Kbd } from "./Kbd";
import { ContactCTA } from "./ContactCTA";

export const mdxComponents = {
  // Custom allow-listed components
  Callout,
  Steps,
  Step,
  Screenshot,
  Badge,
  Kbd,
  Contact: ContactCTA,
  ContactCTA,

  // Custom standard elements
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className="font-heading font-bold text-xl sm:text-2xl text-ink mt-8 mb-4 pt-2 border-b border-border pb-2 scroll-mt-24 group flex items-center justify-between"
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="text-ink-muted/40 hover:text-brand text-sm opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1"
          aria-label={`Link to ${children}`}
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className="font-heading font-bold text-lg sm:text-xl text-ink mt-6 mb-3 scroll-mt-24"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-base sm:text-[17px] text-ink-body leading-relaxed mb-4"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc pl-6 mb-4 space-y-2 text-base text-ink-body"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal pl-6 mb-4 space-y-2 text-base text-ink-body"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    const className =
      "text-brand font-medium underline underline-offset-2 hover:text-brand-hover transition-colors";

    if (isInternal) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  },
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6 border border-border rounded-r-md">
      <table className="w-full text-left border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="bg-surface-tint/60 border-b border-border p-3 font-heading font-semibold text-ink"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-border p-3 text-ink-body" {...props}>
      {children}
    </td>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-surface-tint/80 text-brand px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <div className="overflow-x-auto my-6 p-4 rounded-r-lg bg-brand-deep text-white text-sm font-mono shadow-sm">
      <pre {...props}>{children}</pre>
    </div>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

