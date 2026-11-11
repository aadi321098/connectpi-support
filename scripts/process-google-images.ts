import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = "C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded";
const img1Path = path.join(uploadDir, "media_1794395214219_4be578c2.jpg");
const img2Path = path.join(uploadDir, "media_1794395412000_85411641.jpg");
const img3Path = path.join(uploadDir, "media_1794395686302_9619b2b5.jpg");

const targetDir = path.join(process.cwd(), "public/images/articles/web");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function processGoogleSignupImages() {
  // 1. Image 1: Google Signup Consent & Authenticate
  // Image is 1024 x 729
  // Checkboxes are at x: 295 to 650, y: 390 to 590
  // "Authenticate with Google" button is at x: 285 to 668, y: 636 to 695
  const svgOverlay1 = `
  <svg width="1024" height="729" viewBox="0 0 1024 729" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight checkboxes area -->
    <rect x="286" y="386" width="382" height="216" rx="8" fill="none" stroke="#5B2FC9" stroke-width="2.5" stroke-dasharray="6,4" />
    <g transform="translate(674, 460)">
      <rect width="144" height="32" rx="16" fill="#5B2FC9" />
      <text x="72" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Step 1: Accept Both</text>
    </g>

    <!-- Highlight Authenticate with Google button -->
    <rect x="284" y="635" width="385" height="60" rx="8" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(674, 649)">
      <rect width="138" height="32" rx="16" fill="#22C55E" />
      <text x="69" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Step 2: Authenticate</text>
    </g>
  </svg>
  `;

  await sharp(img1Path)
    .composite([{ input: Buffer.from(svgOverlay1) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "google-signup-consent.webp"));
  console.log("✓ Saved: google-signup-consent.webp");

  // 2. Image 2: Privacy Redaction of user email & generated username + Highlight Continue
  // Image is 1024 x 730
  // Email text is at x: 295 to 455, y: 480 to 515
  // Generated username text is at x: 295 to 430, y: 590 to 625
  // Continue button is at x: 286 to 668, y: 662 to 715
  const svgOverlay2 = `
  <svg width="1024" height="730" viewBox="0 0 1024 730" xmlns="http://www.w3.org/2000/svg">
    <!-- Privacy redaction box for Email -->
    <rect x="290" y="478" width="370" height="42" rx="6" fill="#EDF2F7" />
    <text x="306" y="505" fill="#475569" font-family="monospace" font-size="14" font-weight="700">user****@gmail.com (Protected)</text>

    <!-- Privacy redaction box for Generated Username -->
    <rect x="290" y="588" width="370" height="42" rx="6" fill="#EDF2F7" />
    <text x="306" y="615" fill="#475569" font-family="monospace" font-size="14" font-weight="700">pioneer_user_789 (Auto-Generated)</text>

    <!-- Highlight Continue button -->
    <rect x="286" y="660" width="384" height="56" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(676, 672)">
      <rect width="130" height="32" rx="16" fill="#5B2FC9" />
      <text x="65" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Step 3: Continue 👆</text>
    </g>
  </svg>
  `;

  await sharp(img2Path)
    .composite([{ input: Buffer.from(svgOverlay2) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "google-signup-details-redacted.webp"));
  console.log("✓ Saved: google-signup-details-redacted.webp (email & username blurred/redacted)");

  // 3. Image 3: Login with Username/Email & Password
  // Image is 1024 x 730
  // Login form card
  // Login button is at x: 310 to 650, y: 566 to 622
  const svgOverlay3 = `
  <svg width="1024" height="730" viewBox="0 0 1024 730" xmlns="http://www.w3.org/2000/svg">
    <!-- Highlight Login button -->
    <rect x="308" y="565" width="344" height="58" rx="8" fill="none" stroke="#5B2FC9" stroke-width="3" stroke-dasharray="6,4" />
    <g transform="translate(658, 578)">
      <rect width="118" height="32" rx="16" fill="#5B2FC9" />
      <text x="59" y="20" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" text-anchor="middle">Click Login 🔐</text>
    </g>
  </svg>
  `;

  await sharp(img3Path)
    .composite([{ input: Buffer.from(svgOverlay3) }])
    .webp({ quality: 85 })
    .toFile(path.join(targetDir, "connectpi-login-credentials.webp"));
  console.log("✓ Saved: connectpi-login-credentials.webp");
}

processGoogleSignupImages().catch(console.error);
