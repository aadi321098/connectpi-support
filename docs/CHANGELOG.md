# Changelog

All notable changes to the ConnectPi Support project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added - Phase 2
- Fuzzy client-side search engine (`lib/search/`):
  - `SearchProvider` interface for swappable search backends.
  - `FuseProvider` implementation with weighted field scoring (title 0.4, tags 0.2, headings 0.2, summary 0.15, body 0.05) and typo tolerance (threshold 0.35).
  - Search index lazy-loading on first input focus (`public/search-index.en.json`).
  - Search index generator script `scripts/build-search-index.ts` hooked into `npm run build`.
- WAI-ARIA 1.2 accessible `SearchField` component (`components/search/SearchField.tsx`):
  - Combobox pattern with `role="combobox"`, `aria-expanded`, and `aria-activedescendant`.
  - Top 5 instant suggestions dropdown with keyboard navigation (Arrow keys, Enter, Escape).
  - Product filter selector embedded inside the search field.
  - 120ms input debounce.
- Dedicated `/search` results page (`app/[locale]/search/page.tsx`):
  - Filter chips by product (`app=`) and query (`q=`).
  - Result cards with product badges and category labels.
  - Zero-results empty state with search tips and Contact CTA.
  - Configured with `robots: { index: false }` (`noindex`) for search hygiene.
- Full Home Page implementation (`app/[locale]/page.tsx`):
  - Hero with Space Grotesk H1, `SearchField`, and popular query chips.
  - "Choose your app" cards grid (responsive: 1/2/3 columns).
  - "Popular articles" list with app accent badges (from `featured: true` frontmatter).
  - "Still need help?" card with Contact Support and Report Bug actions.
  - "Help for every app" shared topics section.
  - Schema.org `WebSite` JSON-LD with `SearchAction`.
- Playwright E2E test suite in `tests/search.spec.ts` (all 28 tests passing across 390px, 768px, and 1280px).

### Added - Phase 1
- MDX content engine in `lib/content`:
  - Zod schemas for products, categories, and articles (`lib/content/schema.ts`).
  - Heading extractor and reading time calculator (`lib/content/toc.ts`).
  - Product-aware content queries (`lib/content/index.ts`).
- Allow-listed MDX components:
  - `<Callout>` (note, tip, warning variants)
  - `<Steps>` and `<Step>` with custom numbered counter
  - `<Screenshot>` with accessible caption and `next/image`
  - `<Badge>`, `<Kbd>`, and `<ContactCTA>`
  - Custom styled prose elements (headings with anchor links, scrollable tables, syntax-highlighted code blocks)
- Dynamic routes:
  - Category page (`app/[locale]/[product]/[category]/page.tsx`) with SSG and breadcrumbs
  - Article page (`app/[locale]/[product]/[category]/[article]/page.tsx`) with SSG, TOC, and JSON-LD schemas
  - Product Hub overview (`app/[locale]/[product]/page.tsx`)
- Navigation components:
  - `Breadcrumb` (mobile "← Parent", tablet/desktop full trail)
  - `Sidebar` (sticky, product topics + shared topics)
  - `TopicSwitcher` (mobile disclosure, tablet chips)
  - `Toc` (mobile top disclosure, desktop sticky right rail)
  - `RelatedArticles` cards
  - `FeedbackWidget` ("Was this article helpful?" with polite screen-reader announcements)
- Seed starter content:
  - 1-2 categories and placeholder articles across ConnectPi Web, ConnectPi App, Blade Rush, and Shared umbrella.
- Validation scripts:
  - `scripts/validate-content.ts` (supports `[PLACEHOLDER: ...]` in development mode)
  - `scripts/check-links.ts`
- Playwright E2E test suite in `tests/content.spec.ts` (16 passed across mobile 390, tablet 768, and desktop 1280).

### Added - Phase 0
- Project initialization with Next.js App Router, TypeScript strict, and Tailwind CSS.
- Design tokens defined as CSS variables for light mode and dark mode placeholders (`styles/globals.css`).
- Next.js font configuration for `Space Grotesk` and `Inter` via `next/font/google`.
- `next-intl` configuration with English (`en`) messages catalog.
- Layout shell components: `SkipLink`, `Container`, `Header`, `MobileDrawer`, `Footer`.
- Core UI components: `Button`, `Chip`, `Card`, `Icon`.
- Product configuration in `content/products.json` and site configuration in `content/site.json`.
- Dev styleguide route `/dev/styleguide` demonstrating components across all breakpoints.
- Environment validation (`lib/env.ts`) and feature flags (`lib/features.ts`).
