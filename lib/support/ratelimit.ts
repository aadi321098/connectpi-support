interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding rate limit store
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

/**
 * Checks and increments the rate limit for a given key (e.g. IP or email)
 * Default limit: 5 requests per hour (3600 seconds)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Upstash Redis integration if credentials provided
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const key = `ratelimit:${identifier}`;
      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds, "NX"],
          ["TTL", key],
        ]),
      });

      if (response.ok) {
        const results = await response.json();
        const currentCount = results[0]?.result || 1;
        const ttl = results[2]?.result || windowSeconds;
        const remaining = Math.max(0, limit - currentCount);

        return {
          success: currentCount <= limit,
          limit,
          remaining,
          reset: Math.floor((now + ttl * 1000) / 1000),
        };
      }
    } catch (err) {
      console.warn("Upstash rate limit fallback to memory store:", err);
    }
  }

  // Memory store fallback
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    memoryStore.set(identifier, newRecord);

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.floor((now + windowMs) / 1000),
    };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);

  return {
    success: record.count <= limit,
    limit,
    remaining,
    reset: Math.floor(record.resetAt / 1000),
  };
}
