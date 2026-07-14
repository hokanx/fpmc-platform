/* Vercel serverless function — email capture, step 1 of the double opt-in.
 *
 * Flow (GDPR double opt-in):
 *   POST /api/leads  → validate + consent required
 *                    → mirror to Supabase `leads` (consent_at=now, confirmed_at stays null)
 *                    → send confirmation email via Brevo TRANSACTIONAL API from the
 *                      branded sender (hello@fpmc.house — never a sandbox sender)
 *   The mail links to /confirm?token=… (SPA page); confirming POSTs to /api/confirm,
 *   which sets confirmed_at and only THEN adds the contact to the Brevo marketing list.
 *   Nobody enters the list unconfirmed.
 *
 * Token: stateless HMAC (api/_lib/token.ts) — no extra table, works Brevo-only.
 *
 * Vercel env vars:
 *   BREVO_API_KEY              xkeysib-…  (required)
 *   LEADS_TOKEN_SECRET         HMAC secret, e.g. `openssl rand -hex 32` (required)
 *   BREVO_LIST_ID              marketing list id — used by /api/confirm
 *   SITE_URL                   default https://fpmc.house
 *   LEADS_FROM_EMAIL           default hello@fpmc.house (must be Brevo-verified)
 *   SUPABASE_URL               optional mirror
 *   SUPABASE_SERVICE_ROLE_KEY  optional mirror (server-only!)
 */
import { signToken } from "./_lib/token";
import { emailFor } from "./_lib/email";

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

async function saveToSupabase(email: string, locale: string): Promise<boolean | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // not configured
  try {
    // Upsert on the unique email; consent_at = now. confirmed_at is set by /api/confirm.
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

async function sendConfirmEmail(email: string, locale: string, confirmUrl: string): Promise<boolean> {
  const key = process.env.BREVO_API_KEY as string;
  const from = process.env.LEADS_FROM_EMAIL || "hello@fpmc.house";
  const { subject, html, text } = emailFor(locale, confirmUrl);
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "FPMC", email: from },
        to: [{ email }],
        subject,
        htmlContent: html,
        textContent: text,
        tags: ["doi"],
      }),
    });
    return r.status === 201 || r.ok;
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
  let consent = false;
  let honeypot = "";
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    const b = body as Record<string, unknown>;
    email = String(b.email ?? "")
      .trim()
      .toLowerCase();
    const loc = String(b.locale ?? "de");
    if (["de", "en", "ar"].includes(loc)) locale = loc;
    consent = b.consent === true;
    honeypot = String(b.website ?? "");
  } catch {
    res.status(400).json({ error: "bad_json" });
    return;
  }

  // Honeypot filled = bot. Pretend success, send nothing.
  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }
  if (!EMAIL_RE.test(email) || email.length > 320) {
    res.status(400).json({ error: "bad_email" });
    return;
  }
  if (!consent) {
    res.status(400).json({ error: "consent_required" });
    return;
  }

  const secret = process.env.LEADS_TOKEN_SECRET;
  if (!secret || !process.env.BREVO_API_KEY) {
    // Double opt-in cannot work — surface it loudly instead of swallowing signups.
    res.status(503).json({ error: "not_configured" });
    return;
  }

  const siteUrl = (process.env.SITE_URL || "https://fpmc.house").replace(/\/$/, "");
  const confirmUrl = `${siteUrl}/confirm?token=${encodeURIComponent(signToken(email, locale, secret))}`;

  const [sent, db] = await Promise.all([
    sendConfirmEmail(email, locale, confirmUrl),
    saveToSupabase(email, locale),
  ]);

  if (!sent) {
    // The confirmation mail is the flow — a failed Supabase mirror alone is not fatal.
    res.status(502).json({ error: "delivery_failed" });
    return;
  }
  res.status(200).json({ ok: true, channels: { email: sent, db } });
}
