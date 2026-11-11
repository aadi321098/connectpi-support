import React, { Suspense } from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { SearchResults } from "@/components/search/SearchResults";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Help Articles",
  description: "Search for help topics, guides, and error solutions across ConnectPi products.",
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbs = [
    { label: "Help Center", href: "/" },
    { label: "Search" },
  ];

  return (
    <div className="py-8 md:py-12 safe-padding-inline">
      <Container className="max-w-4xl">
        <Breadcrumb items={breadcrumbs} />

        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
            Search Help Center
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="py-16 flex items-center justify-center text-ink-muted">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
          }
        >
          <SearchResults />
        </Suspense>
      </Container>
    </div>
  );
}
