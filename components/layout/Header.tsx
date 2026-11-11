"use client";

import React, { useState, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Container } from "./Container";
import { MobileDrawer } from "./MobileDrawer";
import { Button } from "@/components/ui/Button";
import { Menu, Search, ExternalLink, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import siteConfig from "@/content/site.json";
import products from "@/content/products.json";

export function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const appDropdownRef = useRef<HTMLDivElement>(null);

  // Check if current path matches an app/product
  const activeProduct = products.find((p) => pathname.startsWith(`/${p.slug}`));

  return (
    <>
      <header
        role="banner"
        className="w-full bg-surface border-b border-border transition-all duration-200 z-40 sticky top-0"
      >
        <Container className="flex items-center justify-between h-14 md:h-16 lg:h-[72px]">
          {/* Left section: Logo & App Switcher Pill */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 rounded-r-md px-1 py-0.5"
            >
              <span className="w-8 h-8 rounded-r-md bg-brand text-white flex items-center justify-center font-heading font-bold text-lg shadow-sm">
                π
              </span>
              <span className="font-heading font-bold text-lg sm:text-xl text-ink tracking-tight">
                {siteConfig.siteName}
              </span>
            </Link>

            {/* Desktop/Tablet Product Switcher Pill */}
            {activeProduct && (
              <div className="relative hidden sm:block" ref={appDropdownRef}>
                <button
                  onClick={() => setIsAppMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-r-pill border border-border bg-surface hover:bg-surface-tint text-xs font-semibold text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
                  aria-expanded={isAppMenuOpen}
                  aria-haspopup="listbox"
                >
                  <span
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 select-none"
                    style={{ backgroundColor: activeProduct.accent }}
                  >
                    {activeProduct.initial}
                  </span>
                  <span>{activeProduct.name}</span>
                  <ChevronDown aria-hidden="true" className="w-3.5 h-3.5 text-ink-muted" />
                </button>

                {isAppMenuOpen && (
                  <div
                    role="listbox"
                    aria-label="Available products"
                    className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-r-lg shadow-overlay py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    {products.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/${product.slug}`}
                        onClick={() => setIsAppMenuOpen(false)}
                        role="option"
                        aria-selected={activeProduct.slug === product.slug}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                          activeProduct.slug === product.slug
                            ? "bg-surface-tint text-brand font-semibold"
                            : "text-ink hover:bg-surface-tint/60"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ backgroundColor: product.accent }}
                        >
                          {product.initial}
                        </span>
                        <span>{product.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center/Right section: Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2"
            aria-label="Main Navigation"
          >
            {siteConfig.navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`touch-target px-3.5 py-1.5 rounded-r-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand bg-surface-tint font-semibold"
                      : "text-ink hover:text-brand hover:bg-surface-tint/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right section: Actions (Desktop CTA + Search + Mobile menu trigger) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon Trigger for Mobile and Tablet */}
            <Link
              href="/search"
              className="touch-target lg:hidden rounded-r-md text-ink hover:text-brand hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              aria-label={t("search")}
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Desktop "Open ConnectPi" External Button */}
            <div className="hidden md:block">
              <Button
                href={siteConfig.externalAppUrl}
                isExternal
                variant="secondary"
                size="small"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                {siteConfig.externalAppLabel}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsDrawerOpen(true)}
              className="touch-target lg:hidden rounded-r-md text-ink hover:text-brand hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={t("openMenu")}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer (Dialog) */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
