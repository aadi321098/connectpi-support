# Multi-App Addendum (overrides PRD.md where they conflict)

The help center supports **many products** (ConnectPi Web, ConnectPi App, Blade Rush, and any future app) from one codebase and one domain. Adding an app must be a **content/config change only, no code change**.

## 1. Model

```
Product (app)  →  Category (topic inside that app)  →  Article
```
A special product `shared` (shown as "All apps") holds articles that apply to every app (Pi sign-in, safety, privacy, report a bug). Shared categories appear in every app's sidebar under an "All apps" heading.

## 2. Config: `content/products.json`

```json
[
  { "slug": "connectpi-web", "name": "ConnectPi Web", "type": "web", "description": "Social hub on connectpi.in: profile, posts, loyalty points.", "initial": "W", "accent": "#5B2FC9", "tint": "#EFE9FF", "order": 1, "url": "https://connectpi.in", "status": "active" },
  { "slug": "connectpi-app", "name": "ConnectPi App", "type": "android", "description": "The mobile app: install, updates, notifications, login.", "initial": "A", "accent": "#0F6B63", "tint": "#DDF3F0", "order": 2, "url": "[PLAY STORE URL]", "status": "active" },
  { "slug": "blade-rush", "name": "Blade Rush", "type": "game", "description": "Fruit slicing game: gameplay, purchases, ads and rewards.", "initial": "B", "accent": "#8A4B00", "tint": "#FFEBC7", "order": 3, "url": "[GAME URL]", "status": "active" }
]
```
`status`: `active | hidden | archived` (archived apps stay online with a banner, hidden apps are not listed). Accent/tint pairs must pass WCAG AA (validated at build).
Per-app categories live in `content/<locale>/<product>/categories.json` (same shape as CONTENT_MODEL.md §2). `content/<locale>/shared/` uses the same structure.

## 3. Routes (replace PRD §4)

```
/                                   Home: choose app + shared topics + popular
/[product]                          App hub (topics of that app, popular, search scoped to app)
/[product]/[category]               Category page
/[product]/[category]/[article]     Article page
/shared/[category]/[article]        Shared article (also reachable from any app sidebar)
/search?q=&app=                     Search (app filter, default All apps)
/contact?app=&from=                 Contact (app pre-selected)
/legal/...                          Global legal; optional per-app legal at /[product]/legal/[doc]
```
Reserved slugs: `search`, `contact`, `legal`, `shared`, `api`, `_next`. Build fails if a product uses one.
Old URLs from the single-app plan are not needed (site not live yet). Any later move uses `redirects.json`.

## 4. Frontmatter additions

```yaml
product: blade-rush        # derived from folder, validated
appliesTo: [connectpi-web, connectpi-app]   # optional: show a "shared" article in these apps' search/sidebar only
platform: [android]        # optional badge
appVersion: ">=1.4.0"      # optional, future versioned help
```
Article IDs are `product/category/slug`. `related` may point across products.

## 5. UI behavior (see canvas boards 4, 5, 6)

| Area | Desktop/tablet | Mobile |
|---|---|---|
| Home | Search with **app filter select** + input. "Choose your app" cards (auto-fit grid, 1–3 cols), "Help for every app" quick links, popular articles with **app badge** | Filter chips (All / Web / App / Games), app cards stacked as rows, shared links list |
| Header | Logo + nav; on app pages an **app switcher pill** (listbox, keyboard accessible) | Switcher inside the menu drawer (top item) |
| App hub | Tinted band with app icon, name, scoped search; left sidebar = that app's topics, then "All apps" topics | Sidebar becomes a topic disclosure at top; same order |
| Category/Article | As original design, breadcrumb = Help Center / App / Category / Article; sidebar scoped to the app | As original |
| Contact | **"Which app?" select** (required), pre-selected from `?app=`; email subject `[App Name][type]`; optional per-app routing to different inboxes (`products.json: supportEmail`) | Same |
| Search | App filter chips; results show app badge; default = all apps; when launched from an app hub default = that app | Same |
| Footer | Apps column auto-generated from products.json | 2-column |
| Branding | Per-app accent only on icon tile, hub band and badges; global brand color stays for buttons and links | Same |

## 6. Code changes vs the single-app plan

- `lib/content`: every function takes `(locale, product, …)`; add `getProducts()`, `getProduct(slug)`, `getSharedCategories()`; sidebar = product categories + shared categories.
- Routes: `app/[locale]/[product]/...` with `generateStaticParams` from products.json; `dynamicParams = false`.
- Search records gain `product` and `productName`; Fuse filter by product; index stays one file per locale (split per product only if > 1 MB).
- Contact schema gains `product` enum generated from products.json; analytics events gain a `product` property; feedback API stores `product`.
- Sitemap, JSON-LD breadcrumbs, OG image (shows app name and accent) include the product.
- `scripts/validate-content.ts` also checks: product folder exists for each active product, accent contrast, reserved slugs, shared articles' `appliesTo` references.
- Add a "New app checklist" to README (below).

## 7. New app checklist (no code needed)

1. Add an entry to `content/products.json`.
2. Create `content/en/<slug>/categories.json` and at least 3 articles.
3. (Optional) per-app support inbox and legal pages.
4. Add the app to the in-app Help link: `https://support.connectpi.in/<slug>?from=app`.
5. Run `pnpm validate:content`, open the preview, merge.

## 8. Operations for many apps

- One contact inbox by default; optional routing per app. Use labels/filters by the `[App Name]` subject prefix.
- Analytics dashboards filter by `product`.
- Each app's articles reviewed every 6 months; `status: archived` when an app is retired.
- Scale limit for this design: dozens of apps and thousands of articles are fine with static generation. If search index exceeds ~1 MB per locale, switch to Pagefind (adapter already exists).
- If you ever want separate domains per app (e.g. `help.bladerush.app`), the same codebase can serve them by mapping hostname → product in middleware. Not needed now.

## 9. Agent prompt addition (paste after Prompt 0, before Phase 0)

```
IMPORTANT CHANGE: the site supports multiple products (apps). Read /docs/MULTI_APP_ADDENDUM.md right after PRD.md and treat it as overriding the single-app routes, content model and contact form in the other docs. Visual reference: canvas boards 4 (multi-app Home), 5 (app hub) and 6 (390px mobile). Build everything product-aware from Phase 0 so that adding an app is only a config + content change.
```
