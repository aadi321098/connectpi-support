import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { Sidebar } from "@/components/nav/Sidebar";
import { Toc } from "@/components/nav/Toc";
import { RelatedArticles } from "@/components/nav/RelatedArticles";
import { FeedbackWidget } from "@/components/content/FeedbackWidget";
import { Badge } from "@/components/content/Badge";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import {
  getProduct,
  getCategory,
  getCategories,
  getSharedCategories,
  getArticle,
  getRelatedArticles,
  getAllArticlePaths,
} from "@/lib/content";
import { Clock, Calendar } from "lucide-react";

export const dynamicParams = false;

interface ArticlePageProps {
  params: Promise<{
    locale: string;
    product: string;
    category: string;
    article: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllArticlePaths("en");
  return paths.map((p) => ({
    locale: p.locale,
    product: p.product,
    category: p.category,
    article: p.article,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { locale, product: productSlug, category: categorySlug, article: articleSlug } = await params;
  const product = getProduct(productSlug);
  const article = getArticle(locale, productSlug, categorySlug, articleSlug);

  if (!product || !article) return {};

  const title = `${article.title} | ${product.name} Help`;
  const description = article.summary;

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in"}/${productSlug}/${categorySlug}/${articleSlug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.updated,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, product: productSlug, category: categorySlug, article: articleSlug } = await params;
  setRequestLocale(locale);

  const product = getProduct(productSlug);
  const category = getCategory(locale, productSlug, categorySlug);
  const article = getArticle(locale, productSlug, categorySlug, articleSlug);

  if (!product || !category || !article) {
    notFound();
  }

  const productCategories = getCategories(locale, productSlug);
  const sharedCategories = getSharedCategories(locale);
  const relatedArticles = getRelatedArticles(locale, article);

  const breadcrumbs = [
    { label: "Help Center", href: "/" },
    ...(productSlug !== "shared"
      ? [{ label: product.name, href: `/${product.slug}` }]
      : []),
    { label: category.title, href: `/${productSlug}/${categorySlug}` },
    { label: article.title },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://support.connectpi.in";
  const articleUrl = `${siteUrl}/${productSlug}/${categorySlug}/${articleSlug}`;

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.label,
      item: b.href ? `${siteUrl}${b.href}` : undefined,
    })),
  };

  // Schema.org Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    dateModified: article.updated,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    author: {
      "@type": "Organization",
      name: "ConnectPi Team",
      url: "https://connectpi.in",
    },
    publisher: {
      "@type": "Organization",
      name: "ConnectPi",
      url: "https://connectpi.in",
    },
  };

  // Schema.org FAQPage JSON-LD if article has FAQs
  const faqJsonLd =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <div className="py-8 md:py-12 safe-padding-inline">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Container>
        <Breadcrumb items={breadcrumbs} />

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start justify-between">
          {/* Left Sidebar on Desktop (>= 1024px) */}
          <Sidebar
            product={product}
            productCategories={productCategories}
            sharedCategories={sharedCategories}
            activeCategorySlug={categorySlug}
            activeArticleSlug={articleSlug}
          />

          {/* Center Main Article Column (Max reading width 720px) */}
          <article className="flex-1 w-full max-w-prose min-w-0">
            {/* Article Header */}
            <header className="border-b border-border pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-brand">
                  {category.title}
                </span>
                {article.platform?.map((p) => (
                  <Badge key={p} variant="neutral">
                    {p}
                  </Badge>
                ))}
              </div>

              <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-ink leading-tight">
                {article.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-ink-muted" />
                  <span>Last updated {article.updated}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-ink-muted" />
                  <span>{article.readingTime}</span>
                </span>
              </div>
            </header>

            {/* Mobile & Tablet TOC Disclosure (< 1280px) */}
            <Toc headings={article.headings} variant="disclosure" />

            {/* Compiled MDX Body */}
            <MDXRenderer source={article.content} />

            {/* Helpful Feedback Widget */}
            <FeedbackWidget articlePath={`/${productSlug}/${categorySlug}/${articleSlug}`} />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />
          </article>

          {/* Right Rail TOC on Wide Screens (>= 1280px) */}
          <Toc headings={article.headings} variant="rail" />
        </div>
      </Container>
    </div>
  );
}
