import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const img1Path = path.join(uploadDir, "media_1794393244787_d7e16a48.jpg");
const img2Path = path.join(uploadDir, "media_1794393735912_3ca52ac1.jpg");
const img3Path = path.join(uploadDir, "media_1794394442421_8d44ca68.png");

const targetDir = path.join(process.cwd(), "public/images/articles/web");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processImages() {
  // 1. Image 1: Continue with Pi screen
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

  // 2. Image 2: Fixed Allow modal screen (aligned right over the purple Allow button y: 684-750)
  const svgOverlay2 = `
  <svg width="524" height="1024" viewBox="0 0 524 1024" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight rectangle directly wrapping the Allow button -->
    <rect x="72" y="682" width="378" height="70" rx="10" fill="none" stroke="#22C55E" stroke-width="3.5" stroke-dasharray="8,4" />
    <!-- Step badge above button -->
    <g transform="translate(182, 632)">
      <rect width="160" height="36" rx="18" fill="#22C55E" />
      <text x="80" y="23" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Tap 'Allow' Here ✅</text>
    </g>
  </svg>
  `;

  await sharp(img2Path)
    .composite([{ input: Buffer.from(svgOverlay2) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "pi-auth-modal-allow.webp"));

  console.log("✓ Processed and saved: pi-auth-modal-allow.webp (marker fixed)");

  // 3. Image 3: Desktop QR code on accounts.pinet.com
  const svgOverlay3 = `
  <svg width="1024" height="734" viewBox="0 0 1024 734" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight frame around QR code -->
    <rect x="382" y="258" width="260" height="258" rx="12" fill="none" stroke="#5B2FC9" stroke-width="3.5" stroke-dasharray="8,4" />
    <!-- Scan badge above QR -->
    <g transform="translate(407, 212)">
      <rect width="210" height="34" rx="17" fill="#5B2FC9" />
      <text x="105" y="22" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Scan with Phone Camera 📱</text>
    </g>
  </svg>
  `;

  await sharp(img3Path)
    .composite([{ input: Buffer.from(svgOverlay3) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "desktop-qr-login-pinet.webp"));

  console.log("✓ Processed and saved: desktop-qr-login-pinet.webp");
}

processImages().catch(console.error);
