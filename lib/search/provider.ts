export interface SearchOptions {
  product?: string;
  category?: string;
  limit?: number;
}

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  summary: string;
  category: string;
  categoryTitle: string;
  product: string;
  productName: string;
  productAccent: string;
  score?: number;
}

export interface SearchProvider {
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
