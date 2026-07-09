# WEBSITE-V0 SESSION BRIEF — fpmc.house goes live today

Date: 08.07.2026 · Owner: Hazem + Claude Code · Target: live before end of day (QR codes on printed cards point here)

---

## Opening prompt (paste this to start the session)

> Read CLAUDE.md and docs/DESIGN-SYSTEM-LICHTSPIEL-V2.md. Today's block: WEBSITE V0 — a live one-page site on fpmc.house per docs/WEBSITE-V0-SESSION-BRIEF.md. Enter plan mode, propose the plan, wait for my approval before writing code.

## Scope (v0 — today, nothing more)

| Route | Content |
|---|---|
| `/` | Hero (logo hero-loop video, poster fallback, `prefers-reduced-motion` respected) → Services section (copy below) → "First chapter: 24.07. ⏳" teaser line → Contact (hello@fpmc.house) |
| `/connect` | Collaboration page: short pitch for artists & partners + contact button (mailto hello@fpmc.house) — QR 2 on the business card points HERE |
| `/links` | Link-in-bio: logo + buttons (YouTube, Instagram, TikTok, Contact, later: Premiere link) |
| `/impressum`, `/datenschutz` | Legal (GbR details from CLAUDE.md context; privacy covering hosting + later email capture) |

**Explicitly NOT today:** email capture/double-opt-in (tomorrow, Block 3), giveaway section, Radi's name anywhere (tease rule until 22.07.), shop, auth.

## Non-negotiables
- Lichtspiel v2: achromatic only, self-hosted fonts (Cinzel/Inter/Pinyon/Amiri), no Google Fonts CDN, no third-party trackers, cookie-light
- i18n from day one: DE default / EN / AR with RTL — v0 may launch DE+EN and stub AR keys, but the i18n structure must be in place
- Assets: hero loop from `assets/` (the logo-anchored Higgsfield loop, downscaled/compressed for web ≤ 4 MB, muted, loop, playsinline)
- Mobile-first; Lighthouse performance > 90 on `/links`

## DNS + Deploy (do this INSIDE the session — Claude Code guides each step)
1. Deploy to Vercel (free tier): `vercel` CLI or GitHub integration on the repo
2. In Vercel: add domain `fpmc.house`
3. In GoDaddy DNS: set A record `@` → 76.76.21.21 and CNAME `www` → cname.vercel-dns.com (Vercel shows the exact values — use what Vercel displays)
4. Wait for propagation (minutes to ~1h), verify https://fpmc.house resolves with SSL
5. Tag `v0-live`, full backup zip → Datentresor `99_Backups_Exporte`

## Acceptance checklist (QA gate — Dilara + second person)
☐ fpmc.house + /connect + /links load on phone, https, no console errors
☐ Both business-card QR codes scanned from the printed proof land correctly
☐ hello@fpmc.house forwarding tested (send + receive)
☐ Impressum reachable from every page (footer)
☐ No Radi mention anywhere
☐ Tag + backup done

---

## Services section copy (drop-in)

### DE
**Was wir für Unternehmen bauen**

**KI-Werbevideos** — Modulare Werbeclips für Social Media (Reels, TikTok Ads). Produktion innerhalb von 48 Stunden durch KI-gestützte Pipelines.

**Websites, die Kunden bringen** — Landingpages und Websites für lokale Betriebe, direkt auf Neukundengewinnung optimiert. Cinematic, schnell, DSGVO-sauber.

**Digital-Boost (Kombipaket)** — Website + 3 KI-Werbevideos, als Abo oder Festpreis. Ein Partner für den kompletten digitalen Auftritt.

**Für Artists & Labels** — High-End-Musikproduktion mit Cross-Cultural-Sound, kinematografische Musikvideos (KI für VFX & Postproduktion), dokumentarische Content-Begleitung und Podcast-Produktion.

*CTA: „Projekt anfragen" → mailto:hello@fpmc.house*

### EN
**What we build for businesses**

**AI ad videos** — Modular ad clips for social media (Reels, TikTok ads). Produced within 48 hours through AI-powered pipelines.

**Websites that win clients** — Landing pages and websites for local businesses, optimized directly for customer acquisition. Cinematic, fast, GDPR-clean.

**Digital Boost (bundle)** — Website + 3 AI ad videos, as subscription or fixed price. One partner for your entire digital presence.

**For artists & labels** — High-end music production with a cross-cultural sound, cinematic music videos (AI for VFX & post-production), documentary content coverage and podcast production.

*CTA: "Start a project" → mailto:hello@fpmc.house*

### /connect page copy (DE / EN)
DE: **Lass uns etwas bauen.** FPMC verbindet Film, Musik und KI — und die DACH-Welt mit MENA. Ob Artist, Brand oder Kreativpartner: Wenn du etwas Außergewöhnliches machen willst, melde dich. → hello@fpmc.house
EN: **Let's build something.** FPMC connects film, music and AI — and the German-speaking world with MENA. Artist, brand or creative partner: if you want to make something exceptional, reach out. → hello@fpmc.house

---

## Handoff note
After the session: commit history + tag in GitHub, this brief stays in `docs/`, live URL shared in the team chat, and tomorrow's session picks up Block 3 (email capture) from BUILD-SESSION-KICKOFF.md.
