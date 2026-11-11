import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const targetDir = path.join(process.cwd(), "public/images/articles/web");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processProfileImages() {
  console.log("⚡ Processing profile editing screenshots...");

  // 1. media_1794397440252_ffd09555.jpg (1024 x 730)
  // Edit Profile button: x: 434 to 532, y: 272 to 308
  const img1 = path.join(uploadDir, "media_1794397440252_ffd09555.jpg");
  const svg1 = `
  <svg width="1024" height="730" viewBox="0 0 1024 730" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight Edit Profile button -->
    <rect x="431" y="270" width="104" height="40" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="5,3" />
    <g transform="translate(426, 234)">
      <rect width="114" height="28" rx="14" fill="#5B2FC9" />
      <text x="57" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Click Here 👆</text>
    </g>
  </svg>
  `;

  await sharp(img1)
    .composite([{ input: Buffer.from(svg1) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "profile-overview-edit-btn.webp"));
  console.log("✓ Saved: profile-overview-edit-btn.webp");

  // 2. media_1794397544182_c064bd0a.jpg (1024 x 724)
  // Save Changes button: x: 595 to 707, y: 593 to 633
  const img2 = path.join(uploadDir, "media_1794397544182_c064bd0a.jpg");
  const svg2 = `
  <svg width="1024" height="724" viewBox="0 0 1024 724" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight Save Changes button -->
    <rect x="592" y="591" width="118" height="44" rx="8" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="5,3" />
    <g transform="translate(584, 642)">
      <rect width="134" height="28" rx="14" fill="#22C55E" />
      <text x="67" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Save Changes ✅</text>
    </g>
  </svg>
  `;

  await sharp(img2)
    .composite([{ input: Buffer.from(svg2) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "edit-profile-modal-fields.webp"));
  console.log("✓ Saved: edit-profile-modal-fields.webp");
}

processProfileImages().catch(console.error);
