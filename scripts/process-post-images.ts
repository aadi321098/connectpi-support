import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const targetDir = path.join(process.cwd(), "public/images/articles/web");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processPostImages() {
  console.log("⚡ Processing create post screenshots with pixel accuracy...");

  // 1. media_1794398261955_63fde054.jpg (1024 x 736) - Desktop Home
  const img1 = path.join(uploadDir, "media_1794398261955_63fde054.jpg");
  const svg1 = `
  <svg width="1024" height="736" viewBox="0 0 1024 736" xmlns="http://www.w3.org/2000/svg">
    <!-- Sidebar + New Post button: x: 11 to 239, y: 310 to 352 -->
    <rect x="9" y="308" width="232" height="46" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(18, 274)">
      <rect width="136" height="28" rx="14" fill="#5B2FC9" />
      <text x="68" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Option A: Sidebar</text>
    </g>

    <!-- Banner Create Post button: x: 855 to 960, y: 174 to 202 -->
    <rect x="852" y="171" width="112" height="34" rx="6" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(846, 134)">
      <rect width="124" height="28" rx="14" fill="#22C55E" />
      <text x="62" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Option B: Banner</text>
    </g>
  </svg>
  `;

  await sharp(img1)
    .composite([{ input: Buffer.from(svg1) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "desktop-create-post-entry.webp"));
  console.log("✓ Saved: desktop-create-post-entry.webp");

  // 2. media_1794398335895_1bbd0041.jpg (763 x 927) - Mobile Home
  const img2 = path.join(uploadDir, "media_1794398335895_1bbd0041.jpg");
  const svg2 = `
  <svg width="763" height="927" viewBox="0 0 763 927" xmlns="http://www.w3.org/2000/svg">
    <!-- Banner Create Post button: x: 575 to 700, y: 358 to 394 -->
    <rect x="572" y="356" width="132" height="40" rx="6" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(578, 320)">
      <rect width="120" height="28" rx="14" fill="#5B2FC9" />
      <text x="60" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Home Banner</text>
    </g>

    <!-- Floating Action Button (+): center (702, 786), radius 38 -->
    <circle cx="702" cy="786" r="38" fill="none" stroke="#22C55E" stroke-width="3.5" stroke-dasharray="6,4" />
    <g transform="translate(636, 706)">
      <rect width="118" height="28" rx="14" fill="#22C55E" />
      <text x="59" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Floating (+) FAB</text>
    </g>
  </svg>
  `;

  await sharp(img2)
    .composite([{ input: Buffer.from(svg2) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "mobile-create-post-entry.webp"));
  console.log("✓ Saved: mobile-create-post-entry.webp");

  // 3. media_1794398431208_3b97207e.jpg (1024 x 719) - Modal Dialog
  const img3 = path.join(uploadDir, "media_1794398431208_3b97207e.jpg");
  const svg3 = `
  <svg width="1024" height="719" viewBox="0 0 1024 719" xmlns="http://www.w3.org/2000/svg">
    <!-- Media Tools (Image, Video, Mention) x: 196 to 340, y: 598 to 650 -->
    <rect x="194" y="596" width="146" height="54" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(195, 560)">
      <rect width="144" height="28" rx="14" fill="#5B2FC9" />
      <text x="72" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Attach Media &amp; @</text>
    </g>

    <!-- Post Button x: 727 to 823, y: 604 to 646 -->
    <rect x="724" y="602" width="102" height="46" rx="8" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(714, 560)">
      <rect width="122" height="28" rx="14" fill="#22C55E" />
      <text x="61" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Publish Post 🚀</text>
    </g>
  </svg>
  `;

  await sharp(img3)
    .composite([{ input: Buffer.from(svg3) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "create-post-modal-tools.webp"));
  console.log("✓ Saved: create-post-modal-tools.webp");
}

processPostImages().catch(console.error);
