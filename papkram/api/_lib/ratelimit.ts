/**
 * Per-IP token bucket held in module scope.
 *
 * Deliberately modest: serverless instances don't share memory, so the real
 * ceiling is `limit × number of warm instances`, and the whole thing resets on a
 * cold start. It stops one person from burning the API budget by accident or
 * boredom. It does not stop a distributed attacker — that needs Upstash Redis
 * or similar, and is a follow-up if the traffic ever justifies it.
 *
 * Papkram has no accounts by design, so IP is the only handle available.
 */

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, Bucket>();

function limitPerHour(): number {
  const raw = Number(process.env.RATE_LIMIT_PER_HOUR);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
}

export type RateVerdict = { ok: true } | { ok: false; retryAfter: number };

export function checkRate(key: string, cost = 1): RateVerdict {
  const now = Date.now();

  // Opportunistic sweep — the map would otherwise grow for the instance's lifetime.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + WINDOW_MS };

  if (bucket.count + cost > limitPerHour()) {
    buckets.set(key, bucket);
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += cost;
  buckets.set(key, bucket);
  return { ok: true };
}
