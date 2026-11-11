import React from "react";
import Link from "next/link";
import { Category, Product } from "@/lib/content/schema";
import { Icon } from "@/components/ui/Icon";

interface SidebarProps {
  product: Product;
  productCategories: Category[];
  sharedCategories: Category[];
  activeCategorySlug?: string;
  activeArticleSlug?: string;
}

export function Sidebar({
  product,
  productCategories,
  sharedCategories,
  activeCategorySlug,
}: SidebarProps) {
  return (
    <aside
      aria-label="Category Navigation"
      className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-[calc(var(--header-height)+24px)] max-h-[calc(100dvh-var(--header-height)-48px)] overflow-y-auto pr-4"
    >
      {/* Product Categories */}
      <div className="mb-6">
        <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-ink-muted mb-3 px-3">
          {product.name} Topics
        </h3>
        <ul className="space-y-1">
          {productCategories.map((category) => {
            const isActive =
              product.slug !== "shared" && activeCategorySlug === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={`/${product.slug}/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-r-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-tint text-brand font-semibold shadow-xs"
                      : "text-ink hover:text-brand hover:bg-surface-tint/50"
                  }`}
                >
                  <Icon
                    name={category.icon}
                    size={18}
                    className={isActive ? "text-brand" : "text-ink-muted"}
                  />
                  <span>{category.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Shared ("All Apps") Categories */}
      {sharedCategories.length > 0 && product.slug !== "shared" && (
        <div className="pt-4 border-t border-border">
          <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-ink-muted mb-3 px-3">
            All Apps Topics
          </h3>
          <ul className="space-y-1">
            {sharedCategories.map((category) => {
              const isActive =
                activeCategorySlug === category.slug;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/shared/${category.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-r-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-tint text-brand font-semibold"
                        : "text-ink hover:text-brand hover:bg-surface-tint/50"
                    }`}
                  >
                    <Icon
                      name={category.icon}
                      size={18}
                      className={isActive ? "text-brand" : "text-ink-muted"}
                    />
                    <span>{category.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}

