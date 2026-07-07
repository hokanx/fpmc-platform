# FPMC Website — Engineering Handoff (New Build)

> **Audience:** the engineer (human or Claude Code) standing up the new FPMC repository.
> **Companions:** `FPMC_Website-Blueprint.md` (DE, stakeholder spec) · `HOKAN_HANDOFF.md` (source project export).
> **Stand:** 27.06.2026 · Draft v1 · Confidential — internal use only.
>
> This is the build-facing view. Where the German blueprint says *what* and *why*, this says *what to lift,
> from where, and what to fix on the way in*.

---

## 1. What we are building

A single codebase serving two things at once:

1. **Storefront** — a fast, SEO-friendly, cinematic public layer (showreel, portfolio, shop, course catalog, pre-release teasers).
2. **Platform** — an auth-gated app behind it for five distinct audiences (customer, client, member/artist, partner, admin).

The platform half is **not greenfield**. It is a selective port of proven HOKAN modules into a clean repo. The storefront half is mostly new build.

---

## 2. Locked decisions

| Decision | Resolution |
|---|---|
| Reuse strategy | **Fresh repo, lift proven parts** (do not fork — leaves legacy/Lovable/security debt behind) |
| Backend | **New EU-hosted Supabase project** (Auth, Postgres, RLS, Storage) |
| Commerce | **Native**: Stripe + Stripe Tax, own product/order/entitlement tables in EU-Supabase |
| Logistics | **Print-on-demand** (Printful or similar) behind Stripe — no inventory, no shipping |
| Courses | **Gated downloads first**, schema built **LMS-ready** (lessons/progress/quiz later) |
| Buyer role | New lightweight **`customer`** tier (not dragged through client onboarding) |
| Partners | **Invite-only** B2B sales-referral commission model (not e-commerce affiliate) |
| AI provider | **Own provider**, replacing the Lovable AI Gateway |

---

## 3. Port strategy: lift, don't fork

Stand up a clean repo and migrate only what earns its place. The rule: **port the schema and the hard-won modules; leave the platform coupling and the cruft.**

**Lift wholesale (high value, low risk):**
- The i18n system: 4 languages (`en/de/ar/nl`), RTL mirroring CSS, Arabic PDF pipeline (`arabicFont.ts`, Amiri TTF base64, `arabic-persian-reshaper` + `bidi-js`). This is the genuinely hard part and it is already solved.
- The PDF stack: `pdfBranding.ts`, contract/invoice/payment generators, bilingual + RTL.
- The signature stack: `react-signature-canvas`, base64 storage, `contract_signatures` + status-flip trigger.
- `brand.ts` single-source-of-truth pattern (swap every value — see §8).

**Lift the schema (port migrations, keep RLS):**
- Auth/access: `user_access` (pending/approved/rejected), `user_roles`, `client_users`, the `handle_new_user_access()` / `handle_new_client_user()` triggers.
- Portal: `projects`, `project_milestones`, `file_uploads`, `file_versions`, `file_shares`, `client_comments`.
- Backoffice: `contracts`, `contract_signatures`, `invoices` (**19% tax already defaulted**), `payments`, `expenses`, `document_counters` + `get_next_document_number()`.
- Leads chain: `leads` (has `source` + conversion-tracking columns — the partner attribution backbone).
- Libraries: `prompt_library`, `angle_library`, `visual_style_library` (become the internal Playbooks KB).
- AI pipeline: `campaign_blueprints → campaign_angles → campaign_creatives`, `workflow_outputs`.

**Do NOT bring over:**
- Lovable coupling: `gptengineer.js` script tag, `lovable-tagger` Vite plugin, the Lovable AI Gateway.
- Legacy page sprawl (orphaned `AdminLogin/ClientLogin/Login/Signup/AdminDashboard/UserDashboard/ClientPortal`, the `Workspace.tsx` mega-page).
- Dual i18n import paths and dual toast systems (`Toaster` + `Sonner`) — pick one each.
- The disabled `@typescript-eslint/no-unused-vars` rule — turn it back on.
- The Clarity Map 5-step gate — does not fit FPMC audiences. Repurpose as an optional client intake/brief, or drop.

---

## 4. Reuse map (module → HOKAN source → action)

| Module | HOKAN source | Action |
|---|---|---|
| Access & roles | `user_access`, `user_roles`, `client_users` + triggers | Port as-is; **add `customer` role** |
| Client portal | `projects`, `project_milestones`, `file_uploads`, `file_versions`, `client_comments` | Port as-is |
| Member/artist area | nutzer model + `file_shares` | Port + **new profile entity** (Reuse+) |
| Branding-Kit / Pre-Release | versioned uploads, categories, time-limited `file_shares` | Port; gate by role |
| Playbooks KB (internal) | `prompt_library` / `angle_library` / `visual_style_library` pattern | Port pattern; seed with existing `.docx` playbooks |
| Auftragsbestätigung + signed PDF | `contract_signatures`, status trigger, PDF + email stack | Port; add lighter doc type |
| Backoffice | `contracts`, `invoices`, `payments`, `expenses`, counters | Port as-is |
| AI pipeline | `generate-angle-proposals` (Stage 1, wired) | Port; **wire Stage 2** (`generate-creative-drafts` is deployed but unreachable in HOKAN) |
| Partner dashboard | `leads` conversion chain + role model | **New** dashboard on existing chain |
| Merch / Courses | — | **New** (see §5) |

---

## 5. Net-new: commerce + entitlement + partner layer

This is the **single biggest new piece** — HOKAN has B2B service billing but no self-serve product checkout or entitlements. Proposed tables (all EU-Supabase, RLS-gated):

- `products` — merch + digital (ebook/course); `type`, `price`, `stripe_price_id`, `pod_provider_id` (nullable, for print-on-demand).
- `orders` / `order_items` — Stripe-backed; `customer` role owns own rows.
- `entitlements` — `user_id`, `product_id`, `granted_at`, `source` (purchase/manual). **This is what gates course/download access in the portal.** Build it LMS-ready (a later `lessons` / `lesson_progress` pair bolts on without rework).
- `partners` — invite-only; `referral_code`, `commission_terms` (placeholder until §11 is set), `status`.
- `referrals` — links a `partner` to a `leads` row via referral code; commission accrues only on **signed contract or paid invoice**, never on click.

Stripe Tax handles USt., so do not hand-roll tax logic. Entitlements live in your DB regardless of payment provider — that is *why* native beats an embedded Shopify (no entitlement sync, no EU data egress).

---

## 6. Security fixes — apply DURING the port (not after)

These four HOKAN issues conflict with FPMC's data-security standard. Fix them as you port, so they are never inherited:

1. **`campaign-ai-assistant`**: `verify_jwt=false` + a `type=custom` passthrough lets anonymous traffic hit the AI gateway. Set `verify_jwt=true`; remove the passthrough.
2. **Email sender**: HOKAN ships the Resend sandbox `onboarding@resend.dev`. Use a branded FPMC production domain from P0.
3. **`send-payment-reminders`**: no idempotency — re-runs re-send to all overdue clients. Add an idempotency guard.
4. **Hardcoded admin address** (`send-inquiry-followup`): make it config/env-driven.

Plus the baseline: EU Supabase region, RLS on every table, 3-2-1 backups + restore tests per the existing Datensicherungs-Playbook, AVV with Stripe and the POD provider, data minimization.

---

## 7. Stack & infra

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite (SWC), FPMC brand from the ground up |
| Backend | New EU Supabase (Auth, Postgres, RLS, Storage) |
| Commerce | Stripe + Stripe Tax; own product/order/entitlement tables |
| Logistics | Print-on-demand behind Stripe |
| AI | Own provider (replace Lovable gateway) |
| Email | Branded transactional domain |
| Repo | New; selective port of HOKAN modules |

---

## 8. Brand token swap (HOKAN → FPMC)

Keep `brand.ts` as the single source of truth; replace every value. HOKAN is monochrome-dark; FPMC is Navy/Gold.

| Token | FPMC value |
|---|---|
| Primary (Navy) | `#1F3A5F` |
| Accent (Gold) | `#C8A24B` |
| Display font | Cinzel (caps), Pinyon Script (accents) |
| Body / code | Arial / Consolas |
| Motion | Higgsfield loops as brand signature |

**Watch on port:** HOKAN's hardcoded white `cta` button variant (`bg-white text-[#0a0a0a]`) and the dark-mode `!important` overrides in `index.css` fight the FPMC palette. Replace both.

---

## 9. i18n

Lift the whole system. Languages `de/en/ar/nl`, `de` default. RTL block + `tailwindcss-rtl` utilities, flat translation keys kept in sync across all four files, the dev-only integrity check (`window.checkTranslations()`). The Arabic PDF reshaping is the expensive part and ports directly.

---

## 10. Build order (P0–P6)

| Phase | Engineer tasks | Done when |
|---|---|---|
| **P0** | New EU Supabase project, repo init, FPMC tokens in `brand.ts`, branded email domain | Repo + access mgmt, first commit |
| **P1** | Port schema migrations (access, roles, projects, files, contracts, invoices, payments, leads); verify RLS | Migrated DB, RLS green |
| **P2** | Port portal components + i18n/RTL + signature/PDF stack | Working client/member portal |
| **P3** | New storefront (showreel, portfolio, Higgsfield, public services) | Cinematic public layer |
| **P4** | Commerce: products/orders/entitlements + Stripe + POD; gated downloads | Shop & catalog live-ready |
| **P5** | Partner dashboard on leads chain; wire AI pipeline Stage 1 **+ Stage 2** | Affiliate + AI features |
| **P6** | QA, SEO, security hardening (§6), full backup | Vollbackup + release tag |

Each phase ends with a secured, versioned, tagged state — same discipline as the Website-Workflow playbook.

---

## 11. Open items

- **Partner commission terms** — business decision, still open. Placeholder in code/`partners.commission_terms` until set. Sensible default: one-time % of first contract value (10–15%) OR % of monthly retainer for first N months. Nothing structural depends on the number.
- **Clarity Map** — decide: repurpose as optional intake/brief, or drop entirely.
- **Courses depth** — gated downloads ship first; confirm trigger for building the LMS layer.

---

*End of handoff.*
