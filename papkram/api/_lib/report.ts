import type { ApiError } from "./schema";

/**
 * Error reporting with one absolute rule: **never the letter**.
 *
 * The thing that makes this app trustworthy is that a photographed Jobcenter
 * letter exists only for the life of one request. An observability integration
 * is the classic way that promise quietly dies — a stack trace with the request
 * body attached, a breadcrumb carrying base64, a "helpful" payload dump. So the
 * signature here only accepts a route name, an error code, a message and a small
 * bag of numbers. There is no parameter you could pass a letter through, which
 * is a stronger guarantee than remembering not to.
 *
 * Set ERROR_WEBHOOK_URL to forward to Slack, Sentry's store endpoint, or
 * anything else that takes a JSON POST. Unset, this is structured stderr, which
 * Vercel already collects.
 */

type Context = Record<string, string | number | boolean>;

export function report(
  route: string,
  code: ApiError["error"] | "provider_failed",
  message: string,
  context: Context = {},
): void {
  const entry = {
    at: new Date().toISOString(),
    app: "papkram",
    route,
    code,
    // The message comes from our own throw sites and provider status codes,
    // never from a response body — see mistral.ts, which logs the HTTP status
    // rather than the payload.
    message: message.slice(0, 500),
    ...context,
  };

  console.error(JSON.stringify(entry));

  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;

  // Fire and forget with a short timeout: reporting an error must never be the
  // reason a request fails or hangs.
  void fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(entry),
    signal: AbortSignal.timeout(2000),
  }).catch(() => {
    /* the console line above is the durable record */
  });
}

/**
 * Per-request token usage and a cost estimate, to stderr.
 *
 * "About a cent a letter" is a guess until you can see it. This makes every
 * request produce a real number in the Vercel logs, so the daily cap and the
 * spend limit in the Anthropic console can be set against measured cost rather
 * than a hunch — and so an unexpected jump (a twelve-page letter, a prompt that
 * grew) is visible rather than only showing up on the bill.
 *
 * Counts only. Same rule as report(): nothing from the letter.
 */
type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

/**
 * USD per million tokens, input/output.
 *
 * Deliberately a small hardcoded table rather than a lookup: it only feeds a
 * log line, and a wrong estimate is better than a failed request. If a number
 * here goes stale the token counts above it are still exact — and Sonnet 5's
 * introductory $2/$10 runs to 2026-08-31, after which it is $3/$15.
 */
const PRICES: Record<string, { in: number; out: number }> = {
  "claude-sonnet-5": { in: 3, out: 15 },
  "claude-opus-5": { in: 5, out: 25 },
  "claude-opus-4-8": { in: 5, out: 25 },
  "claude-haiku-4-5": { in: 1, out: 5 },
};

export function reportUsage(
  route: string,
  model: string,
  usage: Usage,
  context: Context = {},
): void {
  const cached = usage.cache_read_input_tokens ?? 0;
  const written = usage.cache_creation_input_tokens ?? 0;
  const price = PRICES[model];

  // Cache reads bill at ~0.1x and writes at ~1.25x of the input rate.
  const usd = price
    ? ((usage.input_tokens + cached * 0.1 + written * 1.25) * price.in +
        usage.output_tokens * price.out) /
      1_000_000
    : null;

  console.error(
    JSON.stringify({
      at: new Date().toISOString(),
      app: "papkram",
      kind: "usage",
      route,
      model,
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      cache_read_tokens: cached,
      cache_write_tokens: written,
      ...(usd !== null ? { est_usd: Number(usd.toFixed(5)) } : {}),
      ...context,
    }),
  );
}
