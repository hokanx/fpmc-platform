# Policy & Compliance — keeping the channel monetizable (2026 rules)

The tutorial glosses over this; it decides whether the channel earns or dies.

## The rules that matter

1. **Inauthentic content policy (since July 2025).** Mass-produced,
   template-scripted, verbatim-TTS-over-stock content is demonetized under a
   three-strike system (warning → 90-day YPP suspension → removal). Channels
   with billions of views have been terminated.
2. **AI disclosure (updated Jan 2026).** Synthetic/altered media must be
   flagged at upload ("Altered or synthetic content" checkbox). We check it
   on every upload AND keep a plain-language disclosure in the channel About
   and every description.
3. **Monetization bar:** YouTube pays for AI-assisted content that adds
   original value — research, storytelling, editing craft. The tutorial's own
   rules agree: fitting voice, original script, properly edited.
4. **Kids content:** not applicable — we deliberately avoided it
   (`02_NICHE-DECISION.md`). Never mark episodes Made for Kids; the content
   is general-audience history.

## How this channel stays on the right side

| Risk | Our control |
|---|---|
| "Mass-produced" flag | Every episode has unique human-directed research, script and shot list (this repo is the proof trail — scripts are versioned in git) |
| "Repetitive" flag | Different story, palette accent and structure per episode; no template narration |
| Reused content | 100% original AI visuals — zero game footage, zero screenshots, no recreated copyrighted characters (enforced by NEGATIVE prompt tokens) |
| Trademark/character claims | Generic silhouettes and abstractions (see episode "trademark care" notes); names used editorially in narration only, which is standard documentary practice |
| Factual accuracy | Sources list per episode; re-verify marked facts before production |
| Music claims | Only Higgsfield-generated ambient audio; never imported commercial music. FPMC's own scores may be added later (we own them) |
| Disclosure | Checkbox + About text + description line, every upload |

## Human-in-the-loop record (keep doing this)

For each episode, the git history should show: topic research → script
edits → prompt design → QC checklist ticked. If YouTube ever reviews the
channel, this repo documents genuine authorship in a way clone channels
cannot.

## What we never do

- Upload a video without watching it end-to-end (QC step 7 in the runbook)
- Re-narrate Wikipedia/articles verbatim
- Use another channel's script structure beat-for-beat ("borrow the format,
  not the videos" — even the tutorial says so)
- Batch-publish more than 3 videos/week (velocity is a bot-farm signal)
- Touch kids content, health claims, or finance advice niches with AI visuals
