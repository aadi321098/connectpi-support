import { env } from "@/lib/env";

export const features = {
  enableHindi: false,
  enableDarkMode: false,
  enableAnalytics: Boolean(env.NEXT_PUBLIC_ANALYTICS_ID),
  enableTurnstile: Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY),
  enableSentry: Boolean(env.SENTRY_DSN),
} as const;
