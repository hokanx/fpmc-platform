/* Stateless double-opt-in token: base64url(payload).base64url(HMAC-SHA256).
 * No DB round-trip needed to verify; `iat` doubles as the consent timestamp.
 * Files under api/_lib are not exposed as Vercel endpoints (underscore prefix). */
import { createHmac, timingSafeEqual } from "node:crypto";

export type LeadToken = {
  /** email (lowercased) */
  e: string;
  /** locale: de | en | ar */
  l: string;
  /** issued-at, unix seconds — the moment of consent */
  iat: number;
};

const DEFAULT_MAX_AGE_SEC = 14 * 24 * 60 * 60; // 14 days

function mac(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

export function signToken(email: string, locale: string, secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ e: email, l: locale, iat: Math.floor(Date.now() / 1000) } satisfies LeadToken),
  ).toString("base64url");
  return `${payload}.${mac(payload, secret).toString("base64url")}`;
}

export type Verdict =
  | { status: "ok"; data: LeadToken }
  | { status: "invalid" }
  | { status: "expired" };

export function verifyToken(
  token: string,
  secret: string,
  maxAgeSec: number = DEFAULT_MAX_AGE_SEC,
): Verdict {
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { status: "invalid" };
  const payload = token.slice(0, dot);

  let given: Buffer;
  try {
    given = Buffer.from(token.slice(dot + 1), "base64url");
  } catch {
    return { status: "invalid" };
  }
  const expected = mac(payload, secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { status: "invalid" };
  }

  let data: LeadToken;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { status: "invalid" };
  }
  if (typeof data?.e !== "string" || typeof data?.l !== "string" || typeof data?.iat !== "number") {
    return { status: "invalid" };
  }
  if (Math.floor(Date.now() / 1000) - data.iat > maxAgeSec) return { status: "expired" };
  return { status: "ok", data };
}
