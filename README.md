# ConnectPi Support

Production-ready, accessible, multi-product help center for ConnectPi (`support.connectpi.in`).

## Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS with CSS-variable design tokens
- **Typography:** Space Grotesk (Headings) & Inter (Body)
- **Icons:** Lucide React
- **Validation:** Zod
- **Localization:** next-intl (English default, extensible)
- **Node Version:** v22.23.4
- **Package Manager:** npm (with package-lock.json)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.
Visit [http://localhost:3000/dev/styleguide](http://localhost:3000/dev/styleguide) to preview the design system components.

### 4. Code Quality & Build Checks
```bash
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint check
npm run build        # Production Next.js build
```

## Multi-App Model
Products are configured in `content/products.json`. Adding a product requires zero code changes:
1. Add product metadata to `content/products.json`.
2. Add categories and articles to `content/en/<product-slug>/`.
3. Build and deploy.

## Documentation
Comprehensive specs are located in `docs/`:
- `PRD.md`: Product requirements and scope
- `MULTI_APP_ADDENDUM.md`: Multi-product routing and config
- `DESIGN_SYSTEM.md`: Design tokens, colors, typography, components
- `RESPONSIVE_SPEC.md`: Breakpoints and responsive layouts
- `DECISIONS.md`: Architectural decisions log
- `CHANGELOG.md`: Release notes and progress tracking
