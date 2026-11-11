import React from "react";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content/schema";
import { ArrowRight } from "lucide-react";

interface RelatedArticlesProps {
  articles: ArticleMeta[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section aria-labelledby="related-articles-heading" className="mt-12 pt-8 border-t border-border">
      <h3
        id="related-articles-heading"
        className="font-heading font-bold text-xl text-ink mb-6"
      >
        Related articles
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => (
          <Link
            key={art.slug}
            href={`/${art.product}/${art.category}/${art.slug}`}
            className="p-4 rounded-r-lg border border-border bg-surface hover:border-brand transition-all flex flex-col justify-between group shadow-xs"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                {art.category}
              </span>
              <h4 className="font-heading font-bold text-base text-ink group-hover:text-brand transition-colors mt-1 mb-2">
                {art.title}
              </h4>
              <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                {art.summary}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-border/60 flex items-center text-xs font-semibold text-brand">
              <span>Read article</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
