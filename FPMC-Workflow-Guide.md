# FPMC WORKFLOW GUIDE — Phone → Computer → Live Website
**Beginner-friendly, step-by-step, copy-paste ready. Same professional results, zero guesswork.**
Version 1 · July 2026 · Companion to the Masterplan & the Datensicherungs-Playbook

---

## 0. The big picture (read once, then never think about it again)

You work with FOUR places. Each has ONE job:

| Place | What it is | Its ONE job |
|---|---|---|
| **Claude app (phone or web)** | This chat, with Higgsfield connected | Think, plan, write copy, **generate images & videos** — from anywhere, even the couch |
| **Claude Code (your computer)** | Claude living inside your real computer | Touch your **real files**: download assets, build websites, run git, deploy |
| **GitHub** | Online copy of your project folder | Backup + version history (copy #2 of the 3-2-1 rule) |
| **Cloudflare** | Where websites go live | Hosting (Workers/Pages — free, fast, already our standard) |

**The golden rule that makes everything simple:**
> Generate on the phone. Save and build on the computer. Every session ends with a commit.

Why the split? This chat's workspace is temporary and can't reach the Higgsfield CDN directly. Your computer can. So Claude (chat) creates, Claude Code collects and builds. Nothing gets lost because every workflow below ends in git.

---

## WORKFLOW 1 — Asset Sync (generate anywhere → safely stored)

**When:** after any Higgsfield session (hero images, clips, logo stings, listing animations).
**Time:** 2 minutes.

### On the phone (or in any chat)
1. Generate with Higgsfield as usual.
2. When you're happy with a result, copy its **CDN link** (looks like `https://d8j0ntlcm91z4.cloudfront.net/...mp4`).
3. Collect the links in a note — one line per link.

### On the computer
4. Open Claude Code inside your FPMC project folder.
5. Paste this (with your links):

```
Run ./fpmc-sync-assets.sh with these links:
<link 1>
<link 2>
If the script is missing or errors, download the files yourself into
04_Media/incoming/<today>/, then git add, commit ("media: sync ..."), and push.
```

6. Done. Files are on your hard drive (copy 1) and GitHub (copy 2).
7. **Once a week:** drag `04_Media` to your cloud drive → copy 3 → 3-2-1 complete.

> The script `fpmc-sync-assets.sh` lives in the repo root. You never need to
> understand it — Claude Code runs and even repairs it for you.

---

## WORKFLOW 2 — Build a Website (spec site or client site)

This is the playbook pipeline (Intake → Plan → Generate → Build → Verify → Deliver) turned into five guided sessions. Each session = one sitting, one clear goal, one commit at the end. You can stop after any session and nothing is lost.

### Session A — The Brief (phone, 10 min)
In this chat, say:

```
New website project: [name, niche, city].
Mode: [fictional spec site / real client].
Client assets I have: [logo? photos? menu/prices? none].
Languages: [DE / DE+EN / DE+AR].
Write the full visual plan: hero image spec + shot list + section map,
following the playbook niche template. Don't generate anything yet.
```

You get the **visual plan** — the contract for everything that follows. Read it. Change anything you don't like NOW (changing a plan is free; regenerating video costs credits).

### Session B — Generate (phone, 20–40 min)
Still in this chat:

```
Plan approved. Generate the hero image first. Show me before making any clips.
```

Then, after you approve the hero image:

```
Hero approved. Generate the clips per the plan — hero clip 2–3 takes,
everything else first take. Std, 1080p, 16:9, ~8s, no audio.
```

**Hard-won rules (already baked into our pipeline — but check they're respected):**
- Hero image FIRST, referenced in every clip. Consistency beats beauty.
- Aerial/drone hero clips: **pure text-to-video** (no start image) — start images on aerials trigger false NSFW flags.
- Real client photos as `start_image` work fine for interiors/products/listings.
- If Higgsfield suggests the preset "IN THE DARK" — always decline it.
- Collect all final CDN links in your note.

### Session C — Sync + Build (computer, 30–60 min)
Open Claude Code in the project folder:

```
1. Sync these assets (Workflow 1): <links>
2. Build the website per the attached visual plan [paste it or point to the file].
   Structure: scroll-scrubbed hero → story → offer → proof → conversion.
   Tech: Lenis smooth scroll, canvas frame scrub, pinned reveals,
   scroll-synced counters, ONE accent color, film grain, sparse copy.
   Mobile: ZERO video payload on phones — poster stills with Ken Burns
   instead; desktop uses lazy data-src loading. Handle iOS svh viewport
   quirks; refresh ScrollTrigger after the preloader completes.
3. Compress all videos for web (~90% smaller).
4. Start a localhost server and tell me the address.
```

### Session D — Verify (computer, 15 min — this is what makes it professional)
Open the localhost address in your browser and personally check:

- [ ] Scroll the ENTIRE page down — smooth? Hero scrubs with your scroll?
- [ ] Scroll all the way back UP — still smooth, no jumps at clip seams?
- [ ] Hover every card/button — reactions work?
- [ ] Submit the form once — behaves correctly?
- [ ] Open on your PHONE (Claude Code gives you a network address) — fast? No video downloads? Text readable?

Anything that feels off, tell Claude Code **like a director, not a developer**:
"hero 20% slower", "this section feels flat, add a subtle hover", "the font looks generic, swap it".
Never regenerate video for something CSS can fix.

Then:
```
Verified. Commit everything: "build: [site name] v1 — verified".
Tag it v1.0 and push.
```

### Session E — Go Live (computer, 10 min)

```
Deploy this site to Cloudflare Workers (our standard path).
Give me the live URL when it's up. Then commit and tag "release".
```

Open the live URL on your phone. Working? **The site exists. Backup exists. Done means verified.**

---

## WORKFLOW 3 — Client Handoff (turning a spec into money)

When a real client says yes to a demo:

1. **Collect:** their logo, real photos, real menu/prices/hours, domain wish (WhatsApp works — photos straight into the chat).
2. **Phone session:** "Swap the [spec site] references with the client's real assets — here are the photos. Regenerate only the clips where the subject changed." (Real photos as start_image — reliable for listings/interiors/food.)
3. **Computer session:** sync new assets → swap into the build → re-verify (full Session D checklist again — no exceptions) → deploy to their domain via Cloudflare.
4. **Backup + invoice:** full backup, tag `client-<name>-release`, then invoice. Offer the upsells: print package, social clips from the same footage, Digital-Boost.

---

## WORKFLOW 4 — The Safety Net (3-2-1, automated where possible)

| What | When | How |
|---|---|---|
| Code + copy | every session end | git commit + push (built into every workflow above) |
| Generated media | after every generation session | Workflow 1 (script does local + GitHub) |
| Cloud copy (#3) | weekly, 5 minutes | drag `04_Media` + `06_Backups` to cloud drive |
| Client source material | the moment it arrives | save to `01_Quellmaterial`, commit, cloud |
| Before ANY go-live | always | full backup + git tag `release` |
| Restore test | every 90 days | tell Claude Code: "clone the repo fresh into a test folder and verify the site runs" |

**If a session gets interrupted:** nothing is lost as long as the last commit happened. Worst case you lose one session's work — never the project.

---

## Quick answers (when something goes wrong)

- **"Claude Code says the script failed"** → just say "fix it and retry" — it will.
- **"A Higgsfield clip got flagged NSFW but it's innocent"** → aerial with a start image? Regenerate as pure text-to-video.
- **"The site feels slow"** → ask Claude Code: "compress the videos again and lazy-load everything below the hero."
- **"I lost track of what's synced"** → ask Claude Code: "list everything in 04_Media/incoming and everything committed this week."
- **"Phone shows a blank hero"** → mobile must use poster stills, never video — remind Claude Code of the zero-video-on-mobile rule.
- **"I'm not sure the backup is real"** → run the restore test (Workflow 4, last row). An untested backup is not a backup.

---

## The whole system on one line

**Phone:** brief → plan → generate → collect links · **Computer:** sync → build → verify → deploy · **Always:** commit, tag, 3-2-1.

*FPMC · Vertraulich — nur für den internen Gebrauch.*
