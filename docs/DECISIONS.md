# Architecture & Implementation Decisions (ADR)

This file documents all technical, architectural, and design decisions made during the development of ConnectPi Support.

---

## DECISION-001: Multi-App Architecture Priority
- **Date:** 2026-11-11
- **Context:** `MULTI_APP_ADDENDUM.md` vs single-app specifications in `PRD.md`.
- **Decision:** As specified in `AGENT_PROMPT.md` Prompt 0 and `MULTI_APP_ADDENDUM.md`, the site is built multi-app aware from Phase 0. URLs follow `/[product]/[category]/[article]` with `products.json` controlling available products. Single-app routes are omitted because the site is not yet live.
- **Consequences:** All components, search indices, metadata, and breadcrumbs are product-aware from day one.

## DECISION-002: Package Manager
- **Date:** 2026-11-11
- **Context:** System permissions restrict global pnpm installation.
- **Decision:** Use `npm` with `package-lock.json`. This is explicitly permitted in `TECH_ARCHITECTURE.md` §1 ("Package manager: pnpm (or npm) with lockfile").
- **Consequences:** Deterministic builds via `package-lock.json` and standard `npm` commands.

## DECISION-003: Starter Content Scope for Initial Phases
- **Date:** 2026-11-11
- **Context:** User requested 1–2 main topics with placeholder/sample articles initially; full articles to be authored in subsequent discussions.
- **Decision:** Set up full multi-app structure (`connectpi-web`, `connectpi-app`, `blade-rush`, `shared`), but populate 1–2 core categories with starter/placeholder articles using the `[PLACEHOLDER: ...]` format.
- **Consequences:** Validation scripts allow `[PLACEHOLDER]` during development builds and all layout/routing features work seamlessly.

## DECISION-004: Local Development Fallbacks for Cloud Services
- **Date:** 2026-11-11
- **Context:** API keys for Resend, Turnstile, Upstash, Sentry will be configured during production launch (Phase 5).
- **Decision:** In `lib/env.ts`, `lib/support/deliver.ts`, and `lib/support/ratelimit.ts`, implement graceful local dev fallbacks: in-memory rate limiting, console-logged email delivery in non-production, and bypass for Turnstile if keys are missing in dev.
- **Consequences:** Developers can run, test, and build the entire app locally without hitting cloud services.
