# CLAUDE.md — FPMC Platform

Conventions for every Claude Code session in this repo. Keep this file lean — details live in `/docs`.

## What this repo is
One codebase, two layers: a cinematic public **storefront** and an auth-gated **platform** (5 audiences).
**Current phase: LAUNCH SLICE** — one cinematic page + `/links` + legal pages. Hard deadline: **live 12 July 2026** (Radi release 24 July). Nothing else ships before that.

## Launch Slice scope (and nothing more)
- Routes: `/` (Radi project hub: hero loop, embedded YouTube, email capture with double opt-in, hidden giveaway section), `/links` (link-in-bio, GDPR-clean, no third-party trackers), `/impressum`, `/datenschutz`
- NO shop, NO login, NO platform features — those are P0–P6 (see `docs/FPMC_Website-Blueprint.md` §10)
- Build the Slice as the first routes of the platform repo, not a throwaway

## Stack (locked)
- React + Vite · Tailwind
- Supabase, **EU region** (email capture table now; full schema port later per `docs/FPMC_Website-Engineering-Handoff.md`)
- Transactional email via branded domain — **never a sandbox sender**
- i18n: DE (default) / EN / AR with full RTL. Flat translation keys, kept in sync across all language files.

## Design system: Lichtspiel v2 — SUPERSEDES Blueprint §6
See `docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md`. The short version:
- **Fully achromatic web UI**: void black `#0A0A0A`, carbon, graphite. Navy `#1F3A5F` and gold `#C8A24B` are **logo/print only — never web UI**.
- Type: **Cinzel** (display, uppercase, hard cap 96px, neutral-to-positive tracking) · **Inter 300** (body) · **Pinyon Script** (rare accents) · **Amiri / Noto Naskh Arabic** (AR/RTL)
- All fonts **self-hosted, OFL** — no Google Fonts CDN (GDPR)
- Motion: Higgsfield loops as brand signature (assets in `assets/`, prompts in `docs/FPMC_WS2_Asset-Kit_EN.md`)

## Rules
- Secrets only in `.env` (gitignored) — never in code, never in commits
- One branch + commit per building block; PR-sized changes; tag releases (`slice-v1` etc.)
- GDPR by default: cookie-light, no tracking without consent, EU data residency
- Fix, don't inherit: the four known HOKAN weaknesses (unauthenticated AI passthrough, sandbox sender, non-idempotent payment reminders, hardcoded admin address) must not enter this repo
- German copy is the default surface language; EN mirrors; AR via the i18n system

## Working style
- Plan mode before any multi-file build; get the plan approved first
- Read files from the repo instead of asking for pastes
- After each completed block: commit with a clear message, then the context can be cleared
