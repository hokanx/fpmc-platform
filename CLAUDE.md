# CLAUDE.md — FPMC Platform

Conventions for every Claude Code session in this repo. Keep this file lean — details live in `/docs`.

## What this repo is
One codebase: a cinematic public **storefront** plus (later) an auth-gated **platform**.
**Status: v0 site is LIVE on `fpmc.house`.** Next work builds on top of it.

## 🚨 NAMING — non-negotiable
The brand is **FPMC — Film Production Music CLUB**. Never "Crew".
- Any file, asset, string, alt-text, or copy that says "Crew" is **stale and must be corrected**.
- Legal entity: FPMC – Film Production Music Club (GbR), Bergisch Gladbach, Germany.
- Handles: `@fpmc.club` (Instagram, TikTok, YouTube). Domain: `fpmc.house`. Email: `hello@fpmc.house`.

## 🚨 LOGO — known trap
- **Use `assets/FPMC_Logo_Club.png`** (white logo on black, RGB — composite with a *lighten/screen* blend so the black drops out).
- The old files named `*_transparent.png` have **no alpha channel** (they are RGB, not RGBA). Pasting them with an alpha mask produces a **white box**. Do not use them until real RGBA versions exist.
- Delete/replace any Crew-era logo still in the repo.

## Current phase & priorities
The Radi release is **Friday 24 July 2026, 18:00 CEST** (YouTube Premiere). Campaign starts 16 July.
Repo work, in order:
1. **Audit & fix**: purge any "Crew" strings and stale logos across the codebase.
2. **Email capture** (Supabase `leads` table, double opt-in via branded sender) — not yet live.
3. **Giveaway section** — must be live **before 23 July** (Countdown 2 post). Ships behind a feature flag; only enable when the merch addendum is signed and the T&C page is published.
4. **T&C page** (`/teilnahmebedingungen` + `/terms`) — content exists as a draft, needs placeholders filled and legal review before publishing.
5. Cinematic scroll-scrub upgrade (Track 2) — **after** the release, per `docs/FPMC_Cinematic-Website-Handoff.md`.

## Tease rule (hard, affects site copy)
Before **22 July**: no "Radi" name, no release date, no artist face anywhere public — including the website. From 22 July: name + date go live everywhere.

## Stack (locked)
- React + Vite · Tailwind
- Supabase, **EU region**
- Transactional email via branded domain — **never a sandbox sender**
- i18n: DE (default) / EN / AR with full RTL. Flat keys, kept in sync.
- Deploy: Vercel on `fpmc.house` (GoDaddy DNS)

## Design system: Lichtspiel v2 — see `docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md`
- **Fully achromatic web UI**: void black `#0A0A0A`, carbon, graphite, ash, light `#F2F2F2`. **No accent hue.** Navy/Gold are logo/print only — never web UI.
- Type: **Cinzel** (display, uppercase, cap 96px) · **Inter 300** (body) · **Pinyon Script** (rare) · **Amiri / Noto Naskh Arabic** (RTL). All **self-hosted, OFL** — no Google Fonts CDN (GDPR).
- Motion: slow, confident. Respect `prefers-reduced-motion`.

## Rules
- Secrets only in `.env` (gitignored) — never in code or commits.
- One branch + commit per building block; tag releases.
- GDPR by default: cookie-light, no third-party trackers, EU data residency.
- Plan mode before any multi-file build; get the plan approved first.
- Read files from the repo instead of asking for pastes.
- After each completed block: commit with a clear message, then context can be cleared.

## What Claude Code does NOT do here
- No video generation or editing (that's Higgsfield / the cutter).
- No access to the Datentresor (iCloud/SSD file vault) — repo only.
