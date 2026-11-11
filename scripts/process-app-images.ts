import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const outDir = path.join(process.cwd(), 'public/images/articles/app');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const img1Path = 'C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded/media_1794400280176_40c7feef.jpg';
  const img2Path = 'C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded/media_1794400652873_33221330.jpg';

  // --- Image 1: Google Play Store ---
  // Install button: x: 50..213, y: 310..345 (w=164, h=36)
  const svgOverlay1 = `
  <svg width="1024" height="756" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- Highlight Install button -->
    <rect x="47" y="307" width="170" height="42" rx="21"
          fill="none" stroke="#2563eb" stroke-width="4" filter="url(#shadow)"/>
    <g transform="translate(225, 313)">
      <rect x="0" y="0" width="220" height="30" rx="6" fill="#2563eb" filter="url(#shadow)"/>
      <text x="110" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">
        1. Tap to Install App
      </text>
    </g>
  </svg>
  `;

  await sharp(img1Path)
    .composite([
      { input: Buffer.from(svgOverlay1), top: 0, left: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(outDir, 'play-store-install.webp'));

  console.log('✓ Saved play-store-install.webp');

  // --- Image 2: Mobile Registration Screen ---
  // Image 2 is 635 x 1024
  // Username box: x: 42..593, y: 348..418
  // Create Account button: x: 43..592, y: 940..995
  const svgOverlay2 = `
  <svg width="635" height="1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <!-- Highlight Custom Username Box -->
    <rect x="36" y="342" width="564" height="82" rx="14"
          fill="rgba(59, 130, 246, 0.08)" stroke="#3b82f6" stroke-width="4" stroke-dasharray="6,4" filter="url(#shadow2)"/>
    <g transform="translate(380, 310)">
      <rect x="0" y="0" width="215" height="28" rx="6" fill="#3b82f6" filter="url(#shadow2)"/>
      <text x="107" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Custom Username Picker
      </text>
    </g>

    <!-- Highlight Create Account Button -->
    <rect x="36" y="934" width="564" height="66" rx="14"
          fill="none" stroke="#10b981" stroke-width="4" filter="url(#shadow2)"/>
    <g transform="translate(210, 896)">
      <rect x="0" y="0" width="215" height="30" rx="6" fill="#10b981" filter="url(#shadow2)"/>
      <text x="107" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Tap Create Account
      </text>
    </g>
  </svg>
  `;

  await sharp(img2Path)
    .composite([
      { input: Buffer.from(svgOverlay2), top: 0, left: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(outDir, 'mobile-signup-custom-username.webp'));

  console.log('✓ Saved mobile-signup-custom-username.webp');
}

main().catch(console.error);
