import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SearchField } from "@/components/search/SearchField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProducts } from "@/lib/content";
import { Home, ArrowRight, LifeBuoy } from "lucide-react";

export default function NotFoundPage() {
  const products = getProducts();

  return (
    <div className="py-12 sm:py-20 safe-padding-inline">
      <Container className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-tint text-brand font-heading font-bold text-2xl mb-6 shadow-sm border border-brand/20">
          404
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-base text-ink-muted">
          Sorry, we couldn’t find the page or article you’re looking for. Search our help center or browse our products below.
        </p>

        {/* Search Field */}
        <div className="mt-8 text-left max-w-lg mx-auto">
          <SearchField placeholder="Try searching for your issue..." />
        </div>

        {/* Product Quick Links */}
        <div className="mt-12 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted/80 mb-4 text-center">
            Or browse by product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {products.map((product) => (
              <Card
                key={product.slug}
                href={`/${product.slug}`}
                className="p-4 hover:border-brand transition-colors text-center group flex flex-col items-center"
              >
                <span className="font-heading font-semibold text-sm text-ink group-hover:text-brand">
                  {product.name}
                </span>
                <span className="text-xs text-ink-muted mt-1 line-clamp-1">
                  {product.description}
                </span>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="secondary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
          <Button href="/contact" variant="primary" leftIcon={<LifeBuoy className="w-4 h-4" />}>
            Contact Support
          </Button>
        </div>
      </Container>
    </div>
  );
}
