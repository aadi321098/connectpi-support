import React from "react";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Search, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import products from "@/content/products.json";
import siteConfig from "@/content/site.json";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full pb-16 md:pb-24">
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

          {/* Hero Search Bar Placeholder */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-2">
            <div className="relative flex-1">
              <label htmlFor="hero-search-input" className="sr-only">
                Search articles, guides, topics
              </label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="hero-search-input"
                type="search"
                placeholder="Search articles, guides, topics..."
                className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-r-md bg-surface text-ink text-base border-none focus:outline-none focus:ring-2 focus:ring-focus placeholder:text-ink-muted/80 shadow-sm"
              />
            </div>
            <Button
              variant="accent"
              size="large"
              className="sm:w-auto w-full font-bold"
            >
              Search
            </Button>
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
                Choose your product
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
                      className="w-11 h-11 rounded-r-lg flex items-center justify-center font-heading font-bold text-lg text-white shadow-sm shrink-0"
                      style={{ backgroundColor: product.accent }}
                    >
                      {product.initial}
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

      {/* Shared Topics & Need Help Section */}
      <section className="mt-12 md:mt-16 safe-padding-inline">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              href="/shared/safety-privacy"
              className="flex items-start gap-4 p-5"
            >
              <div className="w-10 h-10 rounded-r-lg bg-surface-tint flex items-center justify-center text-brand shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-ink">
                  Safety & Privacy
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Community guidelines, privacy policies, and security best practices.
                </p>
              </div>
            </Card>

            <Card
              href="/shared/account"
              className="flex items-start gap-4 p-5"
            >
              <div className="w-10 h-10 rounded-r-lg bg-surface-tint flex items-center justify-center text-brand shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-ink">
                  Account & Login
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Pi sign-in, account settings, and common login errors across apps.
                </p>
              </div>
            </Card>

            <div className="bg-surface-tint/60 border border-border rounded-r-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-ink">
                  Still need help?
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Our support team is ready to help resolve your questions or bugs.
                </p>
              </div>
              <div className="mt-4">
                <Button href="/contact" size="small" variant="primary">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
