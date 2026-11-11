# Accessibility & Color Contrast Verification Report

Generated on: 2026-11-11T09:58:18.959Z
Standard: WCAG 2.1 Level AA & AAA

## 1. Summary
- **Total token pairs evaluated:** 16
- **Level AA Pass Rate:** 16 / 16 (100%)
- **Level AAA Pass Rate:** 12 / 16

## 2. Token Pair Contrast Table

| Color Pair | Foreground | Background | Ratio | Min Req | WCAG AA | WCAG AAA | Notes |
|---|---|---|---|---|:---:|:---:|---|
| Primary text on page background | `--ink` (#1B1530) | `--bg` (#FAF8FF) | **16.66:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Primary text on surface card | `--ink` (#1B1530) | `--surface` (#FFFFFF) | **17.55:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Body text on page background | `--ink-body` (#2F2848) | `--bg` (#FAF8FF) | **13.13:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Body text on surface card | `--ink-body` (#2F2848) | `--surface` (#FFFFFF) | **13.83:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Muted secondary text on page background | `--ink-muted` (#5E5878) | `--bg` (#FAF8FF) | **6.34:1** | 4.5:1 | ✅ PASS | — | Specified ≥ 4.5:1 in DESIGN_SYSTEM.md §1 |
| Muted secondary text on surface card | `--ink-muted` (#5E5878) | `--surface` (#FFFFFF) | **6.68:1** | 4.5:1 | ✅ PASS | — | Standard |
| Brand link text on surface card | `--brand` (#5B2FC9) | `--surface` (#FFFFFF) | **7.79:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Specified to pass AA in DESIGN_SYSTEM.md |
| Brand link text on page background | `--brand` (#5B2FC9) | `--bg` (#FAF8FF) | **7.4:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Primary button label (white on brand) | `#FFFFFF` (#FFFFFF) | `--brand` (#5B2FC9) | **7.79:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Hero heading/text (white on brand-deep) | `#FFFFFF` (#FFFFFF) | `--brand-deep` (#2A1668) | **14.86:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Hero section background test |
| Accent button label (ink on accent) | `--ink` (#1B1530) | `--accent` (#F5B93A) | **9.93:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Hero search button text |
| Footer text on dark footer background | `--footer-text` (#C9C2E3) | `--ink` (#1B1530) | **10.29:1** | 4.5:1 | ✅ PASS | 🌟 PASS | Standard |
| Danger badge / error message | `#FFFFFF` (#FFFFFF) | `--danger` (#B42318) | **6.57:1** | 4.5:1 | ✅ PASS | — | Standard |
| Success badge / notification | `#FFFFFF` (#FFFFFF) | `--success` (#067647) | **5.69:1** | 4.5:1 | ✅ PASS | — | Standard |
| Focus outline on surface | `--focus` (#1B6EF3) | `--surface` (#FFFFFF) | **4.59:1** | 3:1 | ✅ PASS | 🌟 PASS | Focus indicator graphical element (WCAG 2.1 1.4.11) |
| Focus outline on page background | `--focus` (#1B6EF3) | `--bg` (#FAF8FF) | **4.36:1** | 3:1 | ✅ PASS | 🌟 PASS | Focus indicator graphical element |

## 3. WCAG Guidelines Applied
- **1.4.3 Contrast (Minimum) (Level AA):** The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large text (at least 3:1) and incidental/logotype text.
- **1.4.6 Contrast (Enhanced) (Level AAA):** The visual presentation of text and images of text has a contrast ratio of at least 7:1 (or 4.5:1 for large text).
- **1.4.11 Non-text Contrast (Level AA):** The visual presentation of user interface components and graphical objects has a contrast ratio of at least 3:1 against adjacent colors.

## 4. Status
> [!NOTE]
> All design token pairs strictly pass WCAG 2.1 Level AA requirements. Key brand and hero combinations also achieve Level AAA.
