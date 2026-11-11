import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Container } from "./Container";
import siteConfig from "@/content/site.json";
import products from "@/content/products.json";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      role="contentinfo"
      className="bg-ink text-footer-text mt-auto border-t border-ink-body/20 safe-padding-bottom"
    >
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (Desktop: spans 2 cols, Tablet: 1 col, Mobile: 1 col) */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white font-heading font-bold text-xl tracking-tight mb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-md group"
            >
              <Image
                src="/images/logo-icon.png"
                alt="ConnectPi Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-contain transition-transform group-hover:scale-105"
              />
              <span>{siteConfig.siteName}</span>
            </Link>
            <p className="text-sm text-footer-text/80 leading-relaxed max-w-sm">
              {siteConfig.footer.brandDescription}
            </p>
          </div>

          {/* Apps Column */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              {t("products")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/${product.slug}`}
                    className="hover:text-white transition-colors py-0.5 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links Column */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              {t("help")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {siteConfig.footer.links.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors py-0.5 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              {t("legal")}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {siteConfig.footer.links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors py-0.5 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Contact */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-footer-text/70">
          <p>{siteConfig.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="hover:text-white transition-colors underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
            >
              {siteConfig.supportEmail}
            </a>
            <span>•</span>
            <a
              href={siteConfig.externalAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus rounded-r-sm"
            >
              {siteConfig.externalAppLabel}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
