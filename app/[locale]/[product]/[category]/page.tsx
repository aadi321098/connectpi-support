import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { Sidebar } from "@/components/nav/Sidebar";
import { TopicSwitcher } from "@/components/nav/TopicSwitcher";
import { ContactCTA } from "@/components/content/ContactCTA";
import { Badge } from "@/components/content/Badge";
import {
  getProduct,
  getCategory,
  getCategories,
  getSharedCategories,
  getArticlesByCategory,
  getAllCategoryPaths,
} from "@/lib/content";
import { ArrowRight, Clock } from "lucide-react";

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    product: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllCategoryPaths("en");
  return paths.map((p) => ({
    locale: p.locale,
    product: p.product,
    category: p.category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, product: productSlug, category: categorySlug } = await params;
  const product = getProduct(productSlug);
  const category = getCategory(locale, productSlug, categorySlug);

  if (!product || !category) return {};

  const title = `${category.title} — ${product.name} Help`;
  const description = category.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in"}/${productSlug}/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, product: productSlug, category: categorySlug } = await params;
  setRequestLocale(locale);

  const product = getProduct(productSlug);
  const category = getCategory(locale, productSlug, categorySlug);

  if (!product || !category) {
    notFound();
  }

  const productCategories = getCategories(locale, productSlug);
  const sharedCategories = getSharedCategories(locale);
  const articles = getArticlesByCategory(locale, productSlug, categorySlug);

  const breadcrumbs = [
    { label: "Help Center", href: "/" },
    ...(productSlug !== "shared"
      ? [{ label: product.name, href: `/${product.slug}` }]
      : []),
    { label: category.title },
  ];

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.label,
      item: b.href
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in"}${b.href}`
        : undefined,
    })),
  };

  return (
    <div className="py-8 md:py-12 safe-padding-inline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Container>
        <Breadcrumb items={breadcrumbs} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Sidebar on Desktop */}
          <Sidebar
            product={product}
            productCategories={productCategories}
            sharedCategories={sharedCategories}
            activeCategorySlug={categorySlug}
          />

          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-prose">
            {/* Mobile / Tablet Topic Switcher */}
            <TopicSwitcher
              product={product}
              categories={productCategories}
              activeCategorySlug={categorySlug}
            />

            {/* Category Header */}
            <header className="border-b border-border pb-6 mb-8">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand">
                {product.name}
              </span>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink mt-1">
                {category.title}
              </h1>
              <p className="mt-2 text-base text-ink-muted leading-relaxed">
                {category.description}
              </p>
            </header>

            {/* Articles List */}
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/${productSlug}/${categorySlug}/${art.slug}`}
                    className="block p-5 sm:p-6 rounded-r-xl border border-border bg-surface hover:border-brand hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h2 className="font-heading font-bold text-lg sm:text-xl text-ink group-hover:text-brand transition-colors">
                            {art.title}
                          </h2>
                          {art.platform?.map((p) => (
                            <Badge key={p} variant="neutral">
                              {p}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                          {art.summary}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {art.readingTime}
                          </span>
                          <span>•</span>
                          <span>Updated {art.updated}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border rounded-r-xl text-center bg-surface-tint/30">
                <p className="text-sm text-ink-muted">
                  No articles published in this category yet.
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <ContactCTA app={productSlug} />
          </div>
        </div>
      </Container>
    </div>
  );
}
