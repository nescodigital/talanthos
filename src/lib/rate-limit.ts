/**
 * Simple in-memory rate limiter for Next.js API routes.
 * NOTE: On serverless platforms (Vercel), each function instance
 * has its own memory, so this is not perfectly distributed.
 * For production-scale apps, migrate to Redis (Vercel KV, Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute per IP

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function rateLimit(
  req: Request,
  options?: { max?: number; windowMs?: number; keyPrefix?: string }
): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const ip = getClientIp(req);
  const keyPrefix = options?.keyPrefix ?? "";
  const key = `${keyPrefix}:${ip}`;
  const max = options?.max ?? MAX_REQUESTS;
  const windowMs = options?.windowMs ?? WINDOW_MS;

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    // New window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, limit: max, remaining: max - 1, resetAt };
  }

  // Same window
  if (existing.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: max,
    remaining: max - existing.count,
    resetAt: existing.resetAt,
  };
}

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt + WINDOW_MS) {
      store.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[RATE LIMIT] Cleaned ${cleaned} expired entries`);
  }
}, 300_000);
