import { clientIp, fail, PayloadTooLarge, readJson, send, type Req, type Res } from "./_lib/http";
import { checkRate } from "./_lib/ratelimit";
import { report } from "./_lib/report";
import { getProvider, ProviderError } from "./_lib/provider";
import {
  LEVELS,
  MAX_MEDIA_BYTES,
  MAX_PAGES,
  MAX_TOTAL_BYTES,
  SUPPORTED_MEDIA,
  type Level,
  type LetterResult,
  type Media,
} from "./_lib/schema";

/**
 * POST /api/vereinfachen — photos or a PDF in, plain German out.
 *
 * Nothing here writes to disk, a database or a log. The images exist only as
 * locals in this invocation and are gone when the function returns. That is the
 * whole privacy promise, and it is enforced by there being no storage code to
 * audit.
 */

// Base64 inflates by ~4/3; the JSON envelope adds a little more. This stays
// under Vercel's 4.5 MB request-body limit, which is the real constraint on how
// many pages fit — see MAX_TOTAL_BYTES.
const BODY_LIMIT = Math.ceil(MAX_TOTAL_BYTES * 1.4) + 8192;

type MediaProblem = "bad_request" | "too_large" | "unsupported_media";

function readMedia(value: unknown): Media | { error: MediaProblem } {
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
  if (decodedBytes(data) > MAX_MEDIA_BYTES) return { error: "too_large" };

  return { media_type: m.media_type, data };
}

const decodedBytes = (base64: string) => Math.floor((base64.length * 3) / 4);

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

  if (!Array.isArray(b.pages) || b.pages.length === 0) return fail(res, 400, "bad_request");
  if (b.pages.length > MAX_PAGES) return fail(res, 400, "too_many_pages");

  const pages: Media[] = [];
  let total = 0;
  for (const raw of b.pages) {
    const page = readMedia(raw);
    if ("error" in page) {
      return fail(res, page.error === "too_large" ? 413 : 400, page.error);
    }
    total += decodedBytes(page.data);
    if (total > MAX_TOTAL_BYTES) return fail(res, 413, "too_large");
    pages.push(page);
  }

  // A multi-page letter costs proportionally more to read, so it draws
  // proportionally more from the caller's bucket.
  const rate = await checkRate(clientIp(req), pages.length);
  if (!rate.ok) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    return fail(res, rate.reason === "daily_cap" ? 503 : 429, rate.reason, {
      retry_after: rate.retryAfter,
    });
  }

  try {
    const provider = await getProvider();
    const letter = await provider.simplify({ pages, level });
    const result: LetterResult = { ...letter, sprache: "de" };
    return send(res, 200, result);
  } catch (err) {
    if (err instanceof ProviderError) {
      const status = err.code === "not_configured" ? 503 : err.code === "refused" ? 422 : 502;
      report("vereinfachen", err.code, err.message, { pages: pages.length, level });
      return fail(res, status, err.code);
    }
    report("vereinfachen", "provider_failed", (err as Error).message, { pages: pages.length });
    return fail(res, 502, "provider_failed");
  }
}
