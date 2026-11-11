import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const targetDir = path.join(process.cwd(), "public/images/articles/web");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function reprocessAll() {
  console.log("⚡ Reprocessing all article images with pixel-perfect coordinates...");

  // 1. media_1794393244787_d7e16a48.jpg -> pi-browser-login-choice.webp
  // "Continue with Pi" button: x: 334 to 647, y: 264 to 308
  const img1 = path.join(uploadDir, "media_1794393244787_d7e16a48.jpg");
  const svg1 = `
  <svg width="1024" height="733" viewBox="0 0 1024 733" xmlns="http://www.w3.org/2000/svg">
    <rect x="330" y="261" width="322" height="50" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3.5" stroke-dasharray="6,4" />
    <g transform="translate(662, 270)">
      <rect width="112" height="32" rx="16" fill="#5B2FC9" />
      <text x="56" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Step 1: Click 👆</text>
    </g>
  </svg>
  `;
  await sharp(img1)
    .composite([{ input: Buffer.from(svg1) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "pi-browser-login-choice.webp"));
  console.log("✓ Image 1 (Continue with Pi) updated");

  // 2. media_1794393735912_3ca52ac1.jpg -> pi-auth-modal-allow.webp
  // Allow button: x: 76 to 447, y: 682 to 748
  // Gap above button: y: 620 to 680 (clean white space, badge fits perfectly at y: 640)
  const img2 = path.join(uploadDir, "media_1794393735912_3ca52ac1.jpg");
  const svg2 = `
  <svg width="524" height="1024" viewBox="0 0 524 1024" xmlns="http://www.w3.org/2000/svg">
    <rect x="73" y="679" width="377" height="72" rx="10" fill="none" stroke="#22C55E" stroke-width="4" stroke-dasharray="8,4" />
    <g transform="translate(182, 638)">
      <rect width="160" height="32" rx="16" fill="#22C55E" />
      <text x="80" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="middle">Tap 'Allow' Here ✅</text>
    </g>
  </svg>
  `;
  await sharp(img2)
    .composite([{ input: Buffer.from(svg2) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "pi-auth-modal-allow.webp"));
  console.log("✓ Image 2 (Allow button) updated");

  // 3. media_1794394442421_8d44ca68.png -> desktop-qr-login-pinet.webp
  // QR code: x: 392 to 630, y: 268 to 505
  // Blank space above QR: y: 232 to 266
  const img3 = path.join(uploadDir, "media_1794394442421_8d44ca68.png");
  const svg3 = `
  <svg width="1024" height="734" viewBox="0 0 1024 734" xmlns="http://www.w3.org/2000/svg">
    <rect x="388" y="264" width="246" height="245" rx="10" fill="none" stroke="#5B2FC9" stroke-width="3.5" stroke-dasharray="6,4" />
    <g transform="translate(422, 230)">
      <rect width="178" height="28" rx="14" fill="#5B2FC9" />
      <text x="89" y="18" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Scan with Phone Camera 📱</text>
    </g>
  </svg>
  `;
  await sharp(img3)
    .composite([{ input: Buffer.from(svg3) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "desktop-qr-login-pinet.webp"));
  console.log("✓ Image 3 (Desktop QR code) updated");

  // 4. media_1794395214219_4be578c2.jpg -> google-signup-consent.webp
  // Checkboxes: y: 278 to 442, x: 290 to 680
  // "Authenticate with Google" button: y: 463 to 506, x: 291 to 679
  const img4 = path.join(uploadDir, "media_1794395214219_4be578c2.jpg");
  const svg4 = `
  <svg width="1024" height="729" viewBox="0 0 1024 729" xmlns="http://www.w3.org/2000/svg">
    <!-- Checkboxes outline -->
    <rect x="288" y="276" width="394" height="166" rx="8" fill="none" stroke="#5B2FC9" stroke-width="2.5" stroke-dasharray="6,4" />
    <g transform="translate(692, 344)">
      <rect width="134" height="30" rx="15" fill="#5B2FC9" />
      <text x="67" y="19" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Step 1: Accept Both</text>
    </g>

    <!-- Authenticate button outline (y: 463 to 506) -->
    <rect x="288" y="460" width="394" height="49" rx="8" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(692, 470)">
      <rect width="134" height="30" rx="15" fill="#22C55E" />
      <text x="67" y="19" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Step 2: Authenticate</text>
    </g>
  </svg>
  `;
  await sharp(img4)
    .composite([{ input: Buffer.from(svg4) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "google-signup-consent.webp"));
  console.log("✓ Image 4 (Google Signup consent & Authenticate) updated");

  // 5. media_1794395412000_85411641.jpg -> google-signup-details-redacted.webp
  // Email field: y: 340 to 385, x: 290 to 680
  // Username field: y: 425 to 470, x: 290 to 680
  // Continue button: y: 485 to 523, x: 293 to 679
  const img5 = path.join(uploadDir, "media_1794395412000_85411641.jpg");
  const svg5 = `
  <svg width="1024" height="730" viewBox="0 0 1024 730" xmlns="http://www.w3.org/2000/svg">
    <!-- Clean redaction inside Email field -->
    <rect x="294" y="342" width="384" height="42" rx="6" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
    <text x="310" y="368" fill="#475569" font-family="monospace" font-size="13" font-weight="700">user****@gmail.com (Protected)</text>

    <!-- Clean redaction inside Generated Username field -->
    <rect x="294" y="426" width="384" height="42" rx="6" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
    <text x="310" y="452" fill="#475569" font-family="monospace" font-size="13" font-weight="700">pioneer_user_789 (Auto-Generated)</text>

    <!-- Continue button outline (y: 485 to 523) -->
    <rect x="289" y="482" width="393" height="44" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(692, 489)">
      <rect width="130" height="30" rx="15" fill="#5B2FC9" />
      <text x="65" y="19" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Step 3: Continue 👆</text>
    </g>
  </svg>
  `;
  await sharp(img5)
    .composite([{ input: Buffer.from(svg5) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "google-signup-details-redacted.webp"));
  console.log("✓ Image 5 (Details Redacted & Continue button) updated");

  // 6. media_1794395686302_9619b2b5.jpg -> connectpi-login-credentials.webp
  // Login button: y: 414 to 452, x: 318 to 663
  const img6 = path.join(uploadDir, "media_1794395686302_9619b2b5.jpg");
  const svg6 = `
  <svg width="1024" height="730" viewBox="0 0 1024 730" xmlns="http://www.w3.org/2000/svg">
    <rect x="314" y="411" width="352" height="44" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(676, 418)">
      <rect width="118" height="30" rx="15" fill="#5B2FC9" />
      <text x="59" y="19" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Click Login 🔐</text>
    </g>
  </svg>
  `;
  await sharp(img6)
    .composite([{ input: Buffer.from(svg6) }])
    .webp({ quality: 88 })
    .toFile(path.join(targetDir, "connectpi-login-credentials.webp"));
  console.log("✓ Image 6 (Login credentials button) updated");

  console.log("🎉 All 6 images reprocessed with pixel-perfect accuracy!");
}

reprocessAll().catch(console.error);

