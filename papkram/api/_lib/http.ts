import type { IncomingMessage, ServerResponse } from "node:http";
import type { ApiError } from "./schema";

/**
 * Vercel's Node runtime hands the handler an IncomingMessage with `body`
 * already parsed; the Vite dev middleware hands a raw stream. Everything here
 * works with both, so the functions behave identically in dev and production.
 */
export type Req = IncomingMessage & { body?: unknown };
export type Res = ServerResponse;

export function send(res: Res, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  // Letters must never sit in a proxy or browser cache.
  res.setHeader("cache-control", "no-store");
  res.end(payload);
}

export function fail(res: Res, status: number, error: ApiError["error"], extra?: Partial<ApiError>) {
  send(res, status, { error, ...extra });
}

/** Rejects bodies over `limit` while reading, so an oversized upload never lands in memory. */
export async function readJson(req: Req, limit: number): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks: Buffer[] = [];
  let size = 0;

  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        reject(new PayloadTooLarge());
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve());
    req.on("error", reject);
  });

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export class PayloadTooLarge extends Error {
  constructor() {
    super("payload too large");
    this.name = "PayloadTooLarge";
  }
}

/**
 * Best-effort client identity for rate limiting. Behind Vercel's proxy the
 * left-most x-forwarded-for entry is the real client; it is spoofable, which is
 * why the limiter is a speed bump rather than a security control.
 */
export function clientIp(req: Req): string {
  const fwd = req.headers["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return raw?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
}
