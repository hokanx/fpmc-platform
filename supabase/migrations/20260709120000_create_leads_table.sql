-- ============================================================
-- FPMC · Migration 0001 — leads table (email capture backbone)
-- Created: 2026-07-09 · Block: Website V0 (schema only; capture wired in Block 3)
--
-- Holds double-opt-in email sign-ups. NOTHING writes here yet — this migration
-- only lands the schema so tomorrow's capture flow has a tracked, versioned target.
-- Writes will happen server-side (Edge Function / service role), never from the
-- browser: RLS is enabled with no policies, so anon/auth clients are denied by
-- default (deny-all). Add explicit policies when/if client reads are ever needed.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id            uuid         primary key default gen_random_uuid(),
  email         text         not null unique,
  locale        text         not null default 'de'
                             check (locale in ('de', 'en', 'ar')),
  consent_at    timestamptz,               -- when the user gave consent (opt-in)
  confirmed_at  timestamptz,               -- when the double-opt-in link was confirmed
  created_at    timestamptz  not null default now()
);

comment on table  public.leads               is 'Email capture (double-opt-in). Server-side writes only.';
comment on column public.leads.email         is 'Lowercased at capture time; unique.';
comment on column public.leads.locale        is 'UI language at sign-up: de | en | ar.';
comment on column public.leads.consent_at    is 'Timestamp of opt-in consent (DSGVO).';
comment on column public.leads.confirmed_at  is 'Timestamp of double-opt-in confirmation; null = unconfirmed.';

-- Fast lookups on the confirmation state.
create index if not exists leads_confirmed_at_idx on public.leads (confirmed_at);

-- RLS on (every table, per project rules). No policies = deny-all for anon/auth;
-- the service role bypasses RLS for server-side inserts/updates.
alter table public.leads enable row level security;
