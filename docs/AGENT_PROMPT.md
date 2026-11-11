# AI Agent Prompts

How to use: put this whole folder in the new repo under `docs/`, open the repo in your AI coding agent (Claude Code, Cursor, Codex, etc.), then paste **Prompt 0 (Master)** first. After it finishes, paste the phase prompts **one at a time**, reviewing the result (and running the app) between phases. Paste the "Review prompt" at the end of each phase.

---

## Prompt 0: Master prompt (paste first)

```
You are a senior full-stack engineer and accessibility-minded UI engineer. Build the ConnectPi Support website (a help center) as a production-ready, responsive, future-proof Next.js app.

SOURCE OF TRUTH
Read ALL files in /docs before writing any code, in this order:
1. PRD.md  2. MULTI_APP_ADDENDUM.md (the site supports MULTIPLE apps/products; it overrides single-app routes, content model and contact form)  3. RESPONSIVE_SPEC.md  4. DESIGN_SYSTEM.md  5. CONTENT_MODEL.md  6. TECH_ARCHITECTURE.md  7. QA_CHECKLIST.md
Build everything product-aware from Phase 0 so adding an app is only a config + content change.
If anything conflicts, MULTI_APP_ADDENDUM.md wins on structure, PRD.md wins on scope, RESPONSIVE_SPEC.md wins on layout, DESIGN_SYSTEM.md wins on tokens. If something is ambiguous or missing, choose the most conservative reasonable default, write the decision in /docs/DECISIONS.md, and continue. Do not stop to ask unless a secret/credential is required.

NON-NEGOTIABLE RULES
1. Mobile-first and fully responsive for mobile (320-767), tablet (768-1023), desktop (>=1024, TOC rail >=1280) exactly as RESPONSIVE_SPEC.md describes. No horizontal scroll at any width 320-2560. Touch targets >= 44px. Use dvh not vh. Respect safe-area insets.
2. WCAG 2.2 AA: semantic landmarks, one h1 per page, visible focus, keyboard operable, labelled inputs, aria-current, reduced motion. Never use div/span with onClick as a button or link.
3. TypeScript strict. Zod for env, frontmatter and API payloads. No `any` without a justified comment.
4. Static generation for all content pages. Only /api/* is dynamic. Keep client JS minimal: prefer Server Components; add "use client" only for the drawer, search, TOC scroll-spy, feedback widget and contact form.
5. Pages read content ONLY through lib/content. Search goes through the SearchProvider interface. Contact delivery goes through lib/support/deliver. UI strings come from messages/en.json (next-intl). This keeps i18n, CMS, search and ticketing swappable.
6. Design tokens as CSS variables (see DESIGN_SYSTEM.md) mapped into the Tailwind theme. Do not hard-code hex values in components.
7. Do NOT invent product facts about ConnectPi. In content, use [PLACEHOLDER: ...] where facts are needed. CI must fail the production build if any [PLACEHOLDER appears in published content (allow it in preview).
8. Security: follow PRD section 7.4 (headers, CSP, rate limiting, Turnstile, honeypot, no PII in logs). Never commit secrets; provide .env.example and a Zod-validated lib/env.ts.
9. Do not install packages from memory-based version guesses: install latest stable via the package manager, commit the lockfile, and note the Next.js and Node versions in README.
10. Write tests as you go (Vitest unit, Playwright e2e + axe). Every phase ends with: typecheck, lint, tests, build all passing.

WORKING METHOD
- Work in phases from the phase prompts I will send. For each phase: state a short plan, implement, run checks, then summarise what changed, how to run it, and anything that needs my input.
- Commit after each phase with a clear message (Conventional Commits).
- Keep a running /docs/DECISIONS.md and /docs/CHANGELOG.md.
- When finished with a phase, test the UI in a real browser at 390, 768, 1024 and 1440 px widths (Playwright screenshots are fine) and fix visual or layout bugs before reporting.

First task now: read the docs, then reply with (a) a one-paragraph understanding, (b) the list of open questions with the defaults you will use, (c) the exact commands you will run to scaffold the project. Then WAIT for Phase 0 prompt.
```

---

## Phase 0: Scaffold, tooling, tokens, shell

```
PHASE 0. Scaffold and layout shell.

1. Create the Next.js app (App Router, TypeScript strict, Tailwind, ESLint with jsx-a11y, Prettier, pnpm) at the repo root following the folder structure in TECH_ARCHITECTURE.md section 2.
2. Implement design tokens in styles/globals.css (CSS variables for light mode + reserved dark tokens) and map them into tailwind.config. Load Space Grotesk and Inter with next/font (self-hosted, swap, latin subset).
3. Set up next-intl with locale "en" only (localePrefix "as-needed"), messages/en.json, and lib/env.ts (Zod, fail fast), lib/features.ts (feature flags).
4. Build components/layout: SkipLink, Container, Header (desktop inline nav, tablet condensed, mobile logo + search icon + menu button), MobileDrawer (accessible focus trap, Esc, overlay, scroll lock, restores focus), Footer (4 columns -> 2x2 -> stacked per spec). Use the nav and footer links from content/site.json.
5. Build components/ui: Button (primary/secondary/accent, loading state), Chip, Card, Icon (lucide).
6. Add security headers (next.config), robots/sitemap stubs, favicon placeholder, .env.example, README (run, build, test).
7. Add GitHub Actions CI (install, typecheck, lint, unit tests, build) and a Playwright smoke test that loads / at 390, 768, 1280 and asserts no horizontal overflow and that the skip link and landmarks exist.
8. Create a temporary /dev/styleguide route (excluded from production build and sitemap) showing every component and state at all breakpoints.

Acceptance: pnpm typecheck, lint, test, build pass; header and footer match RESPONSIVE_SPEC section 3.1 and 3.2; drawer fully keyboard accessible; Lighthouse mobile >= 95 on the empty shell.
```

---

## Phase 1: Content system and article/category pages

```
PHASE 1. Content system, Category and Article pages.

1. Implement lib/content per CONTENT_MODEL.md: Zod frontmatter schema, categories.json loader, getArticle etc., MDX compile with gray-matter + next-mdx-remote/rsc, rehype-slug, autolink headings, remark-gfm, Shiki highlighting at build, heading extraction for TOC, reading time.
2. Implement allow-listed MDX components: Callout, Steps/Step, Screenshot (next/image), Badge, Kbd, Contact CTA. Style the Prose per DESIGN_SYSTEM.md; tables and code scroll inside accessible wrappers.
3. Build routes: [category] and [category]/[article] with generateStaticParams, dynamicParams=false, generateMetadata, notFound handling.
4. Build nav components: Breadcrumb (mobile shows "<- Parent"), Sidebar (sticky, aria-current), TopicSwitcher (mobile disclosure, tablet chips), Toc (disclosure on <1280, sticky rail with scroll-spy on >=1280), RelatedArticles. Follow RESPONSIVE_SPEC 3.4 and 3.5 exactly.
5. Add scripts/validate-content.ts and scripts/check-links.ts and run them in CI (prebuild). They must fail on invalid frontmatter, duplicate slugs, missing related targets, broken internal links, missing images.
6. Seed content: 12+ articles across the 6 categories using the template in CONTENT_MODEL.md section 5 with [PLACEHOLDER: ...] markers (no invented product facts), plus legal page stubs.
7. JSON-LD (BreadcrumbList, Article, FAQPage when faq exists) and canonical URLs.
8. Playwright tests: category and article render at 390/768/1024/1440, sidebar/TOC visibility changes exactly at the breakpoints, axe has no serious violations, headings anchor links work.

Acceptance: all PRD sections 5.3 and 5.4 P0 items done; QA_CHECKLIST sections 1-3 relevant items pass for these pages.
```

---

## Phase 2: Home and search

```
PHASE 2. Home page and search.

1. Build Home per PRD 5.2 and RESPONSIVE_SPEC 3.3 (hero, popular chips, topic cards grid 1/2/3 columns, popular articles + help card).
2. scripts/build-search-index.ts (prebuild) generating public/search-index.<locale>.<hash>.json from getSearchRecords.
3. lib/search: SearchProvider interface + FuseProvider (weights from CONTENT_MODEL section 8). Lazy-load the index on first focus; memoize; debounce 120 ms.
4. SearchField with combobox pattern (aria-expanded, aria-controls, aria-activedescendant), suggestions (top 5) with full keyboard support, mobile overlay behaviour and desktop popover per RESPONSIVE_SPEC 3.6.
5. /search page: reads ?q=, shows results with category filter, no-results state with tips and Contact link, noindex.
6. WebSite JSON-LD with SearchAction on Home.
7. Tests: typo-tolerant search ("loging" finds login), keyboard navigation, no network fetch of the index before search focus, axe, overflow checks.

Acceptance: PRD 5.2 and 5.5 P0 items done; Home JS <= 120 KB gzipped; Lighthouse mobile >= 95.
```

---

## Phase 3: Contact, feedback, APIs

```
PHASE 3. Contact form, feedback widget, API routes.

1. Shared Zod schema in lib/support/schema.ts used by client and server. Fields per PRD 5.6. Bug report type reveals device/OS/app version fields.
2. ContactForm UI per RESPONSIVE_SPEC 3.7: correct input types, autocomplete, inputmode, 16px inputs, inline errors (aria-invalid, aria-describedby, aria-live), counter for message, all five states (idle, validating, submitting, success, error with preserved input).
3. Turnstile widget (flexible size) with graceful message if it fails to load.
4. POST /api/contact exactly as TECH_ARCHITECTURE section 4: size limit, validation, honeypot, Turnstile verify, rate limit (Upstash/Vercel KV with in-memory fallback in dev), deliver() via Resend with reply-to, no PII in logs, structured error responses, fallback email shown on provider failure.
5. POST /api/feedback and FeedbackWidget (Yes/No, aria-live thank-you, link to Contact on No). GET /api/health.
6. ?from=app context carried to the contact page (shown as a read-only note, included in the email, not stored elsewhere).
7. Tests: unit tests for schema and rate limiter; e2e for success, validation errors, 429, honeypot; mock Resend and Turnstile.

Acceptance: PRD 5.6 P0 items done; QA_CHECKLIST section 6 form-abuse items pass.
```

---

## Phase 4: Quality, SEO, performance, hardening

```
PHASE 4. Production hardening.

1. SEO: metadata for every route, sitemap.ts from content (with hreflang-ready structure), robots.ts, OG images via next/og (default + per article), redirects from redirects.json, trailing-slash policy, 404 and error pages with search and popular links.
2. Accessibility pass: run axe on every route at 3 widths, fix all issues; manual keyboard walkthrough; verify contrast of all token pairs with a script and record the results in docs/A11Y_REPORT.md.
3. Performance pass: enforce JS budgets (fail CI above them), analyse the bundle, remove unused code, check font and image loading, verify CLS, set Lighthouse CI budgets (>= 95 mobile on Home, Category, Article).
4. Visual regression: Playwright snapshots for Home, Category, Article, Search, Contact at 390, 768, 1024, 1440.
5. Print stylesheet for articles; heading anchor copy-link; empty states.
6. Analytics events from PRD section 9 (cookieless provider, behind a feature flag and env var), Sentry with PII scrubbing, error boundary.
7. Dependency hygiene: Renovate/Dependabot config, npm audit in CI.
8. Docs: README (local dev, add an article, add a category, env vars, deploy, rollback, troubleshooting), CONTRIBUTING.md for content authors, docs/RUNBOOK.md (monitoring, incident steps).

Acceptance: every item in QA_CHECKLIST sections 1-9 is either checked or listed with a reason in docs/LAUNCH_NOTES.md.
```

---

## Phase 5: Launch (human + agent)

```
PHASE 5. Launch preparation.

1. Produce docs/LAUNCH_CHECKLIST.md listing exactly what I (the owner) must do: create Vercel project and domain support.connectpi.in, DNS records, Resend domain verification (SPF/DKIM/DMARC), Turnstile keys, Upstash database, Sentry project, analytics ID, final support email, final legal text, final article wording and screenshots. Include copy-paste env var list.
2. Produce a list of all [PLACEHOLDER] occurrences with file, line and what information is needed.
3. Provide suggested link text and URLs for adding Support to the ConnectPi web app footer and the mobile app (including deep links of the form https://support.connectpi.in/<category>/<slug>?from=app).
4. Run the full QA_CHECKLIST automation locally and output the report.
```

---

## Review prompt (paste after each phase)

```
Review your own work for this phase as a strict reviewer:
1. Open the running app at 360, 390, 768, 820, 1024, 1280, 1440 and 1920 px. List any layout issue, overflow, or deviation from RESPONSIVE_SPEC.md and fix it.
2. Check keyboard-only use and screen-reader semantics of every new component.
3. Run typecheck, lint, tests, build, axe and Lighthouse; paste the summary numbers.
4. List any requirement from PRD.md for this phase that is not done, and anything you assumed. Then fix what you can.
```

## Bug-fix / change prompt template

```
Change request: <describe>.
Constraints: keep the responsive behaviour for mobile/tablet/desktop from RESPONSIVE_SPEC.md, keep WCAG AA, update tests and docs, do not add dependencies without justification. Show me the diff summary and how to verify.
```

## Add-content prompt template

```
Add these articles to content/en following CONTENT_MODEL.md. Use only the facts I give you; use [PLACEHOLDER: ...] for anything missing. Update related links, run validate-content and check-links, and rebuild the search index.
<paste your raw notes per article>
```
