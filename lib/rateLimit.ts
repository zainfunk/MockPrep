// Simple in-memory rate limiter keyed by arbitrary string (e.g. `run-code:${userId}`).
// Resets across cold starts, which is acceptable: the goal is to blunt sustained abuse,
// not to provide cryptographic guarantees. For persistent limits use Clerk metadata.

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  retryAfter: number;
  remaining: number;
}

export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const existing = (buckets.get(key) ?? []).filter((ts) => ts > cutoff);

  if (existing.length >= max) {
    const oldest = existing[0];
    return { ok: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000), remaining: 0 };
  }

  existing.push(now);
  buckets.set(key, existing);
  return { ok: true, retryAfter: 0, remaining: max - existing.length };
}

export function ensureBodyUnder(raw: string, maxBytes: number): boolean {
  return new Blob([raw]).size <= maxBytes;
}
