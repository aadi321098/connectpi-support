import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const img1Path = path.join(uploadDir, "media_1794393244787_d7e16a48.jpg");
const img2Path = path.join(uploadDir, "media_1794393735912_3ca52ac1.jpg");

const targetDir = path.join(process.cwd(), "public/images/articles/web");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processImages() {
  // 1. Process Image 1: Continue with Pi screen
  // Image 1 is 1024 x 733
  // Button "Continue with Pi" is around x=332, y=264, width=316, height=45
  const svgOverlay1 = `
  <svg width="1024" height="733" viewBox="0 0 1024 733" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight rectangle around Continue with Pi button -->
    <rect x="328" y="260" width="324" height="52" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <!-- Step badge -->
    <g transform="translate(662, 269)">
      <rect width="124" height="32" rx="16" fill="#5B2FC9" />
      <text x="62" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Click Here 👆</text>
    </g>
  </svg>
  `;

  await sharp(img1Path)
    .composite([{ input: Buffer.from(svgOverlay1) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "pi-browser-login-choice.webp"));

  console.log("✓ Processed and saved: pi-browser-login-choice.webp");

  // 2. Process Image 2: Allow modal screen
  // Image 2 is 524 x 1024
  // Purple "Allow" button is around x=75, y=665, width=374, height=68
  const svgOverlay2 = `
  <svg width="524" height="1024" viewBox="0 0 524 1024" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight rectangle around Allow button -->
    <rect x="70" y="660" width="384" height="76" rx="12" fill="none" stroke="#22C55E" stroke-width="4" stroke-dasharray="8,4" />
    <!-- Step badge -->
    <g transform="translate(192, 608)">
      <rect width="140" height="36" rx="18" fill="#22C55E" />
      <text x="70" y="23" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="middle">Tap 'Allow' ✅</text>
    </g>
  </svg>
  `;

  await sharp(img2Path)
    .composite([{ input: Buffer.from(svgOverlay2) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "pi-auth-modal-allow.webp"));

  console.log("✓ Processed and saved: pi-auth-modal-allow.webp");
}

processImages().catch(console.error);
