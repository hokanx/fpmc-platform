# Tutorial Breakdown — "Faceless AI Channel with Claude + Higgsfield MCP"

Source: `https://youtu.be/wU_bmWb6bhg` (host "Adil", ~14:24).
Analyzed 2026-07-14 via Higgsfield scene-by-scene video analysis.

## The claim

A faceless channel (Bright Side, ~44M subs) earns ~$39,500/month (VidIQ
estimate). The video recreates that channel's *format* — not its videos —
with AI in ~20 minutes, using **Claude Fable 5 + Higgsfield MCP**.

## The method, step by step

### Step 1 — Setup (0:00–2:44)
Connect the Higgsfield MCP to Claude (higgsfield.ai → MCP & CLI → copy URL →
Claude → Settings → Connectors → Add custom connector → work in Claude Code).

> ✅ Already done — this repo's Claude session has the Higgsfield MCP connected.

### Step 2 — Niche + script (2:44–5:30)
- Pick a **high-RPM niche**. The video names the top three: **finance, tech,
  education**. Host picks education ("appeals to everyone, huge retention").
- Prompt: *"Analyze the channel, scenarios, hooks, and write me a script for
  a similar video"* + reference channel link. Claude analyzes viral videos,
  finds patterns, picks a topic, writes the script.
- His example output: a multi-act documentary — *"Pompeii: Your Last Day in
  Pompeii"* (second-person, immersive, historical).
- Key rule stated on camera: **"borrow the format, not the videos"** —
  inspiration vs. a reused-content strike.

### Step 3 — Video generation (5:30–8:02)
- Retention requires a visual change every 5–10 s → a 5-minute video needs
  **~30 clips** plus voiceover.
- One prompt: *"Make a five minute video like on the reference account using
  Seedance 2.0, 1080p, it's going on a faceless YouTube channel."*
- Claude + Higgsfield generate all clips, voiceover, and edit — consistent
  characters/style across 10–30 minute videos is the selling point.

> ⚠️ **Cost reality he never mentions:** Seedance 2.0 @1080p costs
> **176 credits per clip** (observed in our own transaction history).
> 30 clips ≈ **5,280 credits per 5-minute video**. This is what drained the
> account during yesterday's experiments. `04_CREDIT-BUDGET.md` has the
> cheaper routes.

### Step 4 — YouTube packaging (8:02–10:09)
Prompt: *"Put together a complete YouTube video package — thumbnails, titles,
everything needed to upload."* → 3 thumbnails (for YouTube's built-in A/B
"Test & Compare"), title options, description, SEO tags, chapters, all saved
to the project folder. Upload → paste metadata → schedule.

### Step 5 — Scale + monetization (8:59–14:24)
- *"Make me two more videos, pick topics that would perform well"* — each
  gets its own research, unique script and visual style (his examples:
  sinking Venice, ocean mysteries).
- **Shorts funnel:** analyze viral Shorts in the niche, produce original
  Shorts → funnel viewers to main videos → subscribers.
- Monetization threshold: **1,000 subscribers + 4,000 watch hours.**
- His monetization rules for AI content: voice must fit, **script original**,
  visuals **properly edited** — YouTube punishes zero-value AI, not AI itself.
- After 3 days his test channel had ~7.3K views.

## What we adopt vs. adapt

| Tutorial | Our plan | Why |
|---|---|---|
| Education niche (Bright Side clone) | **Gaming history documentaries** | Keeps the requested gaming niche *inside* the educational format (see `02_NICHE-DECISION.md`) |
| Seedance 2.0 @1080p (~5,280 cr/video) | gemini_omni / cheaper tier first, upgrade later | Fits the ~1,000-credit balance (see `04_CREDIT-BUDGET.md`) |
| One mega-prompt, trust the output | Pre-written scripts + block prompts (this package) | Script quality is the monetization moat; writing is free |
| "No manual work" | Human-in-the-loop review per episode | 2026 inauthentic-content policy demands it (see `08_POLICY-COMPLIANCE.md`) |
| 3 thumbnails A/B | Same | YouTube Test & Compare is free reach |
| Shorts funnel | Same, from week 2 | Fastest cold-start growth |
