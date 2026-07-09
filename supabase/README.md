# supabase/

Code-side database for FPMC — tracked in git so the schema evolves under version
control (one committed SQL file per change).

```
supabase/
└── migrations/
    └── 20260709120000_create_leads_table.sql   # 0001 — email-capture leads table
```

## Status (Website V0)

Schema only. No live Supabase project is linked yet, and **nothing writes to
`leads` today** — email capture is Block 3 (tomorrow). This migration exists so
that flow has a versioned target already in the repo.

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
