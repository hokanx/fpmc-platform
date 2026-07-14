/* Vercel serverless function — step 2 of the double opt-in.
 *
 * POST { token } (sent by the /confirm SPA page after a human click — deliberately
 * NOT a GET link target: mail scanners prefetch GET links and would auto-confirm).
 *
 * On a valid token:
 *   1. Supabase (if configured): set confirmed_at on the lead (idempotent);
 *      upsert the row if the signup predated the Supabase link-up.
 *   2. Brevo: NOW add the contact to the marketing list (BREVO_LIST_ID) with
 *      LOCALE / SOURCE / CONSENT_AT / CONFIRMED_AT attributes. Nobody enters
 *      the list unconfirmed.
 *
 * Responses: 200 {status:"ok"} · 400 {status:"invalid"} · 410 {status:"expired"}
 *            405 · 502 {status:"error"} · 503 {status:"not_configured"}
 */
import { verifyToken } from "./_lib/token";

type Req = {
  method?: string;
  body?: unknown;
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (k: string, v: string) => void;
};

async function confirmInSupabase(email: string, locale: string, consentIso: string, confirmedIso: string): Promise<boolean | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // not configured — Brevo-only mode
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  try {
    // Idempotent: only fills confirmed_at while it is still null.
    const patch = await fetch(
      `${url}/rest/v1/leads?email=eq.${encodeURIComponent(email)}&confirmed_at=is.null`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ confirmed_at: confirmedIso, locale }),
      },
    );
    if (!patch.ok) return false;
    const rows = (await patch.json()) as unknown[];
    if (rows.length > 0) return true;

    // No row updated: either already confirmed (fine) or the row is missing
    // (signup predated the Supabase link-up) — upsert to cover the latter.
    const upsert = await fetch(`${url}/rest/v1/leads?on_conflict=email`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify([{ email, locale, consent_at: consentIso, confirmed_at: confirmedIso }]),
    });
    return upsert.ok;
  } catch {
    return false;
  }
}

async function addToBrevoList(email: string, locale: string, consentIso: string, confirmedIso: string): Promise<boolean> {
  const key = process.env.BREVO_API_KEY as string;
  const listId = Number(process.env.BREVO_LIST_ID || "0");
  try {
    const r = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        updateEnabled: true, // re-confirms update instead of failing
        ...(listId > 0 ? { listIds: [listId] } : {}),
        attributes: {
          LOCALE: locale,
          SOURCE: "fpmc.house countdown",
          CONSENT_AT: consentIso,
          CONFIRMED_AT: confirmedIso,
        },
      }),
    });
    // 201 created · 204 updated — both are success.
    return r.status === 201 || r.status === 204 || r.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  let token = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    token = String((body as Record<string, unknown>).token ?? "");
  } catch {
    res.status(400).json({ status: "invalid" });
    return;
  }

  const secret = process.env.LEADS_TOKEN_SECRET;
  if (!secret || !process.env.BREVO_API_KEY) {
    res.status(503).json({ status: "not_configured" });
    return;
  }

  const verdict = verifyToken(token, secret);
  if (verdict.status !== "ok") {
    res.status(verdict.status === "expired" ? 410 : 400).json({ status: verdict.status });
    return;
  }

  const { e: email, l: locale, iat } = verdict.data;
  const consentIso = new Date(iat * 1000).toISOString();
  const confirmedIso = new Date().toISOString();

  const [listed, db] = await Promise.all([
    addToBrevoList(email, locale, consentIso, confirmedIso),
    confirmInSupabase(email, locale, consentIso, confirmedIso),
  ]);

  if (!listed) {
    res.status(502).json({ status: "error" });
    return;
  }
  res.status(200).json({ status: "ok", channels: { brevo: listed, db } });
}
