import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  Product,
  ProductSchema,
  Category,
  CategorySchema,
  Article,
  ArticleMeta,
  ArticleFrontmatterSchema,
} from "./schema";
import { extractHeadings, calculateReadingTime } from "./toc";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Shared dummy product representation for common / shared articles
const SHARED_PRODUCT: Product = {
  slug: "shared",
  name: "All Apps",
  type: "shared",
  description: "Guides and answers that apply across all ConnectPi products.",
  initial: "π",
  accent: "#5B2FC9",
  tint: "#EFE9FF",
  order: 99,
  status: "active",
};

/**
 * Read and validate all products from content/products.json
 */
export function getProducts(): Product[] {
  const filePath = path.join(CONTENT_DIR, "products.json");
  if (!fs.existsSync(filePath)) return [];

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  return zParseArray(ProductSchema, data);
}

/**
 * Get product by slug (supports 'shared' as well)
 */
export function getProduct(slug: string): Product | null {
  if (slug === "shared") return SHARED_PRODUCT;
  const products = getProducts();
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Get categories for a specific product (or shared)
 */
export function getCategories(locale: string = "en", productSlug: string): Category[] {
  const filePath = path.join(CONTENT_DIR, locale, productSlug, "categories.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const categories = zParseArray(CategorySchema, data);
    return categories.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  } catch (err) {
    console.error(`Error loading categories for ${productSlug}:`, err);
    return [];
  }
}

/**
 * Get category by slug for a product
 */
export function getCategory(
  locale: string = "en",
  productSlug: string,
  categorySlug: string
): Category | null {
  const categories = getCategories(locale, productSlug);
  return categories.find((c) => c.slug === categorySlug) || null;
}

/**
 * Get shared categories
 */
export function getSharedCategories(locale: string = "en"): Category[] {
  return getCategories(locale, "shared");
}

/**
 * Get all articles under a category for a product
 */
export function getArticlesByCategory(
  locale: string = "en",
  productSlug: string,
  categorySlug: string
): ArticleMeta[] {
  const categoryDir = path.join(CONTENT_DIR, locale, productSlug, categorySlug);
  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter((file) => file.endsWith(".mdx"));
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    const filePath = path.join(categoryDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    const parsed = ArticleFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      console.warn(`Invalid frontmatter in ${filePath}:`, parsed.error.format());
      continue;
    }

    if (parsed.data.published === false) continue;

    const slug = file.replace(/\.mdx$/, "");
    articles.push({
      ...parsed.data,
      slug,
      product: productSlug,
      readingTime: calculateReadingTime(content),
    });
  }

  return articles.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

/**
 * Get full article details including raw markdown content and TOC headings
 */
export function getArticle(
  locale: string = "en",
  productSlug: string,
  categorySlug: string,
  articleSlug: string
): Article | null {
  const filePath = path.join(
    CONTENT_DIR,
    locale,
    productSlug,
    categorySlug,
    `${articleSlug}.mdx`
  );

  if (!fs.existsSync(filePath)) return null;

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    const parsed = ArticleFrontmatterSchema.safeParse(frontmatter);
    if (!parsed.success) {
      console.error(`Invalid frontmatter in ${filePath}:`, parsed.error.format());
      return null;
    }

    if (parsed.data.published === false) return null;

    const headings = extractHeadings(content);
    const readingTime = calculateReadingTime(content);

    return {
      ...parsed.data,
      slug: articleSlug,
      product: productSlug,
      content,
      headings,
      readingTime,
    };
  } catch (err) {
    console.error(`Error reading article at ${filePath}:`, err);
    return null;
  }
}

/**
 * Get featured articles across products or for a specific product
 */
export function getFeaturedArticles(
  locale: string = "en",
  productSlug?: string
): ArticleMeta[] {
  const productsToSearch = productSlug ? [productSlug] : [...getProducts().map((p) => p.slug), "shared"];
  const featured: ArticleMeta[] = [];

  for (const pSlug of productsToSearch) {
    const categories = getCategories(locale, pSlug);
    for (const cat of categories) {
      const articles = getArticlesByCategory(locale, pSlug, cat.slug);
      for (const art of articles) {
        if (art.featured) {
          featured.push(art);
        }
      }
    }
  }

  return featured.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

/**
 * Get related articles for an article
 */
export function getRelatedArticles(
  locale: string = "en",
  article: ArticleMeta
): ArticleMeta[] {
  const relatedList: ArticleMeta[] = [];

  // Check explicit 'related' frontmatter: array of "category/slug" or "product/category/slug"
  if (article.related && article.related.length > 0) {
    for (const target of article.related) {
      const parts = target.split("/");
      if (parts.length === 2) {
        // Same product
        const [cat, slug] = parts;
        const art = getArticle(locale, article.product, cat, slug);
        if (art) relatedList.push(art);
      } else if (parts.length === 3) {
        // Cross product
        const [prod, cat, slug] = parts;
        const art = getArticle(locale, prod, cat, slug);
        if (art) relatedList.push(art);
      }
    }
  }

  // Fallback to same category articles if less than 3
  if (relatedList.length < 3) {
    const sameCatArticles = getArticlesByCategory(locale, article.product, article.category)
      .filter((a) => a.slug !== article.slug && !relatedList.some((r) => r.slug === a.slug));

    for (const fallback of sameCatArticles) {
      if (relatedList.length >= 3) break;
      relatedList.push(fallback);
    }
  }

  return relatedList.slice(0, 3);
}

/**
 * Helper to get all static category paths
 */
export function getAllCategoryPaths(locale: string = "en") {
  const products = [...getProducts().map((p) => p.slug), "shared"];
  const paths: { locale: string; product: string; category: string }[] = [];

  for (const product of products) {
    const categories = getCategories(locale, product);
    for (const category of categories) {
      paths.push({
        locale,
        product,
        category: category.slug,
      });
    }
  }

  return paths;
}

/**
 * Helper to get all static article paths
 */
export function getAllArticlePaths(locale: string = "en") {
  const products = [...getProducts().map((p) => p.slug), "shared"];
  const paths: { locale: string; product: string; category: string; article: string }[] = [];

  for (const product of products) {
    const categories = getCategories(locale, product);
    for (const category of categories) {
      const articles = getArticlesByCategory(locale, product, category.slug);
      for (const article of articles) {
        paths.push({
          locale,
          product,
          category: category.slug,
          article: article.slug,
        });
      }
    }
  }

  return paths;
}

function zParseArray<TSchema extends import("zod").ZodTypeAny>(
  schema: TSchema,
  arr: unknown
): import("zod").output<TSchema>[] {
  if (!Array.isArray(arr)) return [];
  const results: import("zod").output<TSchema>[] = [];
  for (const item of arr) {
    const parsed = schema.safeParse(item);
    if (parsed.success) {
      results.push(parsed.data);
    }
  }
  return results;
}
