# public/media/

Static media served at the site root. The homepage hero uses these when present and
falls back gracefully: **video → image → CSS projector-beam**.

The sandbox egress policy blocks the Higgsfield CDN, so these files are added
out-of-band (GitHub web upload or a local `git` commit).

## hero-loop.mp4 — cinematic hero loop (preferred)

A seamless monochrome loop plays behind the poster type. Recommended:

- **`fc454d44`** (kling, beam-room, 5s, **no logo** — composites cleanest, since the
  site overlays the real SVG logo on top):
  `https://d8j0ntlcm91z4.cloudfront.net/user_38ohh12MD8UxHOkq7WAoC2QvHHG/hf_20260709_132649_fc454d44-24d6-46cc-bb57-b61675993236.mp4`
- Alternative — **`6d36f15c`** (Seedance, logo baked in, 10s). Only use this if you also
  remove the SVG logo overlay, or it'll double up.

Add as **`public/media/hero-loop.mp4`** (compress to ≤ ~4 MB, muted, seamless).

## hero.png — poster fallback still

Used as the `<video>` poster and when no loop is present. Chosen still `c23652fa`:
`https://d8j0ntlcm91z4.cloudfront.net/user_38ohh12MD8UxHOkq7WAoC2QvHHG/hf_20260709_121536_c23652fa-4a9c-4ceb-a9ca-816f6e4f20c3.png`
Add as **`public/media/hero.png`**.

## How to add (either file)

**GitHub web:** open the file's URL → save to disk → GitHub → branch
`claude/website-v0-fpmc-house-93obc8` → `public/media/` → Add file → Upload files → commit.

**Local:**
```bash
curl -L -o public/media/hero-loop.mp4 "<url above>"
git add public/media/ && git commit -m "media: hero loop + still" && git push
```

Vercel redeploys on commit; the hero picks them up automatically.
