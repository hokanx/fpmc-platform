/* Vercel serverless function — premiere notify list.
 *
 * Two delivery channels, independent of each other:
 *   1. Supabase `public.leads` (service-role key, RLS deny-all by design) —
 *      the structured list for the double-opt-in / segment "Radi Launch".
 *      Only used when the env vars are configured.
 *   2. Email forwarding to hello@fpmc.house via FormSubmit (no account, no
 *      key) — every signup lands in the inbox even when Supabase is not
 *      configured. NOTE: the FIRST submission triggers a one-time activation
 *      email to hello@fpmc.house — click it once, then forwarding is live.
 *
 * The request succeeds if AT LEAST ONE channel accepted the lead, so the
 * countdown form never silently swallows signups again.
 *
 * Optional Vercel env vars (Project Settings → Environment Variables):
 *   SUPABASE_URL               e.g. https://xyzcompany.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  the service_role secret (server-only!)
 */

type Req = {
  method?: string;
  body?: unknown;
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (k: string, v: string) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORWARD_TO = "hello@fpmc.house";

async function saveToSupabase(email: string, locale: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    // Upsert on the unique email; consent_at = now (single opt-in capture;
    // the double-opt-in confirmation flow sets confirmed_at later).
    const r = await fetch(`${url}/rest/v1/leads?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify([{ email, locale, consent_at: new Date().toISOString() }]),
    });
    return r.ok;
  } catch {
    return false;
  }
}

async function forwardByEmail(email: string, locale: string): Promise<boolean> {
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${FORWARD_TO}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "FPMC Launch — neue Premiere-Anmeldung",
        _template: "table",
        _captcha: "false",
        lead_email: email,
        locale,
        source: "fpmc.house countdown",
        timestamp: new Date().toISOString(),
      }),
    });
    if (!r.ok) return false;
    const data = (await r.json().catch(() => null)) as { success?: string | boolean } | null;
    return data?.success === "true" || data?.success === true;
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

  let email = "";
  let locale = "de";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    email = String((body as Record<string, unknown>).email ?? "")
      .trim()
      .toLowerCase();
    const loc = String((body as Record<string, unknown>).locale ?? "de");
    if (["de", "en", "ar"].includes(loc)) locale = loc;
  } catch {
    res.status(400).json({ error: "bad_json" });
    return;
  }

  if (!EMAIL_RE.test(email) || email.length > 320) {
    res.status(400).json({ error: "bad_email" });
    return;
  }

  const [db, mail] = await Promise.all([saveToSupabase(email, locale), forwardByEmail(email, locale)]);

  if (!db && !mail) {
    res.status(502).json({ error: "delivery_failed" });
    return;
  }
  res.status(200).json({ ok: true, channels: { db, mail } });
}
