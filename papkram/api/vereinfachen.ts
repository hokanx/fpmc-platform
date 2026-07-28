import { clientIp, fail, PayloadTooLarge, readJson, send, type Req, type Res } from "./_lib/http";
import { checkRate } from "./_lib/ratelimit";
import { getProvider, ProviderError } from "./_lib/provider";
import {
  LEVELS,
  MAX_MEDIA_BYTES,
  SUPPORTED_MEDIA,
  type Level,
  type LetterResult,
  type Media,
} from "./_lib/schema";

/**
 * POST /api/vereinfachen — photo or PDF in, plain German out.
 *
 * Nothing here writes to disk, a database or a log. The image exists only as a
 * local in this invocation and is gone when the function returns. That is the
 * whole privacy promise, and it is enforced by there being no storage code to
 * audit.
 */

// Base64 inflates by ~4/3; the JSON envelope adds a little more.
const BODY_LIMIT = Math.ceil(MAX_MEDIA_BYTES * 1.4) + 4096;

function readMedia(value: unknown): Media | { error: "bad_request" | "too_large" | "unsupported_media" } {
  if (typeof value !== "object" || value === null) return { error: "bad_request" };
  const m = value as Record<string, unknown>;

  if (typeof m.media_type !== "string" || typeof m.data !== "string") {
    return { error: "bad_request" };
  }
  if (!(SUPPORTED_MEDIA as readonly string[]).includes(m.media_type)) {
    return { error: "unsupported_media" };
  }

  // Tolerate a data: URL prefix, and strip whitespace — the API rejects
  // base64 containing newlines.
  const data = m.data.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "");
  if (!data || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return { error: "bad_request" };
  if (Math.floor((data.length * 3) / 4) > MAX_MEDIA_BYTES) return { error: "too_large" };

  return { media_type: m.media_type, data };
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "method_not_allowed");
  }

  let body: unknown;
  try {
    body = await readJson(req, BODY_LIMIT);
  } catch (err) {
    if (err instanceof PayloadTooLarge) return fail(res, 413, "too_large");
    return fail(res, 400, "bad_json");
  }

  const b = (body ?? {}) as Record<string, unknown>;

  const level: Level = LEVELS.includes(b.level as Level) ? (b.level as Level) : "einfach";
  const media = readMedia(b.media);
  if ("error" in media) {
    return fail(res, media.error === "too_large" ? 413 : 400, media.error);
  }

  const rate = checkRate(clientIp(req));
  if (!rate.ok) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    return fail(res, 429, "rate_limited", { retry_after: rate.retryAfter });
  }

  try {
    const provider = await getProvider();
    const letter = await provider.simplify({ media, level });
    const result: LetterResult = { ...letter, sprache: "de" };
    return send(res, 200, result);
  } catch (err) {
    if (err instanceof ProviderError) {
      const status = err.code === "not_configured" ? 503 : err.code === "refused" ? 422 : 502;
      // Message only — never the request body, which is the letter.
      console.error(`[vereinfachen] ${err.code}: ${err.message}`);
      return fail(res, status, err.code);
    }
    console.error(`[vereinfachen] unexpected: ${(err as Error).message}`);
    return fail(res, 502, "provider_failed");
  }
}
