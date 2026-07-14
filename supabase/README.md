# supabase/

Code-side database for FPMC — tracked in git so the schema evolves under version
control (one committed SQL file per change).

```
supabase/
└── migrations/
    └── 20260709120000_create_leads_table.sql   # 0001 — email-capture leads table
```

## Status

Email capture is **wired** (double opt-in):

- `POST /api/leads` upserts the lead (`consent_at = now`, `confirmed_at` stays
  null) and sends the confirmation mail via Brevo transactional (branded sender).
- `POST /api/confirm` (called by the `/confirm` page after a human click)
  verifies the stateless HMAC token and sets `confirmed_at`; only then is the
  contact added to the Brevo marketing list.

No live Supabase project is linked yet — until `SUPABASE_URL` +
`SUPABASE_SERVICE_ROLE_KEY` are set in Vercel, the flow runs Brevo-only and the
`leads` mirror simply stays empty. Once linked + migrated, rows appear
automatically (writes are service-role only; RLS stays deny-all).

## Conventions

- One migration = one committed SQL file, named `<UTC-timestamp>_<description>.sql`
  (Supabase CLI order). Never edit a migration that has been applied — add a new one.
- **RLS on every table.** New tables enable RLS; money/access/consent writes are
  server-side only (Edge Function / service role), never from the browser.
- EU region, no secrets in the repo (`.env` only), data minimization.

## Applying (later, when the EU Supabase project exists)

```bash
# Option A — Supabase CLI (preferred once the project is linked):
supabase link --project-ref <ref>
supabase db push

# Option B — paste the SQL into the Supabase Studio SQL editor (EU project).
```
