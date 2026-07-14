# How to update the repo (2 minutes)

## 1. Files to ADD / REPLACE in the repo
```
CLAUDE.md                          → REPLACE the existing one (naming + logo rules added)
docs/NEXT-SESSION-BRIEF.md         → NEW (what Claude Code builds next)
docs/SOCIAL-MEDIA-PLAYBOOK.md      → NEW (campaign context)
docs/FPMC_Status_v8.pdf            → NEW (current status)
assets/FPMC_Logo_Club.png          → NEW (the correct Club logo)
```

## 2. Files to DELETE from the repo
- Any logo file with "Crew" in the name or content
- The `*_4K_*_transparent.png` logos — **they have no alpha channel** and render as white boxes. Keep them only if you re-export real RGBA versions.

## 3. Do it via GitHub web (no terminal needed)
1. Open your repo → `Add file` → `Upload files`
2. Drag the contents of this folder in (keeping the `docs/` and `assets/` structure)
3. Commit message: `Update: Club naming, corrected logo, next-session brief`
4. Then delete the stale logo files: click each → trash icon → commit

## 4. Start the session
On the laptop, in the repo folder:
```
claude
```
Then paste the opening prompt from `docs/NEXT-SESSION-BRIEF.md`.

## Known trap (already documented in CLAUDE.md)
The old "transparent" PNGs are RGB, not RGBA. Compositing them with an alpha mask produces a solid white box. Until you export true RGBA versions, use `FPMC_Logo_Club.png` (white on black) with a lighten/screen blend.
