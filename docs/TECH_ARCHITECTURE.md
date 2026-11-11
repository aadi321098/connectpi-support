# Technical Architecture

## 1. Stack decisions

| Concern | Choice | Why / alternative |
|---|---|---|
| Framework | **Next.js (latest stable), App Router, TypeScript strict** | Matches the owner's existing stack; SSG + route handlers |
| Styling | **Tailwind CSS** with CSS-variable tokens | Fast responsive work, token swaps for dark mode |
| Content | **MDX via `gray-matter` + `next-mdx-remote/rsc`** (or `@next/mdx`) | No DB; do NOT use Contentlayer (unmaintained). Velite is an acceptable alternative |
| Validation | **Zod** | Frontmatter, env vars, API payloads |
| Search | **Fuse.js** over a build-time JSON index, behind `SearchProvider` interface | Upgrade path: Pagefind, Typesense, Algolia |
| UI primitives | **Radix UI** (Dialog, Disclosure) or native `<dialog>` | Accessibility done right |
| Icons | **lucide-react** (tree-shaken) | |
| Forms | **react-hook-form + zod resolver** (or plain controlled form) | Keep JS small |
| Email | **Resend** (SMTP fallback) | Simple, cheap |
| Anti-spam | **Cloudflare Turnstile** + honeypot + rate limit (Upstash Redis / Vercel KV) | |
| i18n | **next-intl** (en now, hi later) | |
| Analytics | **Vercel Analytics or Plausible** (cookieless) | |
| Monitoring | **Sentry** (PII scrubbed), UptimeRobot/Better Stack | |
| Testing | **Vitest** (unit), **Playwright** (e2e + visual), **axe-core** (a11y), **Lighthouse CI** | |
| Lint/format | ESLint (next, jsx-a11y), Prettier, TypeScript `strict` | |
| Package manager | pnpm (or npm) with lockfile | |
| Hosting | **Vercel** (alt: Cloudflare Pages) | Preview per PR |
| CI | GitHub Actions | |

Pin exact versions in `package.json` when scaffolding; do not guess versions from memory, install latest stable and commit the lockfile.

## 2. Repository structure

```
connectpi-support/
├─ app/
│  ├─ [locale]/                    # locale segment (en only at launch; middleware redirects / → /en hidden via localePrefix 'as-needed')
│  │  ├─ layout.tsx                # html lang, fonts, header, footer, skip link
│  │  ├─ page.tsx                  # Home
│  │  ├─ [category]/page.tsx       # Category (generateStaticParams)
│  │  ├─ [category]/[article]/page.tsx
│  │  ├─ search/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ legal/[doc]/page.tsx
│  │  ├─ not-found.tsx
│  │  └─ error.tsx
│  ├─ api/
│  │  ├─ contact/route.ts          # POST
│  │  ├─ feedback/route.ts         # POST
│  │  └─ health/route.ts           # GET
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx
├─ components/
│  ├─ layout/ (Header, MobileDrawer, Footer, SkipLink, Container)
│  ├─ nav/ (Sidebar, TopicSwitcher, Breadcrumb, Toc)
│  ├─ search/ (SearchField, SearchSuggestions, SearchResults)
│  ├─ content/ (Prose, Callout, Steps, Screenshot, FeedbackWidget, RelatedArticles)
│  ├─ forms/ (ContactForm, Field, TurnstileWidget)
│  └─ ui/ (Button, Chip, Card, Icon)
├─ lib/
│  ├─ content/ (index.ts, schema.ts, mdx.ts, toc.ts, search-records.ts)
│  ├─ search/ (provider.ts, fuse-provider.ts)
│  ├─ support/ (deliver.ts, email-resend.ts, ratelimit.ts, turnstile.ts)
│  ├─ seo/ (metadata.ts, jsonld.ts)
│  ├─ analytics.ts   env.ts   features.ts   utils.ts
├─ content/ …                      # see CONTENT_MODEL.md
├─ messages/en.json                # all UI strings
├─ public/ (images, fonts if any, favicon, og defaults)
├─ scripts/ (build-search-index.ts, validate-content.ts, check-links.ts)
├─ tests/ (unit/, e2e/, visual/)
├─ styles/globals.css              # tokens + base
├─ middleware.ts                   # locale + security headers (or next.config headers)
├─ next.config.ts   tailwind.config.ts   tsconfig.json   .env.example
├─ .github/workflows/ci.yml
└─ docs/ (these spec files)
```

## 3. Rendering strategy
- All content routes: `generateStaticParams` + static generation (`dynamic = 'error'` to prevent accidental dynamic rendering). Revalidate not needed; content changes deploy.
- `/search` page shell is static; results computed client-side.
- API routes run on Node runtime (Edge only if all deps support it).
- `export const dynamicParams = false` on content routes so unknown slugs 404 quickly.

## 4. Key implementation details

**MDX pipeline:** rehype-slug + rehype-autolink-headings (accessible link with sr-only text), remark-gfm, syntax highlighting with `rehype-pretty-code`/Shiki at build time (zero client JS). Extract headings (h2/h3) to build the TOC server-side. Compute reading time.

**TOC scroll-spy:** small client component using `IntersectionObserver`; falls back to static list without JS.

**Mobile drawer:** client component; focus trap, Esc, overlay click, `aria-expanded` on trigger, body scroll lock, restores focus.

**Search:** `scripts/build-search-index.ts` runs in `prebuild`. Client loads `/search-index.<locale>.<hash>.json` on first focus (`fetch` with `cache: 'force-cache'`), builds Fuse instance once, memoizes. Debounce input 120 ms. Results page reads `q` from URL and updates history with `replaceState`.

**Contact API (`POST /api/contact`):**
1. Parse JSON with size limit (≤ 16 KB). Validate with shared Zod schema.
2. Reject if honeypot filled (return 200 to confuse bots, send nothing).
3. Verify Turnstile token server-side.
4. Rate limit per IP (+ per email): 5 / hour. Return 429 with `Retry-After`.
5. Deliver via `deliver()` (Resend). Set `reply-to` to the user's email; subject prefix `[ConnectPi Support][type]`.
6. Return `{ ok: true }`. On provider failure return 502 and a message showing the fallback support email.
7. Never log body/email; log only request id and outcome.

**Feedback API:** accepts `{ path, helpful: boolean }`, rate-limited, forwards to analytics/log store; no PII.

**SEO:** `generateMetadata` per route from frontmatter, canonical URL from `NEXT_PUBLIC_SITE_URL`, OG images via `next/og`, JSON-LD helpers in `lib/seo/jsonld.ts`, `sitemap.ts` from content, `robots.ts`.

**Security headers (next.config):** CSP with nonces or strict hashes (allow `challenges.cloudflare.com` for Turnstile, analytics host), HSTS (`max-age=63072000; includeSubDomains; preload` after DNS verified), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `frame-ancestors 'none'`.

**Environment variables** (`lib/env.ts` validates with Zod and fails fast):
```
NEXT_PUBLIC_SITE_URL=https://support.connectpi.in
NEXT_PUBLIC_APP_URL=https://connectpi.in
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
SUPPORT_TO_EMAIL=
SUPPORT_FROM_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SENTRY_DSN=
NEXT_PUBLIC_ANALYTICS_ID=
```
`.env.example` is committed with empty values. No secrets in client bundles (only `NEXT_PUBLIC_*`).

## 5. CI/CD

GitHub Actions on every PR:
1. Install (frozen lockfile) → typecheck → lint → unit tests.
2. `validate-content` (frontmatter, duplicate slugs, related targets) and `check-links` (internal links, images exist).
3. Build.
4. Playwright e2e + axe a11y on key pages (390, 768, 1280 px).
5. Lighthouse CI against preview URL with budgets (Perf/A11y/BP/SEO ≥ 95 mobile).
6. `npm audit --omit=dev` (fail on high).
Merge to `main` → production deploy. Branch protection: require CI green + 1 review (or self-review checklist for solo dev).

## 6. Domain and DNS
- Create `support.connectpi.in` CNAME to the host. Add the domain in Vercel, enable HTTPS.
- Email deliverability: configure SPF, DKIM, DMARC for the sending domain (Resend instructions).
- Add a link to Support from the ConnectPi web app footer and mobile app settings (deep link `https://support.connectpi.in/{category}/{slug}?from=app`).

## 7. Future extension points (already designed for)
| Future need | How it plugs in |
|---|---|
| Hindi / more languages | Add `content/hi`, `messages/hi.json`, enable locale switcher flag; hreflang tags from sitemap |
| CMS (Sanity, Strapi, Notion) | Re-implement `lib/content` |
| Better search | Implement `SearchProvider` (Pagefind/Typesense/Algolia) |
| Ticketing (Crisp, Freshdesk) | Implement another `deliver()` |
| Dark mode | Fill dark tokens, enable flag, add toggle |
| AI answer assistant | New route using the search index as retrieval source |
| Status page | `site.json` link + footer item |
| In-app webview embeds | Add `?embed=1` to hide header/footer chrome |
| Versioned docs (app v2) | `platform`/`appVersion` frontmatter and filters |

## 8. Definition of done for any feature
Typed, tested, accessible, responsive at all breakpoints, documented in the PR, no new Lighthouse regression, no console errors.
