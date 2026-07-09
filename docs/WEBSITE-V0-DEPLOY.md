# Website V0 — Deploy & QA (fpmc.house)

Everything needed to take this repo live on **fpmc.house** and sign off the QA gate.
The repo is deploy-ready (Vite build, `vercel.json` with SPA rewrites + security headers).

---

## Local dev

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the built dist/ locally
```

No env vars are required for V0 (no capture, no auth). `.env.example` is a placeholder
for Block 3.

---

## Deploy to Vercel (free tier)

**Recommended: GitHub integration** (auto-deploys on every push).

1. vercel.com → **Add New… → Project** → import `hokanx/fpmc-platform`.
2. Vercel auto-detects Vite. Confirm:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
3. **Deploy.** You get a `*.vercel.app` URL — smoke-test it before wiring the domain.

> Deploying the `claude/website-v0-fpmc-house-93obc8` branch first is fine for a
> preview; point production at the branch you merge to `main`.

_CLI alternative:_ `npm i -g vercel && vercel --prod` (from repo root).

---

## Domain: GoDaddy → fpmc.house

1. Vercel → Project → **Settings → Domains → Add** `fpmc.house` (and `www.fpmc.house`).
2. Vercel shows the exact DNS records. In **GoDaddy → my domain → DNS**, set:

   | Type  | Name | Value                    |
   |-------|------|--------------------------|
   | A     | `@`  | `76.76.21.21`            |
   | CNAME | `www`| `cname.vercel-dns.com`   |

   **Always use the values Vercel displays** — if they differ from the table, Vercel wins.
   Remove any conflicting parked/forwarding A or CNAME records GoDaddy added by default.
3. Wait for propagation (minutes to ~1h). Vercel issues the SSL cert automatically.
4. Verify:
   ```bash
   curl -sSI https://fpmc.house | head -n 1        # expect: HTTP/2 200
   ```
   Then open `https://fpmc.house`, `/connect`, `/links` on a phone — HTTPS, no errors.

---

## Email forwarding — hello@fpmc.house

Set up in **GoDaddy Email / Email Forwarding** (or your mailbox provider): forward
`hello@fpmc.house` → the real inbox. Test **send + receive** before sign-off (the
site's CTAs are all `mailto:hello@fpmc.house`).

---

## Acceptance checklist (QA gate — Dilara + 2nd person)

- [ ] `fpmc.house`, `/connect`, `/links` load on a phone, HTTPS, no console errors
- [ ] Both business-card QR codes (from the printed proof) land correctly
- [ ] `hello@fpmc.house` forwarding tested (send + receive)
- [ ] Impressum reachable from every page (footer) — and Datenschutz
- [ ] No name/Radi mention anywhere (tease rule)
- [ ] Lighthouse performance > 90 on `/links` (mobile)
- [ ] Impressum `[[placeholders]]` replaced with real GbR data before public sharing
- [ ] Tag `v0-live` + full backup zip → Datentresor `99_Backups_Exporte`

```bash
git tag v0-live && git push origin v0-live
```

---

## Post-launch: swap in the Higgsfield hero loop

The hero renders a CSS projector-beam until a video is provided. When the loop is ready:

1. Compress to **≤ 4 MB**, muted, seamless-loop, add a poster still.
2. Drop the files at `public/media/hero-loop.mp4` and `public/media/hero-poster.jpg`.
3. In `src/components/Hero.tsx`, set `HERO_VIDEO_SRC = "/media/hero-loop.mp4"`.
4. `npm run build`, verify `prefers-reduced-motion` still shows the poster, commit, push.
