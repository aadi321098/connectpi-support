"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { ProductIcon } from "@/components/ui/ProductIcon";
import { X, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import siteConfig from "@/content/site.json";
import products from "@/content/products.json";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ isOpen, onClose, triggerRef }: MobileDrawerProps) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button initially
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const triggerElement = triggerRef.current;

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      // Restore focus to trigger element or previous element
      if (triggerElement) {
        triggerElement.focus();
      } else if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-[min(86vw,360px)] h-[100dvh] bg-surface shadow-overlay border-l border-border flex flex-col justify-between overflow-y-auto p-5 sm:p-6"
      >
        <div>
          {/* Header row: Brand & Close button */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-icon.png"
                alt="ConnectPi Logo"
                width={28}
                height={28}
                className="w-7 h-7 rounded-lg object-contain"
              />
              <span className="font-heading font-bold text-lg text-ink">
                {siteConfig.siteName}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="touch-target rounded-r-md text-ink-muted hover:text-ink hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus"
              aria-label={t("closeMenu")}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Product selector section (Multi-app aware) */}
          <div className="mt-5 pb-5 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t("selectApp")}
            </span>
            <div className="mt-3 flex flex-col gap-1.5">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-r-md hover:bg-surface-tint text-sm font-medium text-ink transition-colors"
                >
                  <span
                    className="w-7 h-7 rounded-r-md flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: product.accent }}
                  >
                    <ProductIcon slug={product.slug} size={15} />
                  </span>
                  <span>{product.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="mt-5" aria-label="Mobile Navigation">
            <ul className="flex flex-col gap-1">
              {siteConfig.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center min-h-[44px] px-3 py-2 rounded-r-md text-base font-medium transition-colors ${
                        isActive
                          ? "bg-surface-tint text-brand font-semibold"
                          : "text-ink hover:bg-surface-tint/60"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer CTA */}
        <div className="pt-6 border-t border-border mt-6">
          <Button
            href={siteConfig.externalAppUrl}
            isExternal
            variant="secondary"
            className="w-full justify-center"
            rightIcon={<ExternalLink className="w-4 h-4 ml-1.5" />}
          >
            {siteConfig.externalAppLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
