import Fuse, { IFuseOptions } from "fuse.js";
import { SearchProvider, SearchOptions, SearchResult } from "./provider";
import { SearchRecord } from "../content/search-records";

const FUSE_OPTIONS: IFuseOptions<SearchRecord> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.2 },
    { name: "headings", weight: 0.2 },
    { name: "summary", weight: 0.15 },
    { name: "body", weight: 0.05 },
  ],
  threshold: 0.35, // Typo-tolerant threshold (~0.35)
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

let cachedIndex: SearchRecord[] | null = null;
let fuseInstance: Fuse<SearchRecord> | null = null;
let loadPromise: Promise<Fuse<SearchRecord>> | null = null;

export class FuseProvider implements SearchProvider {
  private locale: string;

  constructor(locale: string = "en") {
    this.locale = locale;
  }

  /**
   * Preloads the search index on input focus
   */
  async preload(): Promise<void> {
    await this.getFuse();
  }

  private async getFuse(): Promise<Fuse<SearchRecord>> {
    if (fuseInstance) return fuseInstance;

    if (!loadPromise) {
      loadPromise = (async () => {
        try {
          // In browser environment: fetch from static public route
          if (typeof window !== "undefined") {
            const res = await fetch(`/search-index.${this.locale}.json`, {
              cache: "force-cache",
            });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            cachedIndex = await res.json();
          } else {
            // Node / Server environment: dynamic import or fs
            const fs = await import("fs");
            const path = await import("path");
            const filePath = path.join(process.cwd(), "public", `search-index.${this.locale}.json`);
            if (fs.existsSync(filePath)) {
              cachedIndex = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            } else {
              cachedIndex = [];
            }
          }
        } catch (err) {
          console.error("Failed to load search index:", err);
          cachedIndex = [];
        }

        fuseInstance = new Fuse(cachedIndex || [], FUSE_OPTIONS);
        return fuseInstance;
      })();
    }

    return loadPromise;
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const fuse = await this.getFuse();
    const results = fuse.search(trimmed);

    let filtered = results;

    // Filter by product if specified (and not 'all')
    if (options.product && options.product !== "all") {
      filtered = filtered.filter(
        (r) => r.item.product === options.product || r.item.product === "shared"
      );
    }

    // Filter by category if specified
    if (options.category && options.category !== "all") {
      filtered = filtered.filter((r) => r.item.category === options.category);
    }

    // Apply limit (e.g. top 5 for dropdown, or limit from options)
    const limit = options.limit || 20;

    return filtered.slice(0, limit).map((r) => ({
      id: r.item.id,
      url: r.item.url,
      title: r.item.title,
      summary: r.item.summary,
      category: r.item.category,
      categoryTitle: r.item.categoryTitle,
      product: r.item.product,
      productName: r.item.productName,
      productAccent: r.item.productAccent,
      score: r.score,
    }));
  }
}

// Export singleton instance for client use
export const defaultSearchProvider = new FuseProvider("en");
