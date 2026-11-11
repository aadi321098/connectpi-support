# Responsive Specification

Mobile-first. Write base styles for mobile, then add `min-width` media queries (Tailwind: unprefixed = mobile, `md:` tablet, `lg:` desktop, `xl:` wide).

## 1. Breakpoints

| Token | Min width | Device class | Notes |
|---|---|---|---|
| (base) | 0 | Mobile (320–639) | Design for 360 px as the typical case; must work at 320 |
| `sm` | 640 px | Large phone / phone landscape | Minor tweaks only |
| `md` | 768 px | Tablet portrait | 2-column grids |
| `lg` | 1024 px | Tablet landscape / small laptop | Sidebar appears |
| `xl` | 1280 px | Desktop | TOC rail appears on article |
| `2xl` | 1536 px | Large desktop | Container stays at max width; extra space is margin |

Test widths: 320, 360, 390, 414, 600, 768, 820, 1024, 1180, 1280, 1440, 1920, 2560. Also landscape phones (e.g. 844×390) and foldables (~280 px folded, ~717 px unfolded).

Container: `max-width: 1120px; margin-inline: auto; padding-inline: 16px (base) / 24px (md) / 32px (xl)`.

## 2. Global rules

- Use `rem`, `%`, `fr`, `clamp()`. No fixed-width layout elements. No `100vh` for full-height elements; use `100dvh` (with `min-height` fallback).
- Fluid type: `h1: clamp(1.875rem, 1.2rem + 3vw, 3rem)`, `h2: clamp(1.375rem, 1rem + 1.5vw, 1.75rem)`, body `1rem` (mobile) / `1.0625rem` (lg) with `line-height: 1.6–1.7`. Never below 16 px for body text and inputs (prevents iOS zoom on focus).
- Touch targets: min 44×44 px (links in lists have 44 px min height). Spacing between adjacent targets ≥ 8 px.
- Long words/URLs: `overflow-wrap: anywhere` in prose; tables and code blocks scroll inside `overflow-x: auto` wrappers with visible focus.
- Images: `max-width: 100%; height: auto`; set `sizes` appropriately for `next/image`.
- Respect safe areas: header and footer use `padding-inline: max(16px, env(safe-area-inset-left/right))`; footer bottom padding includes `env(safe-area-inset-bottom)`.
- Hover-only behaviors are forbidden. Use `@media (hover: hover)` for hover styles, and provide tap/keyboard equivalents.
- `prefers-reduced-motion: reduce` disables transitions >150 ms, smooth scroll and scroll-spy animation.
- Sticky elements must not cover content when anchor-linking: `scroll-margin-top` on headings equals header height + 16 px.

## 3. Component behavior by breakpoint

### 3.1 Header
| | Mobile (<768) | Tablet (768–1023) | Desktop (≥1024) |
|---|---|---|---|
| Content | Logo, search icon button, menu button | Logo, nav links (condensed), search icon, "Open ConnectPi" button | Logo, full nav, "Open ConnectPi" button; search lives on pages (Home hero, and header search field on inner pages) |
| Nav | Drawer from right, `100dvh`, width `min(86vw, 360px)`, focus trap, Esc/overlay closes, body scroll locked | Inline | Inline |
| Search | Search icon opens a full-width search overlay (input autofocus) | Same as mobile | Inline input on inner pages (max 320 px) |
| Height | 56 px | 64 px | 72 px |
| Sticky | Not sticky on Home; sticky (non-obscuring, 56 px) on article pages for quick access to menu | Same | Not sticky (content has TOC sticky instead) |

### 3.2 Footer
- Mobile: single column; link groups collapse into 2-column grid (Help | Legal), Contact full width.
- Tablet: 2×2 grid.
- Desktop: 4 columns (brand 2fr, others 1fr).

### 3.3 Home
| Section | Mobile | Tablet | Desktop |
|---|---|---|---|
| Hero | Padding 40/16; H1 ~30 px; search input stacked above button (full width); chips wrap, horizontally scroll if >2 lines is NOT used (wrap instead) | Padding 56/24; input + button inline | Padding 72/24; input + button inline, max 640 px |
| Topic cards | 1 column | 2 columns | 3 columns |
| Popular + Help card | Stacked: list first, help card below | Stacked | Side by side (list 2/3, card 1/3) |

### 3.4 Category page
| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Topics navigation | Collapsed `<details>`-style disclosure "Topics: {current}" at top, expands to list | Horizontal chip row (wrap, no horizontal scroll) | Left sidebar 260 px, sticky `top: header + 24px`, own scroll if taller than viewport |
| Article list | Full width, 20 px vertical padding per item | Same | Max reading width 760 px |
| Contact CTA | Stacked, full-width button | Inline | Inline |

### 3.5 Article page
| | Mobile | Tablet | Desktop ≥1024 | Wide ≥1280 |
|---|---|---|---|---|
| Layout | 1 column | 1 column, reading width ≤ 720 px centered | 2 columns: sidebar 240 px + content (≤ 720 px) | 3 columns: sidebar 240 + content 720 + TOC rail 220 |
| Left sidebar | Hidden; replaced by "More in {category}" list at bottom | Same as mobile | Visible, sticky | Visible, sticky |
| TOC | "On this page" disclosure at top of article (collapsed by default) | Same | Same (inline disclosure) | Right rail, sticky, scroll-spy |
| Breadcrumb | Shows only parent link: "← {Category}" to avoid wrapping | Full | Full | Full |
| Feedback block | Buttons full width, stacked | Inline | Inline | Inline |
| Tables | Scroll in box with shadow hint | Same | Same | Same |
| Images | Full width, rounded 12 px | Same | Same | Same |

### 3.6 Search results
- Mobile: single column result cards; filters (category) as a horizontally wrapping chip row.
- Tablet/Desktop: result list max 760 px; category filter in left column at ≥ 1024 px.
- Suggestions dropdown: on mobile it is an overlay list under the full-width input; on desktop a popover (max 560 px) anchored to input. Both keyboard and touch operable.

### 3.7 Contact page
- Mobile: single column form; fields full width; submit button full width, sticky-bottom NOT used (avoids keyboard overlap bugs); use correct `inputmode`, `autocomplete`, `type` attributes (email, name, `enterkeyhint`).
- Tablet/Desktop: form max 640 px on left; on ≥ 1024 px a right column with "Before you write" tips (links to top articles) and support hours.
- Turnstile widget uses `size: flexible`, never overflows at 320 px.

### 3.8 Legal pages
Single reading column ≤ 720 px; at ≥1280 optional TOC rail identical to Article.

### 3.9 404 / Error
Centered single column at all sizes; search + 3 popular links.

## 4. Spacing scale

4 / 8 / 12 / 16 / 24 / 32 / 40 / 56 / 72 / 96 px (tokens `space-1…space-10`). Section vertical rhythm: mobile 40–48, tablet 56, desktop 64–80.

## 5. Orientation, zoom, and input modes

- Landscape phone: header must not exceed 56 px; drawer scrolls if content taller than viewport.
- 200% zoom at 1280 px behaves like 640 px layout (no clipped content). 400% zoom (reflow) at 320 px CSS width must work.
- Support keyboard, mouse, touch and screen-reader navigation at all breakpoints.
- `@media (pointer: coarse)` enlarges small controls; `@media (hover: none)` removes hover-dependent UI.

## 6. Responsive acceptance criteria (must all pass)

1. At every test width: no horizontal page scroll (`document.documentElement.scrollWidth <= innerWidth`).
2. All interactive targets ≥ 44 px on touch widths (<1024) verified by automated check.
3. Header drawer: focus trap works, Esc closes, focus returns to the menu button, background not scrollable.
4. Topic navigation and TOC change form exactly at the breakpoints above.
5. Reading width on article never exceeds ~75 characters per line.
6. Layout is not broken in iOS Safari (with dynamic toolbar), Android Chrome, Samsung Internet and Pi Browser.
7. Visual regression snapshots (Playwright) exist for Home, Category, Article, Search, Contact at 390, 768, 1024, 1440 px.
