// Simple in-memory fixed-window rate limiter.
// Suitable for a single server instance; for multi-instance deployments
// back this with Redis instead of a process-local Map.
const hits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  { max = 5, windowMs = 60_000 }: { max?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const record = hits.get(key);

  if (!record || now > record.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, max - 1),
      resetAt: now + windowMs,
    };
  }

  record.count += 1;
  return {
    allowed: record.count <= max,
    remaining: Math.max(0, max - record.count),
    resetAt: record.resetAt,
  };
}
