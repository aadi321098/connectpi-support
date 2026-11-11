import React from "react";
import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-r-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 font-medium"
    >
      {t("skipToContent")}
    </a>
  );
}
