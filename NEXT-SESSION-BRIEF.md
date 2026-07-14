# NEXT SESSION BRIEF — Repo work after v0 launch

Date: 13.07.2026 · Owner: Hazem · Context: v0 is live on fpmc.house. Release is 24 July. Campaign starts 16 July.

---

## Opening prompt (paste this to start)

> Read `CLAUDE.md`, `docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md` and `docs/NEXT-SESSION-BRIEF.md` in full, then scan the repo so your plan is grounded in what already exists on fpmc.house.
>
> Today's blocks, in order: (1) Naming & logo audit — find and fix every "Crew" string and every stale/broken logo reference; use `assets/FPMC_Logo_Club.png` (RGB white-on-black, composite with a lighten blend — the `*_transparent.png` files have no alpha and render as white boxes). (2) Email capture: Supabase `leads` table + double opt-in flow via the branded sender. (3) Legal page for the giveaway T&C, behind a feature flag, not yet linked.
>
> Enter plan mode first. Propose the plan and wait for my approval before writing code. Commit after each block.

---

## Block 1 · Naming & logo audit (do this first — it's a correctness bug)

**The problem:** The brand was renamed from "Crew" to **Club**. Stale references may exist in copy, alt text, meta tags, OG tags, filenames, and the favicon. Additionally, the old "transparent" logo PNGs have **no alpha channel** and render as solid white boxes when composited with an alpha mask.

**Tasks:**
- `grep -ri "crew"` across the repo → fix every hit in copy, alt text, meta/OG tags, and i18n files
- Replace logo references with `assets/FPMC_Logo_Club.png`
- Where the logo sits on a dark background, composite with a lighten/screen blend (black drops out) — or generate a true RGBA version and use that
- Check favicon + OG image — these are the easiest to forget and the most public
- Verify: page title, meta description, OG title/description/image, footer, Impressum all say **Club**

## Block 2 · Email capture (Supabase)

- Migration: `leads` table — `id`, `email` (unique), `locale`, `consent_at`, `confirmed_at`, `created_at`
- Double opt-in: signup → confirmation email via **branded domain sender** (never a sandbox sender) → confirm route sets `confirmed_at`
- GDPR: explicit consent checkbox, consent timestamp stored, link to privacy policy
- Form on `/` and `/links`; success + confirmation states in DE/EN
- Test end-to-end: a real signup must land as a confirmed row

## Block 3 · Giveaway T&C page (feature-flagged)

- Route: `/teilnahmebedingungen` (DE) + `/terms` (EN)
- Content: draft exists (organizer, participation, prize, winner selection, data protection, exclusion, liability) — it has bracketed placeholders that are **not yet filled** and **not yet legally reviewed**
- **Ship behind a feature flag, unlinked.** It may only go live once: (a) the merch addendum is signed by the artist, (b) placeholders are filled, (c) a lawyer has reviewed it
- Hard deadline: must be **live before 23 July 18:00** (the giveaway announcement post)

---

## Tease rule — affects site copy right now

Until **22 July**, the public site must contain: **no artist name, no release date, no artist face.** The countdown line "First chapter: 24.07." is the maximum. From 22 July, name + date go live everywhere (site, bios, OG tags).

Build the release section behind a flag so it can be switched on at 22 July without a rebuild.

---

## Reference docs in this repo
- `docs/SOCIAL-MEDIA-PLAYBOOK.md` — the campaign, post by post (context for site copy and timing)
- `docs/FPMC_Status_v8.pdf` — current project status
- `docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md` — the design system (authoritative on colors/type)
- `docs/FPMC_Cinematic-Website-Handoff.md` — Track 2 masterpiece spec (post-release, do not start now)

## Out of scope for Claude Code
Video generation/editing (Higgsfield + the cutter), the Datentresor file vault, social posting.
