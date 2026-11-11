/**
 * Privacy-friendly, cookieless analytics helper for ConnectPi Support.
 * Compatible with Plausible, Umami, and Vercel Analytics.
 * Never stores PII, cookies, or cross-site tracking IDs.
 */

import { features } from "@/lib/features";

export type AnalyticsEvent =
  | "search_submit"
  | "search_no_results"
  | "article_view"
  | "feedback_yes"
  | "feedback_no"
  | "contact_start"
  | "contact_submit_success"
  | "contact_submit_error"
  | "outbound_click_connectpi";

export interface AnalyticsPayload {
  product?: string;
  category?: string;
  query?: string;
  resultsCount?: number;
  path?: string;
  inquiryType?: string;
  errorType?: string;
  url?: string;
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    va?: (event: string, properties?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: AnalyticsEvent, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!features.enableAnalytics) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug(`[Analytics Mock] Event: "${name}"`, payload);
    }
    return;
  }

  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: payload });
    } else if (typeof window.va === "function") {
      window.va(name, payload);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[Analytics] Dispatch failed:", error);
    }
  }
}
