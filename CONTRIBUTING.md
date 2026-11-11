# Authoring & Contributing Guide

Welcome to the ConnectPi Support documentation repository. This guide covers how to add, edit, and organize articles, categories, and products across our multi-app knowledge base.

---

## 1. Directory Structure

Content is organized strictly by locale, product, and category:

```text
content/
├── products.json                       # Product hierarchy and metadata
├── site.json                           # Site configuration and navigation
└── en/                                 # Locale root (English)
    ├── connectpi-web/                  # Product slug
    │   ├── _categories.json            # Categories defined for this product
    │   ├── getting-started/            # Category directory
    │   │   └── quickstart-guide.mdx    # Article MDX file
    │   └── account-security/
    │       └── two-factor-auth.mdx
    ├── connectpi-app/
    ├── blade-rush/
    └── shared/                         # Cross-product articles (privacy, policy, etc.)
```

---

## 2. Adding a New Article

### Step 1: Choose Location
Place the new `.mdx` file in the appropriate product and category folder:
`content/en/<product-slug>/<category-slug>/<article-slug>.mdx`

### Step 2: Frontmatter Schema
Every MDX article requires the following YAML frontmatter:

```yaml
---
title: "Article Title (Imperative or Action-Oriented)"
description: "A concise 1-2 sentence summary of what this article explains."
category: "getting-started"       # Must match the category slug
product: "connectpi-web"          # Must match the product slug
order: 1                          # Ordering within the category
status: "published"               # "published", "draft", or "archived"
lastUpdated: "2026-11-11"         # YYYY-MM-DD
featured: false                   # true to show in the home page popular grid
tags: ["login", "pi-network", "authentication"]
---
```

### Step 3: Write Article Content
Use standard Markdown headings (`##`, `###`), paragraphs, lists, and allow-listed MDX components.

> [!NOTE]
> Do NOT use `# Heading 1` in the MDX body. The article's page title (`h1`) is automatically generated from the `title` frontmatter.

---

## 3. Allowed MDX Components

You can embed these interactive components in any `.mdx` file without imports:

### `<Callout>`
Highlights important context, warnings, or tips.
```mdx
<Callout type="info" title="Note">
  Connecting your Pi wallet requires network confirmation.
</Callout>

<Callout type="warning" title="Security Warning">
  Never share your 24-word pass phrase with anyone, including ConnectPi staff.
</Callout>
```
*Supported types:* `info`, `warning`, `tip`, `danger`.

### `<Steps>` and `<Step>`
Displays numbered step-by-step procedures:
```mdx
<Steps>
  <Step title="Open Settings">
    Navigate to your profile settings by clicking your avatar in the upper right.
  </Step>
  <Step title="Enable Two-Factor Authentication">
    Toggle the 2FA switch and scan the QR code using your authenticator app.
  </Step>
</Steps>
```

### `<Screenshot>`
Renders optimized screenshots with accessible descriptions and captions:
```mdx
<Screenshot
  src="/images/connectpi-web/login-screen.png"
  alt="ConnectPi Web login button showing Pi Network icon"
  caption="Figure 1: Click the purple 'Sign in with Pi' button."
/>
```

### `<Kbd>`
Displays keyboard shortcuts:
```mdx
Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open global search anytime.
```

### `<ContactCTA>`
Embeds an in-article contact escalation card:
```mdx
<ContactCTA product="connectpi-web" category="getting-started" />
```

---

## 4. Content Quality Checklist

Before submitting changes:
1. **No Unverified Facts:** If a workflow or UI string is unconfirmed, mark it with `[PLACEHOLDER: description]`.
2. **Run Validation:**
   ```bash
   npm run validate:content
   ```
3. **Verify Links:**
   ```bash
   npm run check:links
   ```
4. **Rebuild Search Index:**
   ```bash
   npm run build:search
   ```
5. **Run Typecheck & Build:**
   ```bash
   npm run typecheck
   npm run build
   ```

