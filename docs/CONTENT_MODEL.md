# Content Model and Authoring Guide

All content lives in Git as MDX/JSON. Build fails if frontmatter is invalid.

## 1. Folder layout

```
content/
  site.json                 # site-wide config (popular searches, support email label, nav, footer links)
  categories.json           # categories: slug, title, description, icon, order
  en/
    getting-started/
      create-your-profile.mdx
    account/
      cant-login.mdx
      delete-account.mdx
    loyalty-points/
      how-loyalty-points-work.mdx
    legal/
      privacy.mdx
      terms.mdx
      community-guidelines.mdx
  hi/                       # future; same structure
public/
  images/articles/<slug>/*.webp
redirects.json              # [{ "from": "/old", "to": "/new", "permanent": true }]
```

URL = `/{category}/{file-name-without-extension}`. File names are the permanent slug: lowercase, hyphenated, no dates.

## 2. `categories.json`

```json
[
  { "slug": "getting-started", "title": "Getting started", "description": "Create your profile, sign in with Pi and learn the basics.", "icon": "check", "order": 1 },
  { "slug": "account", "title": "Account & login", "description": "Login errors, profile edits, account deletion.", "icon": "user", "order": 2 },
  { "slug": "community", "title": "Posts & community", "description": "Posting, comments, following people and groups.", "icon": "message-square", "order": 3 },
  { "slug": "loyalty-points", "title": "Loyalty points & rewards", "description": "How points are earned, used and where they show up.", "icon": "coins", "order": 4 },
  { "slug": "safety-privacy", "title": "Safety & privacy", "description": "Reporting, blocking, data and community rules.", "icon": "shield", "order": 5 },
  { "slug": "bugs-feedback", "title": "Bugs & feedback", "description": "Something broken? Tell us or suggest a feature.", "icon": "alert-triangle", "order": 6 }
]
```

## 3. Article frontmatter (Zod-validated)

```yaml
---
title: "I can't log in with Pi Browser"      # required, 10–70 chars (SEO title)
summary: "Fix common login errors."           # required, 40–160 chars (meta description + list text)
category: account                              # required, must exist in categories.json
order: 10                                      # optional, lower first (default 100)
featured: true                                 # optional, shows in Home "Popular articles"
tags: [login, pi-browser, error]               # optional, search boost
related: [account/edit-profile]                # optional, "category/slug", max 3
updated: 2026-11-10                            # required, ISO date, shown as "Last updated"
published: true                                # optional, default true; false = hidden in prod
platform: [web, android]                       # optional, shows a badge; web|android|ios
faq:                                           # optional, enables FAQPage JSON-LD
  - q: "Why does login fail?"
    a: "Short answer."
---
```

Validation rules: unique `category/slug`, `related` targets must exist, `updated` not in the future, title unique within category, no broken internal links (checked in CI).

## 4. MDX components (allow-list)

`<Callout type="note|tip|warning" title="…">`, `<Steps>` with `<Step title="…">`, `<Screenshot src alt caption width height />`, `<Badge>`, `<Kbd>`, `<Contact />` (inline contact CTA). Standard markdown (headings, lists, tables, code, links, images) is supported. Anything else is rejected at build.

## 5. Article template

```mdx
---
title: "…"
summary: "…"
category: …
updated: YYYY-MM-DD
---

One-paragraph answer first: what the problem is and the fastest fix.

## Before you start
- Requirements (app version, account state).

## Steps
<Steps>
  <Step title="Open …">What to tap or click.</Step>
  <Step title="…">…</Step>
</Steps>

<Callout type="tip" title="Tip">Optional helpful hint.</Callout>

## Still not working?
Explain the next check, then: <Contact />
```

## 6. Writing guidelines
- Lead with the answer. One topic per article. Titles are tasks or questions ("How to delete my account").
- Short sentences, active voice, numbered steps, one action per step. Use the exact UI labels from the app in **bold**.
- Every image has alt text; screenshots are WebP, max 1600 px wide, no personal data.
- Do not state product behavior that is not verified. Use `[PLACEHOLDER: …]` and flag it in the PR description.
- Review each article at least every 6 months; update `updated`.

## 7. Content API (internal module `lib/content`)

```ts
getSite(): Site
getCategories(locale): Category[]
getCategory(locale, slug): Category | null
getArticlesByCategory(locale, slug): ArticleMeta[]
getArticle(locale, category, slug): Article | null      // includes compiled MDX, headings, readingTime
getFeaturedArticles(locale): ArticleMeta[]
getRelatedArticles(locale, article): ArticleMeta[]
getSearchRecords(locale): SearchRecord[]                // for the index
```

All pages consume only these functions. Replacing MDX with a CMS means re-implementing this module.

## 8. Search record shape

```ts
type SearchRecord = { id: string; url: string; title: string; summary: string; category: string; tags: string[]; headings: string[]; body: string /* plain text, truncated to 5000 chars */ };
```
Weights (Fuse keys): title 0.4, tags 0.2, headings 0.2, summary 0.15, body 0.05. Threshold ~0.35. Index emitted to `public/search-index.<locale>.<hash>.json` at build.
