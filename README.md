# FPMC Website

Storefront + gated platform for **FPMC** (Film Production & Music Club). A cinematic public showcase
in front of an auth-gated app serving five audiences: customers, KMU clients, members/artists,
sales partners, and admin.

> **Confidential — internal use only.** This repo is built fresh, porting proven modules from the
> prior HOKAN project. It is **not** a fork.

---

## Website V0 (live storefront)

The public one-page site (`/`, `/connect`, `/links`, `/impressum`, `/datenschutz`) is built with
React + Vite + Tailwind v4 on the achromatic **Lichtspiel v2** design system, self-hosted fonts,
i18n DE/EN/AR (RTL). See **`docs/WEBSITE-V0-DEPLOY.md`** for dev + deploy/DNS steps and the QA gate.

```bash
npm install && npm run dev      # local dev
npm run build && npm run preview
```

Database schema is versioned under **`supabase/migrations/`** (first migration: `leads` table).

---

## Start here (read in this order)

1. **`README.md`** (this file) — orientation, ground rules, build order.
2. **`FPMC_Website-Engineering-Handoff.md`** — the build-facing spec: what to lift from HOKAN, by table/module, and what to fix on the way in.
3. **`FPMC_Commerce-Partner-Schema.md`** — full DDL + RLS for the net-new commerce, entitlement, and partner layer (no HOKAN precedent).
4. **`FPMC_Website-Blueprint.md`** (DE) — the stakeholder spec / source of truth for scope and intent.
5. **`HOKAN_HANDOFF.md`** — reference export of the source project. Use it to read the schemas and modules being ported.

If a design file is supplied, treat it as authoritative for **visuals**; the handoff is authoritative for **architecture and data model**. If they conflict, spec wins on structure, design wins on look.

---

## Build order (do not one-shot)

This is a multi-audience platform, not a landing page. Build phase by phase; each phase ends with a tested, committed, tagged state. Full task lists in handoff §10.

| Phase | Focus |
|---|---|
| **P0** | New EU Supabase project, repo init, FPMC brand tokens, branded email domain |
| **P1** | Port schema (access, roles, projects, files, contracts, invoices, payments, leads); add `customer` + `partner` roles; verify RLS |
| **P2** | Portal components + i18n/RTL + signature/PDF stack |
| **P3** | Storefront (showreel, portfolio, Higgsfield, public services) |
| **P4** | Commerce: products / orders / entitlements + Stripe + print-on-demand |
| **P5** | Partner dashboard + AI pipeline (wire **both** stages) |
| **P6** | QA, SEO, security hardening, full backup + release tag |

Stop and verify after each phase. Do not start the next phase until the current one is committed and tested.

---

## Ground rules

- **Lift, don't fork.** Port HOKAN's schema and proven modules into clean code. Leave behind: Lovable coupling (`gptengineer.js`, `lovable-tagger`, Lovable AI Gateway), legacy page sprawl, dual i18n/toast paths, the disabled `no-unused-vars` rule.
- **Fix the four security issues *during* the port, not after:** unauthenticated AI passthrough (`verify_jwt=true`, remove `type=custom`), sandbox email sender (use branded domain), missing idempotency on payment reminders + Stripe webhook, hardcoded admin address (make it config-driven).
- **EU data region** for everything. RLS on every table. Money-/access-affecting writes (`orders`, `entitlements`, commissions) are **server-side only** via edge functions.
- **Brand from the ground up:** Navy `#1F3A5F`, Gold `#C8A24B`, Cinzel + Pinyon Script display, Arial body / Consolas code, Higgsfield motion. Keep a single `brand.ts` source of truth; replace HOKAN's hardcoded white CTA + dark-mode `!important` overrides.
- **i18n:** `de` (default) / `en` / `ar` (full RTL) / `nl`. Flat keys, kept in sync across all four files. Port the Arabic PDF pipeline (Amiri + bidi) intact.
- **Data security:** 3-2-1 backups, versioning, restore tests, AVV with Stripe + POD provider, data minimization — per the FPMC Datensicherungs-Playbook.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite (SWC) |
| Backend | EU-hosted Supabase (Auth, Postgres, RLS, Storage) |
| Commerce | Stripe + Stripe Tax; own product/order/entitlement tables |
| Logistics | Print-on-demand (Printful or similar) behind Stripe |
| AI | Own provider (not the Lovable gateway) |
| Email | Branded transactional domain |

---

## Prerequisites before P1

- A new EU-region Supabase project (URL + keys in `.env`, never committed).
- Stripe account with Stripe Tax enabled; products/prices seeded.
- A branded sending domain configured (no sandbox sender).
- Access to `HOKAN_HANDOFF.md` so the schema being ported is visible to whoever builds.

---

## Open items

- **Partner commission terms** — business decision still pending. Schema carries `commission_model` / `commission_rate` as nullable; attribution works without them, commission backfills once set.
- **Clarity Map** — decide whether to repurpose HOKAN's 5-step gate as an optional client intake/brief, or drop it.
- **Courses** — ship gated downloads first; the LMS layer (lessons/progress) bolts onto `entitlements` later without rework.

---

*FPMC · Vertraulich — nur für den internen Gebrauch.*
