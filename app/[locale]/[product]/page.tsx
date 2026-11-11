import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { Sidebar } from "@/components/nav/Sidebar";
import { Card } from "@/components/ui/Card";
import { ContactCTA } from "@/components/content/ContactCTA";
import {
  getProduct,
  getProducts,
  getCategories,
  getSharedCategories,
  getArticlesByCategory,
} from "@/lib/content";
import { ArrowRight, ExternalLink } from "lucide-react";

export const dynamicParams = false;

interface ProductHubPageProps {
  params: Promise<{
    locale: string;
    product: string;
  }>;
}

export async function generateStaticParams() {
  const products = [...getProducts().map((p) => p.slug), "shared"];
  return products.map((product) => ({
    locale: "en",
    product,
  }));
}

export async function generateMetadata({
  params,
}: ProductHubPageProps): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = getProduct(productSlug);

  if (!product) return {};

  return {
    title: `${product.name} Help Center`,
    description: product.description,
  };
}

export default async function ProductHubPage({ params }: ProductHubPageProps) {
  const { locale, product: productSlug } = await params;
  setRequestLocale(locale);

  const product = getProduct(productSlug);
  if (!product) {
    notFound();
  }

  const productCategories = getCategories(locale, productSlug);
  const sharedCategories = getSharedCategories(locale);

  const breadcrumbs = [
    { label: "Help Center", href: "/" },
    { label: product.name },
  ];

  return (
    <div className="w-full pb-16 safe-padding-inline">
      {/* App Hero Banner with Tinted Accent */}
      <section
        className="w-full py-8 md:py-12 border-b border-border mb-8"
        style={{ backgroundColor: product.tint }}
      >
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-4">
              <span
                className="w-14 h-14 rounded-r-xl flex items-center justify-center font-heading font-bold text-2xl text-white shadow-md shrink-0"
                style={{ backgroundColor: product.accent }}
              >
                {product.initial}
              </span>
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                  {product.name} Help Center
                </h1>
                <p className="text-sm sm:text-base text-ink-muted mt-1 max-w-xl">
                  {product.description}
                </p>
              </div>
            </div>

            {product.url && product.url !== "[PLAY STORE URL]" && product.url !== "[GAME URL]" && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-r-md bg-surface text-ink text-sm font-semibold border border-border shadow-xs hover:bg-surface-tint transition-colors shrink-0"
              >
                <span>Launch App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </Container>
      </section>

      {/* Main Hub Body */}
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Sidebar */}
          <Sidebar
            product={product}
            productCategories={productCategories}
            sharedCategories={sharedCategories}
          />

          {/* Topics Grid */}
          <div className="flex-1 w-full max-w-prose">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink mb-6">
              Browse {product.name} Topics
            </h2>

            <div className="space-y-6">
              {productCategories.map((category) => {
                const articles = getArticlesByCategory(locale, productSlug, category.slug);

                return (
                  <Card key={category.slug} className="p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-ink">
                          {category.title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-1">
                          {category.description}
                        </p>
                      </div>
                      <Link
                        href={`/${productSlug}/${category.slug}`}
                        className="text-xs font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1 shrink-0"
                      >
                        <span>View all</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <ul className="space-y-2.5">
                      {articles.slice(0, 3).map((art) => (
                        <li key={art.slug}>
                          <Link
                            href={`/${productSlug}/${category.slug}/${art.slug}`}
                            className="text-sm font-medium text-ink hover:text-brand flex items-center justify-between group"
                          >
                            <span className="group-hover:underline underline-offset-2">
                              {art.title}
                            </span>
                            <span className="text-xs text-ink-muted shrink-0 ml-2">
                              {art.readingTime}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>

            <ContactCTA app={productSlug} />
          </div>
        </div>
      </Container>
    </div>
  );
}
