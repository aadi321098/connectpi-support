# Changelog

All notable changes to the ConnectPi Support project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added - Phase 0
- Project initialization with Next.js App Router, TypeScript strict, and Tailwind CSS.
- Design tokens defined as CSS variables for light mode and dark mode placeholders (`styles/globals.css`).
- Next.js font configuration for `Space Grotesk` and `Inter` via `next/font/google`.
- `next-intl` configuration with English (`en`) messages catalog.
- Layout shell components: `SkipLink`, `Container`, `Header`, `MobileDrawer`, `Footer`.
- Core UI components: `Button`, `Chip`, `Card`, `Icon`.
- Product configuration in `content/products.json` and site configuration in `content/site.json`.
- Dev styleguide route `/dev/styleguide` demonstrating components across all breakpoints.
- Environment validation (`lib/env.ts`) and feature flags (`lib/features.ts`).
