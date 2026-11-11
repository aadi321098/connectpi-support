import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import fs from "fs";
import path from "path";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

let redirectsList: { source: string; destination: string; permanent: boolean }[] = [];
try {
  const redirectsPath = path.join(process.cwd(), "redirects.json");
  if (fs.existsSync(redirectsPath)) {
    redirectsList = JSON.parse(fs.readFileSync(redirectsPath, "utf-8"));
  }
} catch {
  redirectsList = [];
}

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return redirectsList;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
