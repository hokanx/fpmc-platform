# Build Session Kickoff — how to run a Claude Code session in this repo

Paste-ready opening prompt for each session, plus the block list. One session = one block.

## Opening prompt (template)
> Read CLAUDE.md and docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md. Today's block: [BLOCK].
> Enter plan mode, propose the plan, wait for my approval before writing code.

## Launch Slice — block list (in order)
| # | Block | Contents | Done when |
|---|---|---|---|
| 1 | Scaffold | Vite + React + Tailwind, self-hosted fonts, Lichtspiel tokens as CSS variables, routing skeleton (/, /links, /impressum, /datenschutz), i18n setup DE/EN/AR + RTL | dev server runs, tokens render, RTL flips |
| 2 | Hero + hub | Hero with Higgsfield loop (poster fallback), Radi section with YouTube embed placeholder, countdown to 24.07. 18:00 CEST | mobile + desktop reviewed |
| 3 | Email capture | Supabase table `leads` (email, locale, consent_at, confirmed_at), double-opt-in flow via branded sender, success/confirm pages | test signup lands confirmed row |
| 4 | /links | Link-in-bio route: logo, 4–6 buttons, Lichtspiel style, zero third-party | loads < 1s on 4G |
| 5 | Legal + QA | Impressum, Datenschutz, cookie-light check, Lighthouse pass, a11y focus states | QA gate sign-off (Dilara + 2nd) |
| 6 | Deploy + tag | Production deploy, domain, tag `slice-v1`, full backup zip to Datentresor `99_Backups_Exporte` | live URL shared to team |

## Session rules
- Plan mode first, always. Approve before build.
- Commit after every block: `block-N: <what>` — then /clear is safe.
- Giveaway section ships hidden behind a flag; it only turns on after the merch addendum is signed and T&C are live (23 Jul).
- Never touch: pricing, shop, auth — out of scope until after 24 Jul.

## Context pointers (don't paste these, reference them)
- Spec: docs/FPMC_Website-Blueprint.md (DE) · docs/FPMC_Website-Engineering-Handoff.md (EN)
- Design: docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md
- Assets & video prompts: docs/FPMC_WS2_Asset-Kit_EN.md · assets/
- Future module (do NOT build yet): docs/FPMC_Crew-Workspace_Concept_EN.md
