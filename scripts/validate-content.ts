import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ProductSchema, CategorySchema, ArticleFrontmatterSchema } from "../lib/content/schema";

const CONTENT_DIR = path.join(process.cwd(), "content");
const IS_PROD = process.env.NODE_ENV === "production" && process.env.STRICT_CONTENT === "true";

let errorsFound = 0;
let warningsFound = 0;

function logError(msg: string) {
  console.error(`❌ ERROR: ${msg}`);
  errorsFound++;
}

function logWarning(msg: string) {
  console.warn(`⚠️ WARNING: ${msg}`);
  warningsFound++;
}

function validate() {
  console.log("🔍 Validating content files...");

  // 1. Validate products.json
  const productsPath = path.join(CONTENT_DIR, "products.json");
  if (!fs.existsSync(productsPath)) {
    logError("Missing content/products.json");
    process.exit(1);
  }

  const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const products = [];

  for (const prod of productsData) {
    const res = ProductSchema.safeParse(prod);
    if (!res.success) {
      logError(`Invalid product entry in products.json: ${JSON.stringify(res.error.format())}`);
    } else {
      products.push(res.data);
    }
  }

  const locales = ["en"];
  const allArticleKeys = new Set<string>();

  // 2. Validate categories and articles for each product + shared
  const targets = [...products.map((p) => p.slug), "shared"];

  for (const locale of locales) {
    for (const target of targets) {
      const targetDir = path.join(CONTENT_DIR, locale, target);
      if (!fs.existsSync(targetDir)) {
        logError(`Missing directory for product/target: ${targetDir}`);
        continue;
      }

      // Check categories.json
      const catFile = path.join(targetDir, "categories.json");
      if (!fs.existsSync(catFile)) {
        logError(`Missing categories.json in ${targetDir}`);
        continue;
      }

      const catsData = JSON.parse(fs.readFileSync(catFile, "utf-8"));
      const categorySlugs = new Set<string>();

      for (const cat of catsData) {
        const catRes = CategorySchema.safeParse(cat);
        if (!catRes.success) {
          logError(`Invalid category in ${catFile}: ${JSON.stringify(catRes.error.format())}`);
        } else {
          categorySlugs.add(catRes.data.slug);
        }
      }

      // Scan subdirectories for articles
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const catSlug = entry.name;

        if (!categorySlugs.has(catSlug)) {
          logWarning(`Folder '${catSlug}' in ${targetDir} is not listed in categories.json`);
        }

        const catDir = path.join(targetDir, catSlug);
        const mdxFiles = fs.readdirSync(catDir).filter((f) => f.endsWith(".mdx"));

        for (const file of mdxFiles) {
          const filePath = path.join(catDir, file);
          const articleSlug = file.replace(/\.mdx$/, "");
          const fileContent = fs.readFileSync(filePath, "utf-8");

          const { data: frontmatter, content } = matter(fileContent);
          const fmRes = ArticleFrontmatterSchema.safeParse(frontmatter);

          if (!fmRes.success) {
            logError(`Invalid frontmatter in ${filePath}: ${JSON.stringify(fmRes.error.format())}`);
            continue;
          }

          if (fmRes.data.category !== catSlug) {
            logError(`Category mismatch in ${filePath}: frontmatter says '${fmRes.data.category}' but folder is '${catSlug}'`);
          }

          const uniqueKey = `${target}/${catSlug}/${articleSlug}`;
          if (allArticleKeys.has(uniqueKey)) {
            logError(`Duplicate article slug: ${uniqueKey}`);
          }
          allArticleKeys.add(uniqueKey);

          // Check for [PLACEHOLDER: ...]
          if (content.includes("[PLACEHOLDER")) {
            if (IS_PROD) {
              logError(`Unresolved [PLACEHOLDER] in published article: ${filePath}`);
            } else {
              logWarning(`Placeholder present in dev: ${filePath}`);
            }
          }
        }
      }
    }
  }

  console.log(`\nValidation complete: ${errorsFound} errors, ${warningsFound} warnings.`);
  if (errorsFound > 0) {
    process.exit(1);
  }
}

validate();

