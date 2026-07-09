# public/media/

Static media served at the site root (e.g. this folder's `hero.png` → `/media/hero.png`).

## hero.png — the homepage hero still

The hero renders a cinematic Higgsfield still when **`public/media/hero.png`** exists,
and gracefully falls back to the CSS projector-beam when it doesn't.

Chosen still (Higgsfield job `c23652fa`) — add it here:

**Option A — GitHub web (easiest):**
1. Open the chosen image and save it to your computer as `hero.png`:
   `https://d8j0ntlcm91z4.cloudfront.net/user_38ohh12MD8UxHOkq7WAoC2QvHHG/hf_20260709_121536_c23652fa-4a9c-4ceb-a9ca-816f6e4f20c3.png`
2. On GitHub, branch `claude/website-v0-fpmc-house-93obc8` → open `public/media/` →
   **Add file → Upload files** → drop `hero.png` → commit.

**Option B — locally:**
```bash
curl -L -o public/media/hero.png "https://d8j0ntlcm91z4.cloudfront.net/user_38ohh12MD8UxHOkq7WAoC2QvHHG/hf_20260709_121536_c23652fa-4a9c-4ceb-a9ca-816f6e4f20c3.png"
git add public/media/hero.png && git commit -m "media: homepage hero still" && git push
```

Vercel redeploys on commit and the hero picks it up automatically. (Optional: compress
to keep it light — a hero ≤ ~1 MB is ideal.)
