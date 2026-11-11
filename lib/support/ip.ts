import { NextRequest } from "next/server";

/**
 * Extracts the real client IP address.
 * Prioritizes Cloudflare's 'cf-connecting-ip' header so Cloudflare proxy IPs
 * are never mistaken for the user's IP.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Cloudflare provides the end-user's real IP in 'cf-connecting-ip'
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim().length > 0) {
    return cfIp.trim();
  }

  // 2. Standard X-Forwarded-For header (first entry is the client IP)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  // 3. Fallbacks
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

