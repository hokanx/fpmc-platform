import { report } from "./report";

/**
 * Two independent limits:
 *
 *   1. Per-IP, per hour — stops one person burning the budget by accident or
 *      boredom. Papkram has no accounts by design, so IP is the only handle.
 *   2. A global daily cap — the spend guard. Without it, a scripted abuser or a
 *      runaway client turns an API key into an unbounded bill overnight.
 *
 * Backed by Upstash Redis when configured, which is what makes the per-IP limit
 * actually mean something: serverless instances don't share memory, so the
 * in-memory fallback's real ceiling is `limit × warm instances` and it resets on
 * every cold start. That's a speed bump, not a control. Set
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN before taking real traffic.
 *
 * If Upstash is configured but unreachable, requests are allowed through on the
 * in-memory count rather than blocked — a monitoring outage should not take the
 * app down for people who need it.
 */

const HOUR_SECONDS = 60 * 60;

export type RateVerdict =
  | { ok: true }
  | { ok: false; reason: "rate_limited" | "daily_cap"; retryAfter: number };

function perHourLimit(): number {
  const raw = Number(process.env.RATE_LIMIT_PER_HOUR);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
}

/** 0 disables the cap. Defaults to a deliberately conservative number. */
function dailyCap(): number {
  const raw = Number(process.env.DAILY_REQUEST_CAP);
  return Number.isFinite(raw) && raw >= 0 ? raw : 2000;
}

// --- in-memory fallback -----------------------------------------------------

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function bumpLocal(key: string, cost: number, windowMs: number): { count: number; resetAt: number } {
  const now = Date.now();

  // Opportunistic sweep — the map would otherwise grow for the instance's lifetime.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs };
  bucket.count += cost;
  buckets.set(key, bucket);
  return bucket;
}

// --- Upstash ----------------------------------------------------------------

function upstash(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

/**
 * INCRBY + EXPIRE NX in one round trip. `NX` means the TTL is only set the first
 * time a key appears, so a busy key expires an hour after its first request
 * rather than sliding forever.
 */
async function bumpRemote(key: string, cost: number, ttl: number): Promise<number | null> {
  const config = upstash();
  if (!config) return null;

  try {
    const res = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify([
        ["INCRBY", key, String(cost)],
        ["EXPIRE", key, String(ttl), "NX"],
      ]),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);

    const body = (await res.json()) as { result?: number; error?: string }[];
    const count = body?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch (err) {
    // Fail open: a limiter outage must not deny service.
    report("ratelimit", "provider_failed", `upstash unavailable: ${(err as Error).message}`);
    return null;
  }
}

// --- public -----------------------------------------------------------------

const today = () => new Date().toISOString().slice(0, 10);

/** Seconds until the next UTC midnight. */
function secondsUntilTomorrow(): number {
  const now = new Date();
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(1, Math.ceil((midnight - now.getTime()) / 1000));
}

/**
 * @param cost how much this request draws — one per page, since a ten-page
 *             letter costs roughly ten times as much to read as a one-pager.
 */
export async function checkRate(key: string, cost = 1): Promise<RateVerdict> {
  const cap = dailyCap();
  if (cap > 0) {
    const dayKey = `papkram:day:${today()}`;
    const ttl = secondsUntilTomorrow();
    const remote = await bumpRemote(dayKey, cost, ttl);
    const count = remote ?? bumpLocal(dayKey, cost, ttl * 1000).count;
    if (count > cap) {
      report("ratelimit", "daily_cap", `daily cap ${cap} reached`);
      return { ok: false, reason: "daily_cap", retryAfter: ttl };
    }
  }

  const ipKey = `papkram:ip:${key}`;
  const remote = await bumpRemote(ipKey, cost, HOUR_SECONDS);
  if (remote !== null) {
    return remote > perHourLimit()
      ? { ok: false, reason: "rate_limited", retryAfter: HOUR_SECONDS }
      : { ok: true };
  }

  const local = bumpLocal(ipKey, cost, HOUR_SECONDS * 1000);
  if (local.count > perHourLimit()) {
    return {
      ok: false,
      reason: "rate_limited",
      retryAfter: Math.ceil((local.resetAt - Date.now()) / 1000),
    };
  }
  return { ok: true };
}
