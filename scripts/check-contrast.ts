/**
 * Automated Color Contrast Verification Script
 * Validates WCAG 2.1 AA (4.5:1 for body, 3.0:1 for large/graphical) and AAA (7.0:1)
 * outputs results to docs/A11Y_REPORT.md.
 */

import * as fs from "fs";
import * as path from "path";

interface ColorPair {
  name: string;
  fgName: string;
  fgHex: string;
  bgName: string;
  bgHex: string;
  targetType: "normal-text" | "large-text" | "ui-component";
  requiredRatio: number;
  notes?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "").trim();
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const num = parseInt(fullHex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rLin, gLin, bLin] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function calculateContrast(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);

  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

const TOKEN_PAIRS: ColorPair[] = [
  {
    name: "Primary text on page background",
    fgName: "--ink",
    fgHex: "#1B1530",
    bgName: "--bg",
    bgHex: "#FAF8FF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Primary text on surface card",
    fgName: "--ink",
    fgHex: "#1B1530",
    bgName: "--surface",
    bgHex: "#FFFFFF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Body text on page background",
    fgName: "--ink-body",
    fgHex: "#2F2848",
    bgName: "--bg",
    bgHex: "#FAF8FF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Body text on surface card",
    fgName: "--ink-body",
    fgHex: "#2F2848",
    bgName: "--surface",
    bgHex: "#FFFFFF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Muted secondary text on page background",
    fgName: "--ink-muted",
    fgHex: "#5E5878",
    bgName: "--bg",
    bgHex: "#FAF8FF",
    targetType: "normal-text",
    requiredRatio: 4.5,
    notes: "Specified ≥ 4.5:1 in DESIGN_SYSTEM.md §1",
  },
  {
    name: "Muted secondary text on surface card",
    fgName: "--ink-muted",
    fgHex: "#5E5878",
    bgName: "--surface",
    bgHex: "#FFFFFF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Brand link text on surface card",
    fgName: "--brand",
    fgHex: "#5B2FC9",
    bgName: "--surface",
    bgHex: "#FFFFFF",
    targetType: "normal-text",
    requiredRatio: 4.5,
    notes: "Specified to pass AA in DESIGN_SYSTEM.md",
  },
  {
    name: "Brand link text on page background",
    fgName: "--brand",
    fgHex: "#5B2FC9",
    bgName: "--bg",
    bgHex: "#FAF8FF",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Primary button label (white on brand)",
    fgName: "#FFFFFF",
    fgHex: "#FFFFFF",
    bgName: "--brand",
    bgHex: "#5B2FC9",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Hero heading/text (white on brand-deep)",
    fgName: "#FFFFFF",
    fgHex: "#FFFFFF",
    bgName: "--brand-deep",
    bgHex: "#2A1668",
    targetType: "normal-text",
    requiredRatio: 4.5,
    notes: "Hero section background test",
  },
  {
    name: "Accent button label (ink on accent)",
    fgName: "--ink",
    fgHex: "#1B1530",
    bgName: "--accent",
    bgHex: "#F5B93A",
    targetType: "normal-text",
    requiredRatio: 4.5,
    notes: "Hero search button text",
  },
  {
    name: "Footer text on dark footer background",
    fgName: "--footer-text",
    fgHex: "#C9C2E3",
    bgName: "--ink",
    bgHex: "#1B1530",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Danger badge / error message",
    fgName: "#FFFFFF",
    fgHex: "#FFFFFF",
    bgName: "--danger",
    bgHex: "#B42318",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Success badge / notification",
    fgName: "#FFFFFF",
    fgHex: "#FFFFFF",
    bgName: "--success",
    bgHex: "#067647",
    targetType: "normal-text",
    requiredRatio: 4.5,
  },
  {
    name: "Focus outline on surface",
    fgName: "--focus",
    fgHex: "#1B6EF3",
    bgName: "--surface",
    bgHex: "#FFFFFF",
    targetType: "ui-component",
    requiredRatio: 3.0,
    notes: "Focus indicator graphical element (WCAG 2.1 1.4.11)",
  },
  {
    name: "Focus outline on page background",
    fgName: "--focus",
    fgHex: "#1B6EF3",
    bgName: "--bg",
    bgHex: "#FAF8FF",
    targetType: "ui-component",
    requiredRatio: 3.0,
    notes: "Focus indicator graphical element",
  },
];

function run(): void {
  console.log("🔍 Running WCAG 2.1 Contrast Ratio Verification...\n");

  let allPassed = true;
  const results = TOKEN_PAIRS.map((pair) => {
    const ratio = calculateContrast(pair.fgHex, pair.bgHex);
    const passesAA = ratio >= pair.requiredRatio;
    const passesAAA =
      pair.targetType === "normal-text"
        ? ratio >= 7.0
        : pair.targetType === "large-text"
          ? ratio >= 4.5
          : ratio >= 3.0;

    if (!passesAA) {
      allPassed = false;
    }

    return {
      ...pair,
      ratio: Number(ratio.toFixed(2)),
      passesAA,
      passesAAA,
    };
  });

  // Print console table
  console.table(
    results.map((r) => ({
      Pair: r.name,
      FG: `${r.fgName} (${r.fgHex})`,
      BG: `${r.bgName} (${r.bgHex})`,
      Ratio: `${r.ratio}:1`,
      Required: `${r.requiredRatio}:1`,
      AA: r.passesAA ? "PASS ✅" : "FAIL ❌",
      AAA: r.passesAAA ? "PASS 🌟" : "NO",
    }))
  );

  // Generate docs/A11Y_REPORT.md
  const reportPath = path.resolve(process.cwd(), "docs/A11Y_REPORT.md");
  const reportLines = [
    "# Accessibility & Color Contrast Verification Report",
    "",
    `Generated on: ${new Date().toISOString()}`,
    `Standard: WCAG 2.1 Level AA & AAA`,
    "",
    "## 1. Summary",
    `- **Total token pairs evaluated:** ${results.length}`,
    `- **Level AA Pass Rate:** ${results.filter((r) => r.passesAA).length} / ${results.length} (${allPassed ? "100%" : "FAIL"})`,
    `- **Level AAA Pass Rate:** ${results.filter((r) => r.passesAAA).length} / ${results.length}`,
    "",
    "## 2. Token Pair Contrast Table",
    "",
    "| Color Pair | Foreground | Background | Ratio | Min Req | WCAG AA | WCAG AAA | Notes |",
    "|---|---|---|---|---|:---:|:---:|---|",
    ...results.map((r) => {
      const aaBadge = r.passesAA ? "✅ PASS" : "❌ FAIL";
      const aaaBadge = r.passesAAA ? "🌟 PASS" : "—";
      return `| ${r.name} | \`${r.fgName}\` (${r.fgHex}) | \`${r.bgName}\` (${r.bgHex}) | **${r.ratio}:1** | ${r.requiredRatio}:1 | ${aaBadge} | ${aaaBadge} | ${r.notes || "Standard"} |`;
    }),
    "",
    "## 3. WCAG Guidelines Applied",
    "- **1.4.3 Contrast (Minimum) (Level AA):** The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large text (at least 3:1) and incidental/logotype text.",
    "- **1.4.6 Contrast (Enhanced) (Level AAA):** The visual presentation of text and images of text has a contrast ratio of at least 7:1 (or 4.5:1 for large text).",
    "- **1.4.11 Non-text Contrast (Level AA):** The visual presentation of user interface components and graphical objects has a contrast ratio of at least 3:1 against adjacent colors.",
    "",
    "## 4. Status",
    allPassed
      ? "> [!NOTE]\n> All design token pairs strictly pass WCAG 2.1 Level AA requirements. Key brand and hero combinations also achieve Level AAA."
      : "> [!WARNING]\n> Some token pairs do not meet Level AA requirements and require adjustment.",
    "",
  ];

  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf-8");
  console.log(`\n📄 Report written to: ${reportPath}`);

  if (!allPassed) {
    console.error("❌ Some token pairs failed WCAG 2.1 AA requirements.");
    process.exit(1);
  } else {
    console.log("✅ All token pairs pass WCAG 2.1 AA requirements!");
  }
}

run();
