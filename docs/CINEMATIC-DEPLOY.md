# Cinematic masterpiece → fpmc.house — deploy runbook

Branch: `cinematic-masterpiece`. The cinematic scroll-scrub one-pager now owns `/`
(standalone chrome); the verified v0 home moved to `/v0` as fallback. All other v0
routes (`/connect`, `/links`, `/impressum`, `/datenschutz`, `/studio`) are untouched —
the printed QR codes keep working.

## What was added
- `src/pages/CinematicHome.tsx` — the one-pager + scroll choreography (Lenis + GSAP).
- `src/cinematic/` — scrub hero (canvas frame-sequence, portrait-safe), sections
  (manifesto, release vault + countdown, craft chapters, portfolio, services with
  living motifs, numbers, connect, footer), motion toolkit (cursor, magnetic,
  split words, beam rules, marquee), `cinematic.css`.
- `public/media/cinematic/` — 120 hero frames, poster, `the-sound.mp4`,
  `craft-ki.mp4`, portfolio covers (~6 MB total).
- `api/leads.ts` — Vercel serverless function writing to Supabase `public.leads`
  with the service role (RLS stays deny-all; the browser never touches Supabase).
- i18n: `cin.*` keys added to `de/en/ar.json` (reuses existing `services.*`,
  `connect.*`, `nav.*`, `footer.*` keys).
- Deps: `gsap`, `lenis`.

## Deploy steps
1. **Env vars** (Vercel → Project → Settings → Environment Variables, Production):
   - `SUPABASE_URL` — your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — service role secret (server-only; never expose)
2. **Migration**: ensure `supabase/migrations/20260709120000_create_leads_table.sql`
   has been applied (`supabase db push` or SQL editor).
3. **Preview**: push the branch → Vercel builds a preview URL. Verify there:
   scroll the whole page forward AND backward, hero scrub + letterbox + timecode,
   craft chapter switching, countdown ticking, email capture (row appears in
   `leads`), portfolio links, DE/EN/AR + RTL, mobile at 390px (logo must not be
   cropped — it letterboxes), reduced-motion fallback, zero console errors.
4. **Swap**: merge into `main` → Vercel ships it to fpmc.house. v0 remains at `/v0`.
5. Tag (`cinematic-live`) + backup zip → Datentresor `99_Backups_Exporte`.

## Notes
- Tease rule honored: no artist name/face anywhere; release section is the locked
  "Erstes Kapitel · 24.07." vault with a live countdown (Europe/Berlin premiere
  midnight). After 22.07 you can unlock the section (title, embed, presave CTA).
- Email capture is single-opt-in at the API level; `consent_at` is stamped,
  `confirmed_at` stays null until the double-opt-in flow (Block 3) confirms.
- All fonts remain self-hosted (@fontsource); no third-party requests were added
  beyond the existing setup. Portfolio covers are self-hosted screenshots.
