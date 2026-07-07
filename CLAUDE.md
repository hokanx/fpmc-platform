# FPMC Platform & Storefront

Cinematic public storefront + auth-gated platform for FPMC (Film Production Music Crew).
Built **from scratch** — simple and clean, without compromising quality or functionality.

## Read order (every session / every new contributor)
1. `CLAUDE.md` — project rules, locked decisions, v1 module set, phases.
2. `FPMC_Website-Blueprint.md` — the stakeholder spec (German): what and why.
3. `db/schema.sql` — the complete v1 data layer (DDL + RLS notes).
4. `BUILD-SESSION-KICKOFF.md` — how build sessions run, phase gates, P0 prompt.

## Ground rules (short version)
- **From scratch.** No code ported from earlier projects.
- **v1 scope is locked** (see CLAUDE.md): storefront · auth/roles · client portal with
  signature/PDF · member area · digital shop (entitlements) · partner (invite-only) ·
  crew workspace. Invoicing lives **outside** this platform (Köfman).
- **EU + DSGVO from P0:** EU Supabase, RLS everywhere, no secrets in the repo,
  self-hosted fonts, data minimization.
- **Languages:** DE (default) / EN / AR with full RTL — built in from P0.
- **Design:** achromatic cinematic UI. Navy `#1F3A5F` / Gold `#C8A24B` are
  **logo & print tokens only**, never UI colors.
- **Phases P0–P6**, one per working block; each ends committed → tagged → backed up
  (3-2-1, Datentresor SSD) before the next begins.

## Stack
React + Vite · Supabase (EU: Auth, Postgres + RLS, Storage, Edge Functions) ·
Stripe + Stripe Tax (digital products, idempotent webhook) · self-hosted OFL fonts.

## Structure (target)
```
fpmc-platform/
├── CLAUDE.md
├── README.md
├── BUILD-SESSION-KICKOFF.md
├── FPMC_Website-Blueprint.md
├── db/
│   └── schema.sql
├── src/                 (created in P0)
└── supabase/            (migrations + edge functions, from P1)
```

*Confidential — internal use only.*
