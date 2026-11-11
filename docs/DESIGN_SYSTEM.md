# Design System

Derived from the approved design canvas (Home, Category, Article). Implement as CSS variables + Tailwind theme so that dark mode and rebranding are token swaps.

## 1. Tokens

### Color (light)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8FF` | Page background |
| `--surface` | `#FFFFFF` | Cards, header, inputs |
| `--surface-tint` | `#EFE9FF` | Icon tiles, active sidebar item |
| `--ink` | `#1B1530` | Primary text, footer background |
| `--ink-body` | `#2F2848` | Article body text |
| `--ink-muted` | `#5E5878` | Secondary text (≥ 4.5:1 on `--bg`) |
| `--border` | `#E6E0F5` | Dividers, card borders |
| `--brand` | `#5B2FC9` | Primary buttons, links |
| `--brand-hover` | `#3F1D96` | Hover/active, link hover |
| `--brand-deep` | `#2A1668` | Hero background |
| `--accent` | `#F5B93A` | Hero search button (use dark text `--ink` on it) |
| `--footer-text` | `#C9C2E3` | Footer links on `--ink` |
| `--focus` | `#1B6EF3` | Focus ring (3:1 on all backgrounds used) |
| `--danger` | `#B42318` | Form errors |
| `--success` | `#067647` | Success states |

Rules: link text on white uses `--brand` (passes AA). Never put `--accent` text on light backgrounds. All status colors also carry an icon/text, not color alone.

### Dark (phase 2, reserve tokens now)
`--bg #120E24`, `--surface #1C1736`, `--surface-tint #2A2250`, `--ink #F4F1FF`, `--ink-body #D9D3F0`, `--ink-muted #A8A0C8`, `--border #342D58`, `--brand #A78BFA`, `--brand-hover #C4B5FD`. Re-verify contrast before shipping.

### Typography
- Headings: **Space Grotesk** 500/700. Body/UI: **Inter** 400/500/600. Load with `next/font` (self-hosted, subset latin, `display: swap`). Add a Devanagari-capable fallback (Noto Sans Devanagari) when Hindi is enabled.
- Scale (fluid): h1 `clamp(1.875rem, 1.2rem + 3vw, 3rem)`; h2 `clamp(1.375rem, 1rem + 1.5vw, 1.75rem)`; h3 `1.25rem`; body `1rem`→`1.0625rem` at lg; small `0.875rem`; eyebrow `0.8125rem` uppercase, letter-spacing `.06em`.
- Line height: headings 1.15; body 1.6; article prose 1.7.

### Space, radius, elevation, motion
- Space: 4/8/12/16/24/32/40/56/72/96.
- Radius: `--r-sm 8px` (inputs small), `--r-md 10px` (buttons), `--r-lg 12px` (images, icon tiles), `--r-xl 16px` (cards), `--r-pill 999px` (chips).
- Elevation: flat by default (borders, not shadows). One overlay shadow for drawer/popover: `0 12px 32px rgba(27,21,48,.18)`.
- Motion: 120–200 ms ease-out for hover/focus/drawer; disabled under reduced motion.

### Layout tokens
Container max `1120px`; sidebar `240–260px`; TOC rail `220px`; prose max `720px`; header height 56/64/72 (mobile/tablet/desktop).

## 2. Components

Each component: semantic HTML, keyboard support, all states (default, hover, focus-visible, active, disabled, loading, error where relevant), responsive behavior per `RESPONSIVE_SPEC.md`.

| Component | Key specs |
|---|---|
| **Button** | Variants `primary` (brand bg, white text), `secondary` (white bg, brand border and text), `accent` (accent bg, ink text). Min height 44 (48 for hero/CTA). Radius 10. Loading state with spinner and `aria-busy`. Render as `<a>` when navigating, `<button>` when acting. |
| **Link** | Brand color, underline on hover/focus; in prose always underlined. |
| **Header / Nav / Drawer** | See responsive spec §3.1. Drawer uses `<dialog>` or Radix Dialog for a11y. |
| **Search field** | Visible or visually-hidden label, `type="search"`, clear button, combobox pattern for suggestions. |
| **Chip** | Pill, 44 px min height, outlined (on dark hero) or tinted (on light). |
| **Category card** | Icon tile 44×44 (tint bg, brand icon), H3, one-line description, entire card is one `<a>`; hover: border becomes brand; focus ring visible. |
| **Article list item** | Title (H3 style) + summary; bottom border; whole row clickable. |
| **Sidebar nav** | List of links, 44 px rows, radius 10, active = tint bg + brand-hover text + `aria-current`. |
| **Breadcrumb** | `<nav aria-label="Breadcrumb"><ol>`; last item not a link. Mobile shows "← Parent". |
| **TOC** | `<nav aria-label="On this page">`; scroll-spy sets `aria-current="location"`; left border indicator. |
| **Prose (MDX)** | Styled h2/h3 with anchor links, ol/ul, blockquote, table (wrapper scroll), code (inline + block with copy button), image with caption, hr. Max 720 px. |
| **Callout** | Variants `note`, `tip`, `warning`; icon + title + text; never color-only. |
| **Steps** | Numbered ordered steps with optional screenshot per step. |
| **Feedback widget** | "Was this helpful?" Yes/No; success message in `aria-live="polite"`. |
| **Form controls** | Input, textarea (with counter), select, checkbox; 48 px height, 16 px text, visible label, inline error text with icon, `aria-invalid`, `aria-describedby`. |
| **Footer** | Dark (`--ink`), 4 columns → responsive per spec. |
| **Empty / Error / 404 states** | Friendly text, search, links. |

## 3. Iconography
Single stroke icon set (Lucide), 24 px, 2 px stroke, `currentColor`. Decorative icons `aria-hidden="true"`; icon-only buttons have `aria-label`. No emoji in UI.

## 4. Content tone (UI copy)
Plain, friendly, short sentences. Avoid jargon. Address the user as "you". Write error messages that say what happened and what to do next.

## 5. Source design reference
The approved canvas pages (Home, Category, Article) are the visual source of truth for spacing, hierarchy and structure. Where this document and the canvas disagree, this document wins for tokens and the canvas wins for layout intent.
