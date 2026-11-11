"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { defaultSearchProvider } from "@/lib/search/fuse-provider";
import { SearchResult } from "@/lib/search/provider";
import { SearchField } from "./SearchField";
import { Badge } from "@/components/content/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, HelpCircle, Search as SearchIcon, AlertCircle } from "lucide-react";
import products from "@/content/products.json";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const initialApp = searchParams.get("app") || "all";

  const [activeApp, setActiveApp] = useState<string>(initialApp);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setActiveApp(initialApp);
  }, [initialApp]);

  useEffect(() => {
    let isCancelled = false;

    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await defaultSearchProvider.search(query, {
          product: activeApp,
          limit: 50,
        });

        if (!isCancelled) {
          setResults(searchResults);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      isCancelled = true;
    };
  }, [query, activeApp]);

  return (
    <div className="w-full">
      {/* Search Input Bar on Results Page */}
      <div className="mb-8">
        <SearchField initialQuery={query} initialProduct={activeApp} size="large" />
      </div>

      {/* Filter Chips Bar (All Products, ConnectPi Web, ConnectPi App, Blade Rush) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-border">
        <span className="text-xs uppercase font-bold text-ink-muted mr-1">
          Filter App:
        </span>
        <button
          onClick={() => setActiveApp("all")}
          className={`px-3.5 py-1.5 rounded-r-pill text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus ${
            activeApp === "all"
              ? "bg-brand text-white shadow-xs"
              : "bg-surface border border-border text-ink hover:bg-surface-tint"
          }`}
        >
          All Apps ({query ? results.length : 0})
        </button>
        {products.map((p) => {
          const isSelected = activeApp === p.slug;
          return (
            <button
              key={p.slug}
              onClick={() => setActiveApp(p.slug)}
              className={`px-3.5 py-1.5 rounded-r-pill text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus ${
                isSelected
                  ? "bg-brand text-white shadow-xs"
                  : "bg-surface border border-border text-ink hover:bg-surface-tint"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: isSelected ? "#FFFFFF" : p.accent }}
              />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Query status header */}
      {query && (
        <div className="mb-6 flex items-center justify-between text-sm text-ink-muted">
          <span>
            {isLoading
              ? "Searching..."
              : `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
          </span>
        </div>
      )}

      {/* Results List */}
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((res) => (
            <Link
              key={res.id}
              href={res.url}
              className="block p-5 sm:p-6 rounded-r-xl border border-border bg-surface hover:border-brand hover:shadow-xs transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: res.productAccent }}
                    >
                      {res.productName}
                    </span>
                    <Badge variant="neutral">{res.categoryTitle}</Badge>
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-ink group-hover:text-brand transition-colors mb-1.5">
                    {res.title}
                  </h3>

                  <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                    {res.summary}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      ) : !isLoading && query ? (
        /* Zero Results State with Help Tips */
        <div className="p-8 sm:p-12 border border-border rounded-r-xl bg-surface text-center max-w-xl mx-auto my-8 shadow-xs">
          <div className="w-12 h-12 rounded-r-lg bg-surface-tint text-brand flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-ink">
            No results found for &quot;{query}&quot;
          </h3>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            We couldn’t find any articles matching your search. Here are some tips:
          </p>

          <ul className="text-xs sm:text-sm text-ink-muted text-left mt-4 mb-6 space-y-2 max-w-xs mx-auto list-disc pl-5">
            <li>Check for spelling errors or typos.</li>
            <li>Try searching for broader terms (e.g. &quot;login&quot;, &quot;points&quot;).</li>
            <li>Switch product filter to &quot;All Apps&quot;.</li>
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/" variant="secondary" size="small">
              Browse Topics
            </Button>
            <Button href="/contact" variant="primary" size="small">
              Contact Support
            </Button>
          </div>
        </div>
      ) : !query ? (
        /* Empty State (user navigated to /search without typing) */
        <div className="py-12 text-center text-ink-muted">
          <p className="text-base">Type a search term above to find guides and answers.</p>
        </div>
      ) : null}
    </div>
  );
}
