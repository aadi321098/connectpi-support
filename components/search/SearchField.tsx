"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import { defaultSearchProvider } from "@/lib/search/fuse-provider";
import { SearchResult } from "@/lib/search/provider";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import products from "@/content/products.json";

interface SearchFieldProps {
  initialQuery?: string;
  initialProduct?: string;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "default" | "large";
  className?: string;
}

export function SearchField({
  initialQuery = "",
  initialProduct = "all",
  placeholder = "Search articles, guides, topics...",
  autoFocus = false,
  size = "default",
  className = "",
}: SearchFieldProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search for suggestions (120ms debounce)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await defaultSearchProvider.search(query, {
          product: selectedProduct,
          limit: 5,
        });
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query, selectedProduct]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preload search index on input focus
  const handleFocus = () => {
    defaultSearchProvider.preload().catch(() => {});
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (selectedProduct && selectedProduct !== "all") {
      params.set("app", selectedProduct);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          const selected = suggestions[activeIndex];
          router.push(selected.url);
          setIsOpen(false);
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeOptionId =
    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-2 bg-surface rounded-r-lg border border-border focus-within:ring-2 focus-within:ring-focus focus-within:border-transparent shadow-xs transition-all"
        role="search"
      >
        {/* App selector dropdown inside search bar */}
        <div className="relative border-b sm:border-b-0 sm:border-r border-border shrink-0">
          <label htmlFor={`${listboxId}-app-select`} className="sr-only">
            Select Product Filter
          </label>
          <select
            id={`${listboxId}-app-select`}
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full sm:w-auto h-full min-h-[44px] py-2 pl-3.5 pr-8 bg-transparent text-xs font-semibold text-ink border-none focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-ink-muted text-xs">
            ▼
          </div>
        </div>

        {/* Input with Combobox Pattern */}
        <div className="relative flex-1 flex items-center">
          <label htmlFor={`${listboxId}-input`} className="sr-only">
            Search articles and guides
          </label>
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-ink-muted">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            id={`${listboxId}-input`}
            type="search"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
            className={`w-full bg-transparent pl-11 pr-10 text-ink placeholder:text-ink-muted/80 focus:outline-none ${
              size === "large" ? "min-h-[48px] text-base" : "min-h-[44px] text-sm"
            }`}
          />

          {isLoading ? (
            <div className="absolute right-3 flex items-center text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="touch-target absolute right-1 text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="touch-target px-5 rounded-r-md bg-accent text-ink font-bold text-sm hover:brightness-95 active:brightness-90 transition-all select-none shrink-0"
        >
          Search
        </button>
      </form>

      {/* Combobox Instant Suggestions Popover / Overlay */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-border rounded-r-lg shadow-overlay py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
          >
            {suggestions.map((item, index) => {
              const isSelected = index === activeIndex;
              return (
                <li
                  key={item.id}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onMouseEnter={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(item.url);
                      setIsOpen(false);
                    }
                  }}
                  onClick={() => {
                    router.push(item.url);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? "bg-surface-tint text-brand" : "text-ink hover:bg-surface-tint/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.productAccent }}
                    />
                    <div className="truncate">
                      <span className="font-medium text-sm block truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-ink-muted truncate block">
                        {item.productName} • {item.categoryTitle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-muted shrink-0 ml-2" />
                </li>
              );
            })}
          </ul>
          <div className="pt-2 mt-1 border-t border-border px-4">
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="text-xs font-semibold text-brand hover:underline w-full text-left py-1"
            >
              See all results for &quot;{query}&quot; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
