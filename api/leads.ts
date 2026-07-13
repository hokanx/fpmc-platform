/* Vercel serverless function — premiere notify list / email list capture.
 *
 * Primary channel: Brevo (brevo.com) — the marketing email platform.
 *   Every signup becomes a contact (attributes: LOCALE, SOURCE, CONSENT_AT)
 *   in the configured list. Campaigns/newsletters are then sent from the
 *   Brevo UI; double-opt-in can be switched on there later.
 * Optional mirror: Supabase `public.leads` (service-role key, RLS deny-all).
 *
 * The request succeeds if AT LEAST ONE configured channel accepted the lead.
 * With NOTHING configured it returns 503 not_configured so the failure is
 * visible instead of silently swallowing signups.
 *
 * Vercel env vars (Project Settings → Environment Variables):
 *   BREVO_API_KEY              xkeysib-…  (Brevo → Settings → SMTP & API → API keys)
 *   BREVO_LIST_ID              numeric id of the list, e.g. 2 ("Radi Launch")
 *   SUPABASE_URL               optional, e.g. https://xyzcompany.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  optional, the service_role secret (server-only!)
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

async function saveToBrevo(email: string, locale: string): Promise<boolean | null> {
  const key = process.env.BREVO_API_KEY;
  if (!key) return null; // not configured
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
        updateEnabled: true, // resubmits update instead of failing
        ...(listId > 0 ? { listIds: [listId] } : {}),
        attributes: {
          LOCALE: locale,
          SOURCE: "fpmc.house countdown",
          CONSENT_AT: new Date().toISOString(),
        },
      }),
    });
    // 201 created · 204 updated — both are success.
    return r.status === 201 || r.status === 204 || r.ok;
  } catch {
    return false;
  }
}

async function saveToSupabase(email: string, locale: string): Promise<boolean | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // not configured
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

  const [brevo, db] = await Promise.all([saveToBrevo(email, locale), saveToSupabase(email, locale)]);

  if (brevo === null && db === null) {
    // No channel configured at all — surface it loudly.
    res.status(503).json({ error: "not_configured" });
    return;
  }
  if (brevo !== true && db !== true) {
    res.status(502).json({ error: "delivery_failed" });
    return;
  }
  res.status(200).json({ ok: true, channels: { brevo, db } });
}
