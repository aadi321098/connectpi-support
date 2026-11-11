import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://connectpi.in"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional().default(""),
  TURNSTILE_SECRET_KEY: z.string().optional().default(""),
  RESEND_API_KEY: z.string().optional().default(""),
  SUPPORT_TO_EMAIL: z.string().email().optional().default("support@connectpi.in"),
  SUPPORT_FROM_EMAIL: z.string().email().optional().default("noreply@connectpi.in"),
  UPSTASH_REDIS_REST_URL: z.string().optional().default(""),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().default(""),
  SENTRY_DSN: z.string().optional().default(""),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
