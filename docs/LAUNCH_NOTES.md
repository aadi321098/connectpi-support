# ConnectPi Support v1.0.0 Release Notes

**Release Date:** November 2026  
**Status:** Production-Ready Candidate  
**Target Domain:** `support.connectpi.in`

---

## 1. Release Highlights

### Multi-App Architecture from Day One
- Native support for multiple product verticals: **ConnectPi Web**, **ConnectPi Mobile App**, **Blade Rush**, and **Shared Policies**.
- Product switcher with dedicated landing hubs (`/[product]`), hierarchical categories (`/[product]/[category]`), and readable article slugs (`/[product]/[category]/[article]`).
- App source tracking (`?from=connectpi-web`, `?from=connectpi-app`) for direct contextual escalation.

### Search Engine
- Zero-external-dependency, privacy-first client-side fuzzy search powered by Fuse.js.
- Generates a lightweight static pre-indexed JSON (`search-index.en.json`) during build.
- Keyboard accessible combobox (WAI-ARIA 1.2) with arrow key navigation, debounce, and product filtering.

### Content System (MDX)
- Rich, type-validated content using `next-mdx-remote` and Zod.
- Custom interactive components: `<Callout>`, `<Steps>`, `<Screenshot>`, `<Kbd>`, `<Badge>`, and `<ContactCTA>`.
- Auto-generated Table of Contents with scroll-spy, reading time estimates, and copyable anchor links.
- Automated link integrity and placeholder audit scripts.

### Contact & Ticket Escalation
- Secure contact form with 4 structured inquiry types (Account Issue, Bug Report, Feature Request, Billing).
- Dynamic device & OS metadata capture for bug triage.
- Multi-layer defense: honeypot fields, 16KB payload cap, Cloudflare Turnstile token validation, and IP rate limiting (5 req/hr).
- Robust email delivery via Resend with graceful HTTP 502 fallback directly to support email mailto links.

### Accessibility (WCAG 2.1 AA & AAA)
- All design token color pairs achieve 100% WCAG 2.1 AA pass rate, with key typography achieving AAA (up to 17.5:1).
- Fluid typography using CSS `clamp()` and responsive spacing.
- Skip links, keyboard focus traps on mobile drawer, ARIA live announcements for form feedback.
- Print stylesheet for clean, ink-friendly hard copies or PDF exports.

---

## 2. Infrastructure & Operations
- **Hosting:** Next.js 15 App Router optimized for Vercel edge/serverless.
- **Cache & SEO:** Dynamic XML sitemap, `robots.ts`, dynamic SVG/PNG Open Graph banner generation (`next/og`), and Google SearchAction Schema.org JSON-LD.
- **Resilience:** Fallbacks for all third-party services in local dev (Upstash in-memory cache, Resend console logger, Turnstile bypass).

---

## 3. Future Enhancements & Scope
1. **Hindi Localization (`hi`):** Framework is wired with `next-intl`; full Devanagari translation catalog can be enabled by flipping `features.enableHindi: true`.
2. **Dark Mode:** Dark theme tokens are fully reserved in `styles/globals.css` and can be enabled via `features.enableDarkMode: true`.
3. **Real Knowledge Base Copy:** The user will progressively replace starter placeholder articles using `docs/PLACEHOLDER_AUDIT.md`.

