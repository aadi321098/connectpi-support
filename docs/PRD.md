# PRD: ConnectPi Support Website

| | |
|---|---|
| Product | ConnectPi Support (Help Center) |
| Domain | `support.connectpi.in` (recommended subdomain of connectpi.in) |
| Owner | Aditya (independent developer) |
| Status | Ready for implementation |
| Version | 1.0 |

Companion files: `DESIGN_SYSTEM.md`, `RESPONSIVE_SPEC.md`, `CONTENT_MODEL.md`, `TECH_ARCHITECTURE.md`, `QA_CHECKLIST.md`, `AGENT_PROMPT.md`.

---

## 1. Summary

A fast, accessible, mobile-first help center for ConnectPi (a Pi Network social hub with a Next.js web app and a React Native mobile app). Users find answers by search or by browsing topics, read articles, and contact the team if they are still stuck. Content is written as MDX files in the repo, so there is no database and no admin panel in v1.

## 2. Goals and non-goals

### Goals
1. Reduce repeated support questions by making answers easy to find (search + topics).
2. Give users a reliable way to reach the team (contact/bug form).
3. Work excellently on phones first, then tablet and desktop.
4. Be cheap to run and trivial to update (add a file, push, deployed).
5. Be future-proof: ready for Hindi/other languages, a CMS, a ticketing tool and dark mode without rewrites.

### Non-goals (v1)
- User accounts or login on the support site.
- Live chat, chatbot, community forum, ticket dashboard.
- A CMS/admin UI (content lives in Git).
- Payments or any Pi SDK integration.

## 3. Users and key scenarios

| Persona | Context | Need |
|---|---|---|
| New user | Phone, often inside Pi Browser, slow/mid-range network | Understand how to get started and log in |
| Existing user with a problem | Phone, frustrated | Find the fix in under 30 seconds, or contact support |
| Tablet/desktop user | Larger screen | Browse topics, read longer guides |
| Team member (Aditya) | Laptop | Add or edit an article in minutes, see what users search for |
| Search engine / link sharer | Google, WhatsApp, Telegram | Clean URLs, good titles, link previews |

Primary scenarios:
- S1: User lands on Home, types "login", opens the right article, marks it helpful.
- S2: User opens a deep link from the app (`/account/cant-login?from=app`) and reads the article.
- S3: User cannot solve the problem, opens Contact, submits the form, sees confirmation, gets an email reply.
- S4: User browses Topics, navigates between articles using the sidebar.
- S5: Team adds `content/en/account/delete-account.mdx`, pushes, article is live and searchable.

## 4. Information architecture

```
/                               Home
/[category]                     Category page            e.g. /account
/[category]/[article]           Article page             e.g. /account/cant-login
/search?q=                      Search results
/contact                        Contact / report a bug / feedback form
/legal/privacy                  Privacy policy
/legal/terms                    Terms of service
/legal/community-guidelines     Community guidelines
/404                            Not found (with search + popular links)
/sitemap.xml  /robots.txt       SEO
```

Launch categories (slug → title):
`getting-started` Getting started · `account` Account & login · `community` Posts & community · `loyalty-points` Loyalty points & rewards · `safety-privacy` Safety & privacy · `bugs-feedback` Bugs & feedback.

Categories are defined in `content/categories.json` (see `CONTENT_MODEL.md`), not hard-coded.

## 5. Functional requirements

Priority: **P0** = launch blocker, **P1** = launch if time allows, **P2** = post-launch.

### 5.1 Global layout
| ID | Requirement | Pri |
|---|---|---|
| G1 | Header on every page: logo/home link, nav (Help Center, Categories, Safety & Privacy, Contact us), "Open ConnectPi" button (links to https://connectpi.in) | P0 |
| G2 | Mobile header: logo + search icon + menu button; menu opens an accessible full-height drawer (focus trap, Esc closes, restores focus) | P0 |
| G3 | Footer on every page: brand blurb, Help links, Legal links, Contact (email, connectpi.in), copyright | P0 |
| G4 | Skip-to-content link as the first focusable element | P0 |
| G5 | Current-page state in nav and sidebar via `aria-current="page"` | P0 |
| G6 | Language switcher slot (hidden until a second locale exists) | P2 |
| G7 | Dark mode via tokens (`prefers-color-scheme` + manual toggle) | P2 |

### 5.2 Home
| ID | Requirement | Pri |
|---|---|---|
| H1 | Hero with H1 "Hi, how can we help?", short subtitle, search field with visible label (visually hidden OK) and button | P0 |
| H2 | Popular-search chips (configurable list in `content/site.json`) | P0 |
| H3 | "Browse by topic" grid of category cards (icon, title, one-line description); whole card is one link | P0 |
| H4 | "Popular articles" list (configured by `featured: true` in article frontmatter, ordered by `order`) | P0 |
| H5 | "Still need help?" card with Contact and Report a bug buttons | P0 |
| H6 | No sidebar on Home | P0 |

### 5.3 Category page
| ID | Requirement | Pri |
|---|---|---|
| C1 | Breadcrumb (Help Center / Category) with BreadcrumbList JSON-LD | P0 |
| C2 | Sidebar listing all categories; current one highlighted | P0 |
| C3 | H1, intro sentence, list of articles (title + summary), sorted by `order` then title | P0 |
| C4 | Empty state if a category has no articles | P1 |
| C5 | Contact CTA at bottom | P0 |

### 5.4 Article page
| ID | Requirement | Pri |
|---|---|---|
| A1 | Breadcrumb (Help Center / Category / Article) with JSON-LD | P0 |
| A2 | Left sidebar: articles of the same category, current highlighted | P0 |
| A3 | Content: H1, "Last updated" date, MDX body with styled prose (headings, lists, tables, code, images, callouts, steps) | P0 |
| A4 | Right rail "On this page" table of contents generated from H2/H3, with scroll-spy highlight | P0 |
| A5 | "Was this article helpful?" Yes/No, posts to `/api/feedback`; after click shows thank-you; on "No" shows a link to Contact | P1 |
| A6 | Related articles (frontmatter `related` or same category fallback), max 3 | P0 |
| A7 | Heading anchor links (copy link on hover/focus) | P1 |
| A8 | Print stylesheet (hide chrome, show content) | P2 |
| A9 | `?from=app` param is preserved and shown on the contact form as context (not stored beyond the email) | P2 |

### 5.5 Search
| ID | Requirement | Pri |
|---|---|---|
| S1 | Build-time index of title, summary, headings, body text, tags | P0 |
| S2 | Client-side fuzzy search (Fuse.js) with typo tolerance; results page `/search?q=` is server-rendered shell + client results | P0 |
| S3 | Instant suggestions dropdown (top 5) under the search field, keyboard navigable (↑ ↓ Enter Esc), `role="combobox"` pattern | P1 |
| S4 | "No results" state with tips + Contact link | P0 |
| S5 | Index loaded lazily (only when the user focuses search) to protect page weight | P0 |
| S6 | Search behind an adapter interface so Pagefind/Algolia/Typesense can replace it | P1 |
| S7 | Log anonymous queries with zero results (for content gaps) | P2 |

### 5.6 Contact form
| ID | Requirement | Pri |
|---|---|---|
| F1 | Fields: type (Question / Bug report / Feedback / Account issue), name, email, ConnectPi username, subject, message (max 4000 chars), optional device/OS/app version (shown for Bug report), consent checkbox | P0 |
| F2 | Client + server validation using the same Zod schema | P0 |
| F3 | Spam protection: honeypot field + Cloudflare Turnstile + IP rate limit (e.g. 5/hour) | P0 |
| F4 | Delivery: email to support inbox via Resend (or SMTP), reply-to set to user's email; confirmation email to user is optional | P0 |
| F5 | States: idle, validating, submitting (button disabled + spinner), success (clear message + what happens next), error (retry, message preserved) | P0 |
| F6 | Never log message bodies or emails in app logs | P0 |
| F7 | No file uploads in v1 (screenshot upload is P2 with virus scanning) | P2 |

### 5.7 System pages
- 404 page with search and popular links (P0). 500/error boundary page (P0).
- Legal pages rendered from MDX (P0). Content is supplied by the owner; use clearly marked `[PLACEHOLDER]` text until supplied.

## 6. Responsive requirements (summary)

Full rules in `RESPONSIVE_SPEC.md`. The design is **mobile-first**; breakpoints:

| Name | Range | Layout intent |
|---|---|---|
| Mobile | 320–767 px | Single column, drawer nav, stacked cards, collapsible topics and TOC |
| Tablet | 768–1023 px | 2-column card grid, inline topic chips, single reading column, TOC inline |
| Desktop | ≥ 1024 px | Sidebar + content; ≥ 1280 px adds right TOC rail; content max width 1120 px |

Hard rules:
- No horizontal scroll at any width from 320 px to 2560 px (tables and code blocks scroll inside their own box).
- Touch targets ≥ 44×44 px on touch devices.
- Support zoom to 200% and text-only zoom without loss of content.
- Support portrait and landscape; respect safe-area insets (`env(safe-area-inset-*)`).
- Use `rem`/`%`/`clamp()`; avoid fixed px widths; use `dvh` (not `vh`) for full-height mobile elements.

## 7. Non-functional requirements

### 7.1 Performance (measured on mid-range Android, throttled 4G)
- LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms, TTFB ≤ 0.6 s (CDN cached).
- Article page JS ≤ 100 KB gzipped; Home ≤ 120 KB. Search index is lazy and not counted.
- All pages statically generated (SSG/ISR). Only `/api/*` is dynamic.
- Fonts: self-hosted via `next/font`, `display: swap`, 2 families max, subsetted.
- Images: `next/image`, AVIF/WebP, explicit width/height, lazy below the fold.
- Lighthouse (mobile) ≥ 95 for Performance, Accessibility, Best Practices, SEO on Home, Category, Article.

### 7.2 Accessibility: WCAG 2.2 AA
- Semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`), one H1 per page, logical heading order.
- Text contrast ≥ 4.5:1 (≥ 3:1 for 24px+ text and UI components). Do not rely on color alone.
- Fully keyboard operable with visible focus (≥ 2 px ring, 3:1 contrast). No keyboard traps except intentional modal focus traps.
- Labels for every input; errors announced via `aria-live` and linked with `aria-describedby`.
- Respect `prefers-reduced-motion`. Provide alt text for all meaningful images.
- Test with VoiceOver (iOS), TalkBack (Android) and NVDA.

### 7.3 SEO and sharing
- Unique `<title>` and meta description per page (from frontmatter), canonical URLs, `sitemap.xml`, `robots.txt`.
- JSON-LD: `WebSite` (with SearchAction) on Home, `BreadcrumbList` on category/article, `Article` (or `FAQPage` when article has `faq`) on article.
- Open Graph + Twitter cards; generated OG image per article (`next/og`).
- Clean, stable, lowercase, hyphenated URLs. Moved/renamed pages get entries in `redirects.json`.
- `noindex` on `/search` and `/contact` success states.

### 7.4 Security and privacy
- HTTPS only, HSTS. Security headers: CSP (nonce or hashes), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera/mic/geolocation), `X-Frame-Options`/`frame-ancestors 'none'`.
- Secrets only in server env vars; `.env.example` committed, real `.env` never.
- Form: server-side validation, output encoding, rate limiting, CSRF-safe (same-origin POST + Turnstile token), size limits.
- MDX is trusted (authored by owner) but components are allow-listed; no `dangerouslySetInnerHTML` of user input anywhere.
- Analytics: privacy-friendly and cookieless (Plausible, Umami or Vercel Analytics). No third-party ad trackers. If cookies are ever added, add a consent banner.
- Comply with applicable privacy laws (for example India's DPDP Act). State data retention for contact emails in the privacy policy.
- Dependency hygiene: lockfile, Dependabot/Renovate, `npm audit` in CI.

### 7.5 Compatibility
- Latest 2 versions of Chrome, Safari, Firefox, Edge; Android Chrome and Samsung Internet; iOS Safari.
- **Pi Browser (in-app WebView)**: many ConnectPi users will arrive from it. Verify layout, links, search and the form there. Avoid features that depend on unsupported APIs; provide graceful fallbacks. External links (`https://connectpi.in`) must open correctly.
- Works with JavaScript slow or blocked for reading content (articles are server-rendered HTML). Search and the form can require JS.

### 7.6 Reliability and operations
- Hosting on Vercel (or Cloudflare Pages) with CDN; preview deployment per PR; production on `main`.
- Uptime monitoring (UptimeRobot/Better Stack) for `/` and `/api/health`.
- Error monitoring (Sentry free tier) with PII scrubbing.
- Form failure fallback: if email provider fails, show the support email address to the user.

## 8. Future-proofing (design decisions that must hold from day 1)

1. **i18n-ready**: all UI strings in `messages/en.json` (via `next-intl` or equivalent); content under `content/<locale>/...`; routes can gain a `/hi` prefix without restructuring. Ship `en` only; add `hi` in phase 2.
2. **Content layer abstraction**: pages read content through `lib/content` (functions like `getAllArticles`, `getArticle`, `getCategory`). Swapping MDX for a headless CMS later changes only that module.
3. **Search adapter**: single interface `SearchProvider { index(); query(q) }`.
4. **Design tokens as CSS variables**: dark mode, rebranding and white-labelling are token changes.
5. **Feature flags** in `config/features.ts` (feedback, suggestions, dark mode, locale switcher).
6. **Ticketing adapter**: contact form calls `lib/support/deliver()`; can switch from email to Crisp/Freshdesk/Zendesk later.
7. **Redirect map** and stable slugs to keep SEO value when content moves.
8. **Typed everything**: TypeScript strict, Zod for content frontmatter and API payloads, validated at build so a bad article fails CI, not production.

## 9. Analytics and success metrics

Events (cookieless): `search_submit`, `search_no_results`, `article_view`, `feedback_yes`, `feedback_no`, `contact_start`, `contact_submit_success`, `contact_submit_error`, `outbound_click_connectpi`.

| Metric | Target (90 days after launch) |
|---|---|
| Article helpful rate | ≥ 70% |
| Search with zero results | ≤ 10% of searches |
| Contact form submissions per 100 article views | trending down |
| Core Web Vitals "Good" (field) | ≥ 90% of page loads |
| Time to publish a new article | ≤ 10 minutes |

## 10. Launch scope and milestones

| Milestone | Scope |
|---|---|
| M0 Scaffold | Repo, tooling, CI, tokens, layout shell (header/footer), deploy preview |
| M1 Content system | MDX pipeline, frontmatter validation, category + article pages, sidebar, TOC, breadcrumbs |
| M2 Discovery | Home, search index + results page, suggestions |
| M3 Contact | Form, validation, Turnstile, rate limit, email delivery, success/error states |
| M4 Quality | SEO, JSON-LD, OG images, a11y fixes, perf budgets, Pi Browser testing, legal pages |
| M5 Launch | Seed content (min. 12 articles, 2+ per category), DNS for subdomain, monitoring, handover docs |

Launch gate: every P0 requirement done and every item in `QA_CHECKLIST.md` marked pass.

## 11. Seed content required for launch (minimum)

Getting started (2), Account & login (3: cannot login, edit profile, delete account), Posts & community (2), Loyalty points (3: how it works, where is my balance, missing points), Safety & privacy (2: report a post/user, block a user), Bugs & feedback (1: how to report a bug). Owner supplies final wording; the agent writes structured drafts with `[PLACEHOLDER]` markers where product facts are needed. **Agents must not invent product behavior.**

## 12. Open questions (owner to answer; agent uses defaults meanwhile)

| # | Question | Default |
|---|---|---|
| 1 | Final support email address | `[SUPPORT EMAIL]` env var `SUPPORT_TO_EMAIL` |
| 2 | Hosting: Vercel or Cloudflare | Vercel |
| 3 | Hindi at launch? | No, English first; architecture ready |
| 4 | Link to a status page? | Hidden until provided |
| 5 | Legal text source | Placeholder pages |
| 6 | Analytics provider | Vercel Analytics or Plausible |
| 7 | Logo/brand assets | Text logo + "C" mark from the design |

## 13. Risks

| Risk | Mitigation |
|---|---|
| Thin content makes the site useless | Content is a launch gate; seed list in §11 |
| Spam on the form | Turnstile + honeypot + rate limit |
| Pi Browser quirks | Explicit test pass; progressive enhancement |
| Content drifts from product | "Last updated" on articles; quarterly content review checklist |
| Vendor lock-in | Adapters for content, search, delivery |
