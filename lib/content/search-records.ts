import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getProducts, getCategories, getSharedCategories } from "./index";
import { ArticleFrontmatterSchema } from "./schema";
import { extractHeadings } from "./toc";

export interface SearchRecord {
  id: string;
  url: string;
  title: string;
  summary: string;
  category: string;
  categoryTitle: string;
  product: string;
  productName: string;
  productAccent: string;
  tags: string[];
  headings: string[];
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Strips MDX/Markdown formatting into searchable plain text
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ") // remove HTML/JSX tags like <Steps>, <Callout>
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links [text](url) -> text
    .replace(/[#*`_~>-]/g, " ") // formatting markers
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim()
    .slice(0, 5000);
}

/**
 * Generates search records for all articles across products and shared categories
 */
export function getSearchRecords(locale: string = "en"): SearchRecord[] {
  const records: SearchRecord[] = [];
  const products = getProducts();

  const allTargets = [
    ...products.map((p) => ({
      slug: p.slug,
      name: p.name,
      accent: p.accent,
      isShared: false,
    })),
    {
      slug: "shared",
      name: "All Apps",
      accent: "#5B2FC9",
      isShared: true,
    },
  ];

  for (const target of allTargets) {
    const categories = target.isShared
      ? getSharedCategories(locale)
      : getCategories(locale, target.slug);

    for (const cat of categories) {
      const catDir = path.join(CONTENT_DIR, locale, target.slug, cat.slug);
      if (!fs.existsSync(catDir)) continue;

      const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".mdx"));

      for (const file of files) {
        const filePath = path.join(catDir, file);
        const articleSlug = file.replace(/\.mdx$/, "");
        const raw = fs.readFileSync(filePath, "utf-8");

        const { data: frontmatter, content } = matter(raw);
        const parsed = ArticleFrontmatterSchema.safeParse(frontmatter);
        if (!parsed.success || parsed.data.published === false) continue;

        const headings = extractHeadings(content).map((h) => h.text);
        const body = cleanMarkdown(content);

        const url = `/${target.slug}/${cat.slug}/${articleSlug}`;
        const id = `${target.slug}/${cat.slug}/${articleSlug}`;

        records.push({
          id,
          url,
          title: parsed.data.title,
          summary: parsed.data.summary,
          category: cat.slug,
          categoryTitle: cat.title,
          product: target.slug,
          productName: target.name,
          productAccent: target.accent,
          tags: parsed.data.tags || [],
          headings,
          body,
        });
      }
    }
  }

  return records;
}
