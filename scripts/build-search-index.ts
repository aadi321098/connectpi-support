import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSearchRecords } from "../lib/content/search-records";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function buildIndex() {
  console.log("⚡ Building search index...");

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const locales = ["en"];

  for (const locale of locales) {
    const records = getSearchRecords(locale);
    const jsonStr = JSON.stringify(records, null, 2);
    const hash = crypto.createHash("md5").update(jsonStr).digest("hex").slice(0, 8);

    // Save both standard and hashed index
    const standardPath = path.join(PUBLIC_DIR, `search-index.${locale}.json`);
    const hashedPath = path.join(PUBLIC_DIR, `search-index.${locale}.${hash}.json`);

    fs.writeFileSync(standardPath, jsonStr, "utf-8");
    fs.writeFileSync(hashedPath, jsonStr, "utf-8");

    // Write index manifest
    const manifestPath = path.join(PUBLIC_DIR, "search-manifest.json");
    const manifest = {
      [locale]: {
        hash,
        file: `search-index.${locale}.${hash}.json`,
        count: records.length,
        updatedAt: new Date().toISOString(),
      },
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

    console.log(
      `✓ Search index for '${locale}' built: ${records.length} records (${(jsonStr.length / 1024).toFixed(1)} KB)`
    );
  }
}

buildIndex();
