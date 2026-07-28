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
