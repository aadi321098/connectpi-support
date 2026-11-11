# QA and Launch Checklist

Mark every item before launch. Automated where noted.

## 1. Functional
- [ ] Home: search, popular chips, 6 topic cards, popular articles, help card all work
- [ ] Category pages for all 6 categories render with sidebar/topic switcher and article list
- [ ] Article page: breadcrumb, sidebar, TOC, related, feedback, anchors
- [ ] Search: typo tolerance ("loging" finds login), zero-results state, keyboard navigation in suggestions
- [ ] Contact: all types, validation errors, success, provider failure, rate limit (429), honeypot, Turnstile failure
- [ ] 404 and error pages
- [ ] Redirects from `redirects.json` work
- [ ] Legal pages exist and are linked from the footer
- [ ] Header "Open ConnectPi" and footer links correct

## 2. Responsive (see RESPONSIVE_SPEC.md §6)
| Check | 320 | 360 | 390 | 768 | 820 | 1024 | 1280 | 1440 | 1920 | 2560 |
|---|---|---|---|---|---|---|---|---|---|---|
| No horizontal scroll | | | | | | | | | | |
| Layout matches spec | | | | | | | | | | |
| Touch targets ≥ 44 px (≤1023) | | | | | | | | | | |
- [ ] Landscape phone (844×390) OK; foldable widths (~280, ~717) OK
- [ ] 200% zoom and 400% reflow OK
- [ ] Drawer: focus trap, Esc, overlay, scroll lock, focus restore
- [ ] Safe-area insets respected on notched iPhones
- [ ] Visual regression baselines committed (Home, Category, Article, Search, Contact at 390/768/1024/1440)

## 3. Accessibility (WCAG 2.2 AA)
- [ ] axe-core: 0 serious/critical issues on every route (automated)
- [ ] Keyboard-only run through all journeys; focus visible; logical order; skip link works
- [ ] Screen readers: VoiceOver iOS, TalkBack Android, NVDA (spot-check Home, Article, Contact)
- [ ] Contrast verified for all token pairs, including hero (white on `#2A1668`) and accent button
- [ ] Form errors announced, labels present, autocomplete attributes set
- [ ] Reduced motion respected; no content depends on color alone

## 4. Performance
- [ ] Lighthouse mobile ≥ 95 (Perf, A11y, BP, SEO) on Home, Category, Article (automated)
- [ ] LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on throttled 4G, mid-range Android profile
- [ ] JS budgets: Article ≤ 100 KB gz, Home ≤ 120 KB gz
- [ ] Search index lazy-loaded; not fetched until focus
- [ ] Fonts self-hosted, ≤ 2 families, no layout shift on swap
- [ ] Images optimized, dimensions set

## 5. SEO
- [ ] Unique title and description on every page
- [ ] Canonical, sitemap.xml, robots.txt valid
- [ ] JSON-LD valid (Rich Results Test): WebSite, BreadcrumbList, Article/FAQPage
- [ ] OG/Twitter image renders in WhatsApp/Telegram preview
- [ ] `noindex` on search results; no duplicate URLs (trailing slash policy consistent)

## 6. Security and privacy
- [ ] Security headers present (check with securityheaders.com): CSP, HSTS, nosniff, referrer, permissions, frame-ancestors
- [ ] No secrets in client bundle (grep build output); `.env` not committed
- [ ] Form abuse tested: oversize payload, invalid JSON, script in fields (escaped in email), repeated submissions
- [ ] Logs contain no emails/messages
- [ ] Privacy policy states what contact data is collected, purpose, retention, contact
- [ ] Analytics cookieless; no consent banner required (or banner added if cookies exist)
- [ ] `npm audit` clean for high/critical

## 7. Compatibility
- [ ] Chrome, Safari, Firefox, Edge (latest 2)
- [ ] Android Chrome, Samsung Internet, iOS Safari
- [ ] **Pi Browser**: Home, search, article, contact submit, external link to connectpi.in
- [ ] JS disabled: articles, categories, home readable and navigable

## 8. Content
- [ ] ≥ 12 articles live, ≥ 2 per category (1 for bugs-feedback)
- [ ] No unresolved `[PLACEHOLDER]` in production content (CI grep fails the build)
- [ ] Every article has `updated`, summary, alt text on images
- [ ] Facts verified by the owner against the real app

## 9. Operations
- [ ] Domain + HTTPS live; email SPF/DKIM/DMARC pass
- [ ] Uptime monitor on `/` and `/api/health`; Sentry receiving test event
- [ ] Rollback procedure documented (Vercel instant rollback)
- [ ] README explains: run locally, add an article, add a category, env vars, deploy, troubleshooting
- [ ] Link to Support added in ConnectPi web and mobile apps

## 10. Post-launch (first 2 weeks)
- [ ] Review zero-result searches and add articles
- [ ] Review feedback "No" votes
- [ ] Check Core Web Vitals field data
- [ ] Triage contact form messages into new articles
