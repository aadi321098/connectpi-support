# ConnectPi Support (`support.connectpi.in`)

Production-ready, accessible, multi-product help center for ConnectPi, ConnectPi Mobile App, and Blade Rush.

## Overview & Architecture
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling & Tokens:** Tailwind CSS with CSS-variable design tokens (WCAG 2.1 AA & AAA compliant)
- **Typography:** Self-hosted Next.js Google Fonts — Space Grotesk (Headings) & Inter (Body)
- **Content Engine:** MDX (via `next-mdx-remote`) with static type validation (Zod)
- **Search:** Typo-tolerant, zero-telemetry client-side search powered by Fuse.js and prebuilt static JSON index
- **Contact & Feedback:** Rate-limited (5/hr/IP) API with Cloudflare IP detection, Turnstile bot protection, and Resend email delivery
- **Internationalization:** `next-intl` (English default, architecture ready for Hindi)
- **Testing:** Playwright E2E across mobile (390px), tablet (768px), and desktop (1280px), plus automated Axe-core accessibility scans

---

## Getting Started

### 1. Requirements
- Node.js >= 20 (Tested with Node v22.23.4)
- npm >= 10

### 2. Installation & Setup
```bash
# Clone the repository
git clone <repo-url>
cd connectpi-support

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the help center.  
Visit [http://localhost:3000/dev/styleguide](http://localhost:3000/dev/styleguide) to inspect the design token styleguide.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js dev server with hot reload |
| `npm run build` | Builds static search index, validates routes, and compiles Next.js production build |
| `npm run build:search` | Generates `public/search-index.en.json` from MDX content |
| `npm run validate:content` | Validates all frontmatter schemas and warns about placeholders |
| `npm run check:links` | Verifies internal links, category references, and product paths |
| `npm run check:contrast` | Evaluates WCAG 2.1 AA/AAA contrast ratios and outputs `docs/A11Y_REPORT.md` |
| `npm run typecheck` | Strict TypeScript compilation check (`tsc --noEmit`) |
| `npm run lint` | ESLint check for Next.js and JSX A11y rules |
| `npm run test:e2e` | Runs comprehensive Playwright E2E and Axe-core test suites |

---

## Content Authoring

Articles and categories are organized per product under `content/{locale}/{product}/`:
- Products are declared in `content/products.json`.
- Categories are declared in `content/{locale}/{product}/_categories.json`.
- Articles are written as MDX files (`article-slug.mdx`) with YAML frontmatter.

For full details on MDX syntax, components, and authoring guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Security & Privacy Highlights
1. **No Third-Party Cookies:** Zero tracking cookies or invasive ad pixels.
2. **Real Client IP Rate Limiting:** Inspects `cf-connecting-ip` first (protecting against proxy lockouts) and masks subnets for GDPR/privacy compliance.
3. **Hardened Headers:** HSTS, strict CSP (`frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, and restricted permissions.
4. **Input Sanitization & Honeypots:** Contact form enforces 16KB max payload, honeypot traps, and strict Zod validation.

---

## Documentation
- [PRD & Specifications](./docs/PRD.md)
- [Multi-App Routing Addendum](./docs/MULTI_APP_ADDENDUM.md)
- [Design System & Tokens](./docs/DESIGN_SYSTEM.md)
- [Responsive Layouts Specification](./docs/RESPONSIVE_SPEC.md)
- [Accessibility Audit & Contrast Report](./docs/A11Y_REPORT.md)
- [Architecture Decisions Log](./docs/DECISIONS.md)
- [Incident & Operations Runbook](./docs/RUNBOOK.md)
- [Production Launch Checklist](./docs/LAUNCH_CHECKLIST.md)
- [Changelog](./docs/CHANGELOG.md)
