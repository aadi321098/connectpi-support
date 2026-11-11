"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/lib/content/schema";
import { ChevronDown } from "lucide-react";
import { Chip } from "@/components/ui/Chip";

interface TopicSwitcherProps {
  product: Product;
  categories: Category[];
  activeCategorySlug?: string;
}

export function TopicSwitcher({
  product,
  categories,
  activeCategorySlug,
}: TopicSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  return (
    <div className="lg:hidden mb-6">
      {/* Mobile view (<768px): Collapsible Disclosure */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-r-md text-sm font-semibold text-ink shadow-sm"
          aria-expanded={isOpen}
        >
          <span>
            Topic: <strong className="text-brand">{activeCategory?.title || "Select Topic"}</strong>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 p-2 bg-surface border border-border rounded-r-md shadow-sm space-y-1">
            {categories.map((cat) => {
              const isActive = cat.slug === activeCategorySlug;
              return (
                <Link
                  key={cat.slug}
                  href={`/${product.slug}/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-r-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-tint text-brand font-semibold"
                      : "text-ink hover:bg-surface-tint/60"
                  }`}
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Tablet view (768px - 1023px): Horizontal wrap chips */}
      <div className="hidden md:flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase font-bold text-ink-muted mr-1">
          Topics:
        </span>
        {categories.map((cat) => {
          const isActive = cat.slug === activeCategorySlug;
          return (
            <Chip
              key={cat.slug}
              variant={isActive ? "active" : "tinted"}
              href={`/${product.slug}/${cat.slug}`}
              className="text-xs py-1 min-h-[36px]"
            >
              {cat.title}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}

