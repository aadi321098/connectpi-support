"use client";

import React, { useEffect, useState } from "react";
import { TocHeading } from "@/lib/content/schema";
import { ChevronDown, AlignLeft } from "lucide-react";

interface TocProps {
  headings: TocHeading[];
  variant?: "disclosure" | "rail" | "all";
}

export function Toc({ headings, variant = "all" }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <>
      {/* Mobile & Tablet (<1280px): Collapsible Disclosure */}
      {(variant === "disclosure" || variant === "all") && (
        <div className="xl:hidden my-6 border border-border rounded-r-lg bg-surface p-4 shadow-xs">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-sm font-heading font-bold text-ink"
            aria-expanded={isOpen}
            aria-label="Table of contents"
          >
            <span className="flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-brand" />
              <span>On this page</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <nav aria-label="Table of contents" className="mt-3 pt-3 border-t border-border">
              <ul className="space-y-2 text-sm">
                {headings.map((h) => (
                  <li
                    key={h.id}
                    className={h.level === 3 ? "pl-3 text-xs" : ""}
                  >
                    <a
                      href={`#${h.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block py-1 hover:text-brand transition-colors ${
                        activeId === h.id
                          ? "text-brand font-semibold"
                          : "text-ink-body"
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Wide Desktop (≥1280px): Sticky Right Rail */}
      {(variant === "rail" || variant === "all") && (
        <nav
          aria-label="On this page"
          className="hidden xl:block w-60 2xl:w-64 shrink-0 sticky top-[calc(var(--header-height)+24px)] max-h-[calc(100dvh-var(--header-height)-48px)] overflow-y-auto pl-5 border-l border-border"
        >
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-brand" />
            <span>On this page</span>
          </h4>
          <ul className="space-y-1.5 text-sm">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <li
                  key={h.id}
                  className={h.level === 3 ? "pl-3 text-xs" : ""}
                >
                  <a
                    href={`#${h.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`block py-1 transition-colors leading-snug ${
                      isActive
                        ? "text-brand font-semibold border-l-2 border-brand -ml-[17px] pl-[15px]"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
