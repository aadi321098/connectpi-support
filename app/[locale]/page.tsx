import React from "react";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SearchField } from "@/components/search/SearchField";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/content/Badge";
import { ProductIcon } from "@/components/ui/ProductIcon";
import {
  getProducts,
  getFeaturedArticles,
  getSharedCategories,
} from "@/lib/content";
import {
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import siteConfig from "@/content/site.json";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = getProducts();
  const featuredArticles = getFeaturedArticles(locale);
  const sharedCategories = getSharedCategories(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in";

  // Schema.org WebSite JSON-LD with SearchAction
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "ConnectPi Support",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="w-full pb-16 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Hero Section */}
      <section
        aria-labelledby="hero-title"
        className="w-full bg-brand-deep text-white py-12 sm:py-16 md:py-20 safe-padding-inline"
      >
        <Container className="text-center max-w-3xl">
          <h1
            id="hero-title"
            className="text-white font-heading font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight"
          >
            Hi, how can we help?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-footer-text/90 max-w-xl mx-auto">
            Search our knowledge base or browse support guides by product below.
          </p>

          {/* Interactive SearchField with App Selector & Combobox */}
          <div className="mt-8 max-w-2xl mx-auto text-left">
            <SearchField size="large" />
          </div>

          {/* Popular Search Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-footer-text/70 mr-1">
              Popular:
            </span>
            {siteConfig.popularSearches.map((term) => (
              <Chip
                key={term}
                variant="outlined"
                href={`/search?q=${encodeURIComponent(term)}`}
                className="text-xs py-1 min-h-[36px]"
              >
                {term}
              </Chip>
            ))}
          </div>
        </Container>
      </section>

      {/* Choose Your Product Section */}
      <section
        id="products"
        aria-labelledby="products-title"
        className="mt-12 md:mt-16 safe-padding-inline"
      >
        <Container>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2
                id="products-title"
                className="font-heading font-bold text-2xl sm:text-3xl text-ink"
              >
                Choose your app
              </h2>
              <p className="mt-1 text-sm sm:text-base text-ink-muted">
                Select your app to find tailored troubleshooting guides and FAQs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <Card
                key={product.slug}
                href={`/${product.slug}`}
                className="flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-11 h-11 rounded-r-lg flex items-center justify-center text-white shadow-sm shrink-0"
                      style={{ backgroundColor: product.accent }}
                    >
                      <ProductIcon slug={product.slug} size={22} />
                    </span>
                    <h3 className="font-heading font-bold text-lg text-ink group-hover:text-brand transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border flex items-center text-sm font-semibold text-brand group-hover:text-brand-hover">
                  <span>Browse {product.name} Help</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular Articles & Need Help Card Section (PRD 5.2 H4 & H5: Desktop 2/3 List, 1/3 Card) */}
      <section
        id="popular"
        aria-labelledby="popular-articles-title"
        className="mt-14 md:mt-20 safe-padding-inline"
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Popular Articles Column (Spans 2 cols on Desktop) */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2
                  id="popular-articles-title"
                  className="font-heading font-bold text-2xl text-ink"
                >
                  Popular articles
                </h2>
              </div>

              <div className="space-y-3.5">
                {featuredArticles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/${art.product}/${art.category}/${art.slug}`}
                    className="block p-5 rounded-r-xl border border-border bg-surface hover:border-brand hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                            {art.product}
                          </span>
                          <span className="text-ink-muted text-xs">•</span>
                          <span className="text-xs text-ink-muted">
                            {art.category}
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-base sm:text-lg text-ink group-hover:text-brand transition-colors mb-1">
                          {art.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-ink-muted shrink-0 mt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{art.readingTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* "Still Need Help?" Sidebar Card (1 col on Desktop, stacked on Mobile) */}
            <div>
              <div className="p-6 rounded-r-xl bg-surface border border-border shadow-xs flex flex-col justify-between">
                <div className="w-12 h-12 rounded-r-lg bg-surface-tint text-brand flex items-center justify-center mb-4">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-ink mb-2">
                  Still need help?
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed mb-6">
                  Cannot find what you are looking for? Our support team can assist with account, login, or bug issues.
                </p>
                <div className="space-y-3">
                  <Button href="/contact" variant="primary" className="w-full justify-center">
                    Contact Support
                  </Button>
                  <Button
                    href="/contact?type=bug"
                    variant="secondary"
                    className="w-full justify-center"
                  >
                    Report a Bug
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Help for Every App (Shared Topics) Section */}
      <section
        id="topics"
        aria-labelledby="shared-topics-title"
        className="mt-14 md:mt-20 safe-padding-inline"
      >
        <Container>
          <div className="mb-6">
            <h2
              id="shared-topics-title"
              className="font-heading font-bold text-xl sm:text-2xl text-ink"
            >
              Help for every app
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Common security policies, community guidelines, and reporting guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sharedCategories.map((cat) => (
              <Card
                key={cat.slug}
                href={`/shared/${cat.slug}`}
                className="flex items-start gap-4 p-5"
              >
                <div className="w-10 h-10 rounded-r-lg bg-surface-tint flex items-center justify-center text-brand shrink-0">
                  {cat.slug === "safety-privacy" ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <HelpCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-ink">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
