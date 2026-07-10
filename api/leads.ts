/* Vercel serverless function — premiere notify list.
 * Writes to Supabase `public.leads` with the SERVICE ROLE key (RLS is deny-all
 * by design; the browser never talks to Supabase directly).
 *
 * Required Vercel env vars (Project Settings → Environment Variables):
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

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    res.status(500).json({ error: "not_configured" });
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

  // Upsert on the unique email; consent_at = now (single opt-in capture; the
  // double-opt-in confirmation flow sets confirmed_at later).
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

  if (!r.ok) {
    res.status(502).json({ error: "upstream", status: r.status });
    return;
  }
  res.status(200).json({ ok: true });
}
