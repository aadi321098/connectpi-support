import { z } from "zod";

export const ProductSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["web", "android", "ios", "game", "shared"]),
  description: z.string().min(1),
  initial: z.string().min(1).max(2),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  tint: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  order: z.number().int().default(100),
  url: z.string().optional(),
  status: z.enum(["active", "hidden", "archived"]).default("active"),
});

export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("help-circle"),
  order: z.number().int().default(100),
});

export type Category = z.infer<typeof CategorySchema>;

export const FaqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(5).max(100),
  summary: z.string().min(10).max(200),
  category: z.string().min(1),
  product: z.string().optional(),
  order: z.number().int().default(100),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  related: z.array(z.string()).max(3).default([]),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO format YYYY-MM-DD"),
  published: z.boolean().default(true),
  platform: z.array(z.enum(["web", "android", "ios"])).optional(),
  appliesTo: z.array(z.string()).optional(),
  faq: z.array(FaqItemSchema).optional(),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  product: string;
  readingTime: string;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface Article extends ArticleMeta {
  content: string;
  headings: TocHeading[];
}
