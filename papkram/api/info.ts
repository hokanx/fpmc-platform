import { send, type Req, type Res } from "./_lib/http";
import { providerId } from "./_lib/provider";

/**
 * GET /api/info — public configuration the UI needs to tell the truth.
 *
 * Two things live here, both for the same reason: they describe how this
 * deployment is actually configured, and hard-coding them in the bundle would
 * let the pages drift from reality.
 *
 *   - `provider` — which AI service processes letters. /datenschutz names it.
 *   - `impressum` — the operator's legal details, required by § 5 DDG.
 *
 * Serving the Impressum from server env rather than build-time `VITE_` vars
 * means filling it in is a Vercel settings change, not a code change and a
 * redeploy. No secrets here — every field is legally required to be public.
 */

const IMPRESSUM_FIELDS = [
  "name",
  "strasse",
  "ort",
  "land",
  "email",
  "vertreten",
  "ustid",
] as const;

function impressum(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of IMPRESSUM_FIELDS) {
    const value = process.env[`IMPRESSUM_${field.toUpperCase()}`]?.trim();
    if (value) out[field] = value;
  }
  // Sensible default — the operator is German unless told otherwise.
  if (out.name && !out.land) out.land = "Deutschland";
  return out;
}

export default function handler(req: Req, res: Res): void {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    send(res, 405, { error: "method_not_allowed" });
    return;
  }
  send(res, 200, { provider: providerId(), impressum: impressum() });
}
