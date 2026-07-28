import { clientIp, fail, PayloadTooLarge, readJson, send, type Req, type Res } from "./_lib/http";
import { checkRate } from "./_lib/ratelimit";
import { getProvider, ProviderError } from "./_lib/provider";
import {
  LEVELS,
  OUT_LANGS,
  parseLetter,
  type Level,
  type LetterResult,
  type OutLang,
} from "./_lib/schema";

/**
 * POST /api/uebersetzen — translate an already-simplified letter.
 *
 * Text only, no image: the expensive vision pass already happened. This runs on
 * demand when the reader picks a language, so someone who only ever reads German
 * never pays for the other five.
 */

const BODY_LIMIT = 128 * 1024;

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

  const target = b.target as OutLang;
  if (!OUT_LANGS.includes(target) || target === "de") return fail(res, 400, "bad_request");

  const level: Level = LEVELS.includes(b.level as Level) ? (b.level as Level) : "einfach";

  const letter = parseLetter(b.letter);
  if (!letter) return fail(res, 400, "bad_request");

  const rate = checkRate(clientIp(req));
  if (!rate.ok) {
    res.setHeader("Retry-After", String(rate.retryAfter));
    return fail(res, 429, "rate_limited", { retry_after: rate.retryAfter });
  }

  try {
    const provider = await getProvider();
    const translated = await provider.translate({ letter, target, level });
    const result: LetterResult = { ...translated, sprache: target };
    return send(res, 200, result);
  } catch (err) {
    if (err instanceof ProviderError) {
      const status = err.code === "not_configured" ? 503 : err.code === "refused" ? 422 : 502;
      console.error(`[uebersetzen] ${err.code}: ${err.message}`);
      return fail(res, status, err.code);
    }
    console.error(`[uebersetzen] unexpected: ${(err as Error).message}`);
    return fail(res, 502, "provider_failed");
  }
}
