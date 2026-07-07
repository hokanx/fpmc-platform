# CLAUDE.md — FPMC Platform & Storefront (v1, from scratch)

> Read this first, every session. Then read `README.md`, the schema (`/db` DDL + RLS),
> and `FPMC_Website-Blueprint.md` before touching code.
> Build **phase by phase** (P0–P6). Never one-shot the whole platform.

## What we're building
A single fresh codebase, built from scratch — **simple and clean, without compromising
quality or functionality**:
1. **Storefront** — fast, SEO-friendly, cinematic public layer.
2. **Platform** — auth-gated app for customers, clients (KMU), members/artists,
   partners, and the FPMC crew.

No code is ported from any previous project. Earlier projects (HOKAN) may serve as
*reference reading only* if available — never as a base, never copied wholesale.

## v1 module set (locked)
1. **Storefront (public):** home + showreel, services (KMU & Entertainment separated),
   portfolio, shop, courses/ebooks catalog, contact, legal.
2. **Auth & roles:** `visitor` · `customer` · `client` · `member` · `partner` ·
   `admin`/`owner`. `member` and `partner` are **invite-only** (admin-created).
   RLS on every table. Access is granted, never guessed.
3. **Client portal (`client`):** projects, milestones, versioned file uploads,
   approvals, **Auftragsbestätigung with hand signature + PDF** (DE/AR bilingual).
4. **Member area (`member`):** profile, branding-kit downloads, pre-release access —
   a role-gated file library, kept deliberately simple.
5. **Shop — digital only (`customer`):** Stripe + Stripe Tax, orders, **entitlements
   as the single access gate**, gated downloads (ebooks + simple video courses).
   Schema stays LMS-ready and merch/POD-ready; those columns simply stay unused in v1.
6. **Partner (invite-only):** referral code, referred leads, pipeline status.
   Commission display comes when the business number is set (P5 slot-in).
7. **Crew-Workspace (internal, `admin` + crew):** project plan, tasks worked through
   together, live status, uploads. This replaces any built-in backoffice.

## Explicitly OUT of v1
- **Invoicing / office administration** — handled externally via the **Köfman** app.
  The platform's boundary: at most a clean export/webhook toward Köfman later.
  Never build invoice, expense, or accounting logic here.
- Physical merch / print-on-demand (schema-ready, feature off).
- AI pipeline (Blueprint→Angle→Creative), internal playbooks KB, client comments,
  LMS lessons/progress (entitlement schema already supports adding them later).

## Stack (decisions are made — don't relitigate)
- Frontend: React + Vite. Backend: **new EU-hosted Supabase** (Auth, Postgres, RLS, Storage).
- Commerce: Stripe + Stripe Tax; own product/order/entitlement tables (see `/db`).
- Email: transactional via our own branded FPMC domain (no sandbox sender).
- Stripe webhook: **idempotent** (log processed event IDs, exit early on repeats).

## Brand & design
- Web UI: **achromatic, cinematic dark stage** (black/white — FPMC Lichtspiel system).
  **Navy `#1F3A5F` and Gold `#C8A24B` are logo/print tokens only — never web UI colors.**
- Type: Cinzel (display, caps), Inter (body), Pinyon Script (accents),
  Amiri / Noto Naskh Arabic for AR. **Self-host all fonts (OFL) — no Google Fonts CDN (GDPR).**
- Motion signature: Higgsfield loops.
- One token source (`tokens` → CSS variables); nothing hardcoded in components.

## i18n (v1 = launch scope)
**DE / EN / AR** from day one. DE default. AR = full RTL mirroring, built into the
layout system from P0 (logical CSS properties, `dir` switching) — not retrofitted.
Arabic PDF output (Amiri + bidi shaping) for the Auftragsbestätigung.
Flat translation keys, kept in sync across all language files.

## Security / DSGVO (applies from P0)
- EU Supabase region. RLS on every table, strictly role-based.
- **No secrets in the repo** — `.env` (git-ignored) + password manager only.
- All money/access writes (orders, entitlements, referral transitions) are
  **server-side only** (edge functions, service role). Clients never insert them.
- 3-2-1 backups, versioning, restore tests (per the Datensicherung playbook).
- AVV/DPA with processors (Stripe); data minimization.

## Build conventions
- Simple > clever. Small components, one token source, no dual systems
  (one i18n path, one toast, one form pattern).
- Conventional commits; a branch per larger step; tag at each release.
- Every phase ends with a committed, versioned, backed-up state before the next begins.

## Phases (end state per phase)
- **P0** Repo, tokens, EU-Supabase, auth + role skeleton, i18n/RTL foundation → first commit
- **P1** Full schema from `/db` (roles, projects, tasks, files, signatures, products,
  orders, entitlements, partners, referrals) → migrated DB, RLS verified
- **P2** Client portal + member area + signature/PDF (DE/AR) → working portal
- **P3** Storefront (showreel, portfolio, Higgsfield) → cinematic public layer
- **P4** Digital commerce (Stripe + Tax, entitlements, gated downloads) → shop live-capable
- **P5** Partner dashboard + Crew-Workspace; slot in commission terms → internal + partner ops
- **P6** QA, SEO, security hardening, go-live → full backup + release tag

## Open decision (needed at P5, not before)
**Partner commission model** (invite-only B2B referral): one-time % of first-order value
(e.g. 10–15%) OR % of monthly retainer for N months. Attribution is **per signed
contract / paid invoice**, never per click. Structure ships either way.
