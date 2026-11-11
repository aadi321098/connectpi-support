import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

let errors = 0;

function checkLinks() {
  console.log("🔗 Checking internal links and media references...");

  // Scan all MDX files
  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith(".mdx")) {
        verifyFile(fullPath);
      }
    }
  }

  function verifyFile(filePath: string) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);

    // 1. Check markdown links: [text](/path)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2];
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("#") || url.startsWith("mailto:")) {
        continue;
      }

      // Internal link check
      if (url.startsWith("/")) {
        // Valid internal path pattern check
        const cleanPath = url.split("?")[0].split("#")[0];
        // Ensure not obviously malformed
        if (cleanPath.includes(" ")) {
          console.error(`❌ Broken link with space: '${url}' in ${filePath}`);
          errors++;
        }
      }
    }

    // 2. Check <Screenshot src="..." />
    const screenshotRegex = /<Screenshot[^>]+src=["']([^"']+)["']/g;
    let sMatch;
    while ((sMatch = screenshotRegex.exec(content)) !== null) {
      const src = sMatch[1];
      if (src.startsWith("/")) {
        const publicFile = path.join(PUBLIC_DIR, src);
        if (!fs.existsSync(publicFile)) {
          console.warn(`⚠️ Referenced image not yet in public folder: '${src}' in ${filePath}`);
        }
      }
    }
  }

  scan(CONTENT_DIR);
  console.log(`\nLink checking complete: ${errors} errors.`);
  if (errors > 0) {
    process.exit(1);
  }
}

checkLinks();

