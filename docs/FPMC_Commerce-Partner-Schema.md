# FPMC Commerce, Entitlement & Partner Schema

> **Scope:** the net-new data layer with **no HOKAN precedent** — self-serve commerce, digital
> entitlements, and the invite-only partner/referral model. Everything else (auth, roles, projects,
> files, contracts, invoices, payments, leads) is ported from HOKAN; see `FPMC_Website-Engineering-Handoff.md`.
> **Target:** EU-hosted Supabase (Postgres + RLS). All money in integer **cents**, currency default `EUR`.
> **Stand:** 27.06.2026 · Draft v1 · Confidential — internal use only.

---

## 0. How this slots in

These tables sit **alongside** the ported HOKAN tables and reuse them by FK:

- `auth.users`, `user_roles` (adds the new `customer` and `partner` roles)
- `leads` → referral attribution backbone
- `contracts`, `invoices`, `payments` → trigger partner commission accrual
- `document_counters` + `get_next_document_number()` → reuse for `ORD-` numbering

No table here duplicates a HOKAN table. The entitlement layer is the **single gate** for digital access in the portal.

---

## 1. Enums

```sql
CREATE TYPE product_type      AS ENUM ('merch_physical', 'ebook', 'course');
CREATE TYPE product_status    AS ENUM ('draft', 'active', 'archived');
CREATE TYPE product_visibility AS ENUM ('public', 'members', 'hidden');
CREATE TYPE order_status      AS ENUM ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded');
CREATE TYPE entitlement_source AS ENUM ('purchase', 'manual', 'pre_release_grant');
CREATE TYPE partner_status     AS ENUM ('invited', 'active', 'suspended');
CREATE TYPE commission_model   AS ENUM ('one_time_pct', 'retainer_pct');   -- placeholder until §11 of handoff
CREATE TYPE referral_status    AS ENUM ('attributed', 'qualified', 'won', 'lost');
CREATE TYPE commission_status  AS ENUM ('pending', 'accrued', 'paid', 'void');
```

---

## 2. Tables

### 2.1 `products`
Merch + digital catalog. Physical items carry a print-on-demand reference; digital items carry a storage path delivered via entitlement.

```sql
CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type            product_type NOT NULL,
  slug            text UNIQUE NOT NULL,
  title           text NOT NULL,
  description     text,
  price_cents     integer NOT NULL CHECK (price_cents >= 0),
  currency        text NOT NULL DEFAULT 'EUR',
  stripe_product_id text,
  stripe_price_id text,
  pod_provider    text,                 -- 'printful' | null (physical only)
  pod_variant_id  text,                 -- POD variant ref (physical only)
  file_path       text,                 -- storage path for digital deliverable
  visibility      product_visibility NOT NULL DEFAULT 'public',
  is_pre_release  boolean NOT NULL DEFAULT false,
  status          product_status NOT NULL DEFAULT 'draft',
  created_by      uuid REFERENCES auth.users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```
**RLS:** public `SELECT` where `status='active' AND visibility='public'`; members also see `visibility='members'`; admins full CRUD.

### 2.2 `orders`
One row per checkout. `ORD-YYYY-NNNN` via the reused counter.

```sql
CREATE TABLE orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    text UNIQUE NOT NULL,           -- ORD- via get_next_document_number()
  user_id         uuid REFERENCES auth.users(id), -- nullable for guest checkout
  email           text NOT NULL,
  status          order_status NOT NULL DEFAULT 'pending',
  subtotal_cents  integer NOT NULL CHECK (subtotal_cents >= 0),
  tax_cents       integer NOT NULL DEFAULT 0,
  total_cents     integer NOT NULL CHECK (total_cents >= 0),
  currency        text NOT NULL DEFAULT 'EUR',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id   text,
  referral_code   text,                            -- deferred merch-referral mode; column ready now
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```
**RLS:** customer `SELECT` own (`user_id = auth.uid()`); admins all. **No client INSERT** — orders are created server-side by the Stripe webhook only.

### 2.3 `order_items`
Line items with a price/title snapshot (so later product edits never rewrite history).

```sql
CREATE TABLE order_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  title_snapshot  text NOT NULL,
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  quantity        integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  pod_order_id    text,                            -- POD fulfillment ref (physical)
  created_at      timestamptz NOT NULL DEFAULT now()
);
```
**RLS:** view if parent order is viewable; admins all.

### 2.4 `entitlements`  ← the access gate
What grants a user access to a digital product. The portal checks **this table**, never `orders` directly.

```sql
CREATE TABLE entitlements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source          entitlement_source NOT NULL DEFAULT 'purchase',
  order_item_id   uuid REFERENCES order_items(id) ON DELETE SET NULL,
  granted_at      timestamptz NOT NULL DEFAULT now(),
  revoked_at      timestamptz,                     -- set on refund; access checks require IS NULL
  UNIQUE (user_id, product_id)
);
```
**RLS:** user `SELECT` own (`user_id = auth.uid() AND revoked_at IS NULL`); admins all. Insert/update server-side only.
**LMS-ready:** add `lessons(product_id, order_index, ...)` and `lesson_progress(user_id, lesson_id, completed_at)` later — no change to anything above.

### 2.5 `partners`
Invite-only sales partners. One per auth user holding the `partner` role.

```sql
CREATE TABLE partners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name      text NOT NULL,
  company           text,
  referral_code     text UNIQUE NOT NULL,
  commission_model  commission_model,              -- NULL until business decision (handoff §11)
  commission_rate   numeric(5,2) CHECK (commission_rate BETWEEN 0 AND 100),
  commission_months integer,                        -- only for 'retainer_pct'
  status            partner_status NOT NULL DEFAULT 'invited',
  invited_by        uuid REFERENCES auth.users(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
```
**RLS:** partner `SELECT` own row; admins full CRUD. Partners are **admin-created only**.

### 2.6 `referrals`
Attribution + commission ledger. Links a partner to a referred `leads` row, and follows it through to a signed contract.

```sql
CREATE TABLE referrals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  lead_id           uuid REFERENCES leads(id) ON DELETE SET NULL,
  referral_code     text NOT NULL,                 -- snapshot at attribution
  status            referral_status NOT NULL DEFAULT 'attributed',
  contract_id       uuid REFERENCES contracts(id) ON DELETE SET NULL,
  commission_cents  integer CHECK (commission_cents >= 0),
  commission_status commission_status NOT NULL DEFAULT 'pending',
  attributed_at     timestamptz NOT NULL DEFAULT now(),
  won_at            timestamptz,
  paid_at           timestamptz
);
```
**RLS:** partner `SELECT` own referrals (`partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())`); admins all. Status/commission transitions are server-side only.

---

## 3. Stripe webhook flow (edge function)

Single function, **idempotent** (HOKAN's payment-reminder bug was missing idempotency — do not repeat). Verify the Stripe signature; record each `event.id` in a `processed_stripe_events` table and exit early if already seen.

| Stripe event | Action |
|---|---|
| `checkout.session.completed` | Mark order `paid`; for each digital `order_item` create an `entitlement` (`source='purchase'`); for each physical item submit a POD order and store `pod_order_id`; send branded confirmation email |
| `payment_intent.payment_failed` | Mark order `cancelled` |
| `charge.refunded` | Mark order `refunded`; set `revoked_at = now()` on entitlements from that order |

```sql
CREATE TABLE processed_stripe_events (
  event_id    text PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now()
);
```

Tax is computed by **Stripe Tax** at checkout — do not hand-roll USt. logic. Persist the returned tax amount into `orders.tax_cents`.

---

## 4. Partner commission lifecycle

Commission accrues on **closed business only** — never on clicks. Driven by server-side transitions, not client writes.

```
Referred KMU enters with referral_code
        │
        ▼
[attributed]  referrals row created, linked to the new leads row
        │   lead worked by sales
        ▼
[qualified]   lead reaches qualified stage
        │   contract fully signed (contract_signatures) OR invoice paid
        ▼
[won]         set contract_id, won_at; compute commission_cents from
              partners.commission_model + rate; commission_status → 'accrued'
        │   payout executed (recorded against payments)
        ▼
commission_status → 'paid', paid_at set
```

**Commission computation (when `commission_model` is set):**
- `one_time_pct` → `commission_cents = round(first_contract_value_cents * commission_rate/100)`
- `retainer_pct` → `commission_cents = round(monthly_retainer_cents * commission_rate/100) * commission_months`

Until the business sets the model/rate (handoff §11), `referrals` still tracks attribution → won; `commission_cents` stays NULL and is backfilled once terms are fixed.

---

## 5. RLS matrix (summary)

| Table | customer | client | member | partner | admin |
|---|---|---|---|---|---|
| `products` | read active/public | read active/public | + members visibility | read active/public | full |
| `orders` | own | own | own | own | full |
| `order_items` | via own order | via own order | via own order | via own order | full |
| `entitlements` | own (not revoked) | own | own | own | full |
| `partners` | — | — | — | own row | full |
| `referrals` | — | — | — | own | full |

All writes that affect money or access (`orders`, `entitlements`, commission transitions) are **server-side only** via edge functions using the service-role key. Clients never insert them directly.

---

## 6. Build notes

- Add `customer` and `partner` to the `app_role` enum during the P1 schema port.
- Reuse `get_next_document_number('order')` with a seeded `ORD-2026-` counter row.
- Seed Stripe products/prices first; store their IDs on `products` so checkout can reference them.
- Put `entitlement` checks behind a single helper (`has_entitlement(user_id, product_id)`, `SECURITY DEFINER`, `STABLE`) and call it from both RLS and app code.
- Restore-test this schema like any other (per the Datensicherungs-Playbook) before go-live.

---

*End of schema spec.*
