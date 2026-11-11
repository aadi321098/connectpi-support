# ConnectPi Support: Planning Pack

Everything an AI coding agent (or a human developer) needs to build `support.connectpi.in`.

| File | What it is |
|---|---|
| `PRD.md` | Product requirements: goals, users, IA, features with IDs and priorities, non-functional requirements, future-proofing, metrics, milestones, risks |
| `RESPONSIVE_SPEC.md` | Exact layout rules for mobile, tablet and desktop, component by component, plus acceptance tests |
| `DESIGN_SYSTEM.md` | Colors, type, spacing, components, accessibility rules |
| `CONTENT_MODEL.md` | Folder layout, frontmatter schema, MDX components, article template, content API |
| `TECH_ARCHITECTURE.md` | Stack, repo structure, rendering, APIs, security, CI/CD, DNS, extension points |
| `QA_CHECKLIST.md` | Launch checklist across functionality, responsive, a11y, performance, SEO, security |
| `MULTI_APP_ADDENDUM.md` | **Read second.** Multiple apps (ConnectPi Web, App, Blade Rush, future apps): routes, config, UI, new-app checklist. Overrides single-app parts of other files |
| `AGENT_PROMPT.md` | Copy-paste prompts: master prompt, 6 phase prompts, review and change templates |

## How to start
1. Create an empty repo, copy this folder in as `docs/`.
2. Open it in your AI coding agent.
3. Paste **Prompt 0** from `AGENT_PROMPT.md`, then the phase prompts one by one. Review in a browser between phases.

## Visual reference
The approved design canvas (Home, Category, Article) is in your Claude Design artifact "ConnectPi Support Site". Export screenshots of it into `docs/design/` so the agent can use them as visual reference.

## Things only you can provide
Support email, final legal text, real article content and screenshots, domain/DNS access, Resend, Turnstile, Upstash, Sentry and analytics accounts.
