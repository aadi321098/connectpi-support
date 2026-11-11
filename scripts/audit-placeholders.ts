/**
 * Scans all MDX content files for [PLACEHOLDER: ...] tags
 * Generates docs/PLACEHOLDER_AUDIT.md for launch review.
 */

import * as fs from "fs";
import * as path from "path";

interface PlaceholderItem {
  file: string;
  relativePath: string;
  line: number;
  text: string;
  product: string;
  category: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (entry.name.endsWith(".mdx")) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function runAudit(): void {
  console.log("🔍 Scanning content for [PLACEHOLDER] markers...");

  const mdxFiles = scanDirectory(CONTENT_DIR);
  const items: PlaceholderItem[] = [];

  for (const filePath of mdxFiles) {
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const parts = relPath.split("/");
    // parts: content/en/<product>/<category>/<file>.mdx
    const product = parts[2] || "unknown";
    const category = parts[3] || "unknown";

    lines.forEach((lineText, idx) => {
      const regex = /\[PLACEHOLDER:\s*([^\]]+)\]/g;
      let match;
      while ((match = regex.exec(lineText)) !== null) {
        items.push({
          file: path.basename(filePath),
          relativePath: relPath,
          line: idx + 1,
          text: match[1].trim(),
          product,
          category,
        });
      }
    });
  }

  const reportPath = path.join(process.cwd(), "docs/PLACEHOLDER_AUDIT.md");
  const reportLines: string[] = [
    "# ConnectPi Support — Content Placeholder Audit Report",
    "",
    `Generated on: ${new Date().toISOString()}`,
    `Total placeholders pending review: **${items.length}**`,
    "",
    "## 1. Overview by Product",
    "",
  ];

  const byProduct: Record<string, PlaceholderItem[]> = {};
  items.forEach((item) => {
    byProduct[item.product] = byProduct[item.product] || [];
    byProduct[item.product].push(item);
  });

  reportLines.push("| Product / Area | Pending Placeholders |");
  reportLines.push("|---|:---:|");
  Object.entries(byProduct).forEach(([prod, list]) => {
    reportLines.push(`| \`${prod}\` | ${list.length} |`);
  });
  reportLines.push("");

  reportLines.push("## 2. Granular Placeholder Listing");
  reportLines.push("");
  reportLines.push("| Location | Line | Placeholder Action Required |");
  reportLines.push("|---|:---:|---|");

  items.forEach((item) => {
    reportLines.push(
      `| \`${item.relativePath}\` | ${item.line} | ${item.text} |`
    );
  });

  reportLines.push("");
  reportLines.push("## 3. Production Readiness Instructions");
  reportLines.push(
    "> [!NOTE]\n" +
    "> In development, placeholders are allowed to permit progressive drafting and testing.\n" +
    "> Before production launch (`STRICT_CONTENT=true`), all placeholders must either be resolved with verified copy or removed."
  );
  reportLines.push("");

  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf-8");
  console.log(`✅ Audit complete: ${items.length} placeholders logged to ${reportPath}`);
}

runAudit();
