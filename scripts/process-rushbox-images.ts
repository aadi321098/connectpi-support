import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const outDir = path.join(process.cwd(), 'public/images/articles/games');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const img1Path = 'C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded/media_1794401425924_76ba1f7c.jpg';
  const img2Path = 'C:/Users/RDP/.gemini/antigravity/brain/710eadef-40cb-4dc4-9132-462f910b6ea8/.user_uploaded/media_1794401470045_c88a4edb.jpg';

  // --- Image 1: Google Play Store ---
  // Install button: x: 53..250, y: 313..348
  const svgOverlay1 = `
  <svg width="1024" height="753" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- Highlight Install button -->
    <rect x="49" y="309" width="205" height="43" rx="21"
          fill="none" stroke="#2563eb" stroke-width="4" filter="url(#shadow1)"/>
    <g transform="translate(265, 315)">
      <rect x="0" y="0" width="260" height="30" rx="6" fill="#2563eb" filter="url(#shadow1)"/>
      <text x="130" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Install Rush Box (com.connectpi.bladerush)
      </text>
    </g>
  </svg>
  `;

  await sharp(img1Path)
    .composite([
      { input: Buffer.from(svgOverlay1), top: 0, left: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(outDir, 'rushbox-playstore-listing.webp'));

  console.log('✓ Saved rushbox-playstore-listing.webp');

  // --- Image 2: Rush Box Web Library (1024 x 921) ---
  // Fruit Slice: x: 20..246, y: 528..866
  // RB Balance: x: 790..905, y: 32..80
  const svgOverlay2 = `
  <svg width="1024" height="921" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow2" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- Highlight Fruit Slice card -->
    <rect x="18" y="525" width="232" height="345" rx="18"
          fill="rgba(245, 158, 11, 0.06)" stroke="#f59e0b" stroke-width="4" filter="url(#shadow2)"/>
    <g transform="translate(260, 680)">
      <rect x="0" y="0" width="240" height="32" rx="6" fill="#f59e0b" filter="url(#shadow2)"/>
      <text x="120" y="21" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">
        Fruit Slice (Blade Rush)
      </text>
    </g>

    <!-- Highlight RB Coins Balance -->
    <rect x="788" y="30" width="120" height="52" rx="26"
          fill="none" stroke="#2563eb" stroke-width="3" filter="url(#shadow2)"/>
    <g transform="translate(630, 42)">
      <rect x="0" y="0" width="145" height="28" rx="6" fill="#2563eb" filter="url(#shadow2)"/>
      <text x="72" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">
        RB Coins Balance
      </text>
    </g>
  </svg>
  `;

  await sharp(img2Path)
    .composite([
      { input: Buffer.from(svgOverlay2), top: 0, left: 0 }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(outDir, 'rushbox-web-library.webp'));

  console.log('✓ Saved rushbox-web-library.webp');
}

main().catch(console.error);
